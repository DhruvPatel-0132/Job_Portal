const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Profile = require("../models/Profile");
const { getIO } = require("../config/socket");
const cloudinary = require("../config/cloudinary");

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch conversations where user is a participant or has left
    const conversations = await Conversation.find({
      $or: [
        { participants: userId },
        { "leftUsers.userId": userId }
      ]
    })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    // Format response: attach other participant's profile and calculate unread count
    const formattedConversations = await Promise.all(
      conversations.map(async (conv) => {
        if (conv.type === "group") {
          const hasLeft = conv.leftUsers?.some(
            (lu) => lu.userId?.toString() === userId
          );

          // Exited users do not have any new unread messages
          const unreadCount = hasLeft ? 0 : await Message.countDocuments({
            conversationId: conv._id,
            senderId: { $ne: userId },
            seenBy: { $ne: userId },
          });

          let lastMessage = conv.lastMessage;
          if (hasLeft) {
            lastMessage = {
              _id: `system_${conv._id}`,
              conversationId: conv._id,
              senderId: userId,
              message: "You left the group",
              messageType: "system",
              createdAt: conv.updatedAt,
            };
          }

          return {
            _id: conv._id,
            participants: conv.participants,
            lastMessage,
            updatedAt: conv.updatedAt,
            unreadCount,
            type: "group",
            groupName: conv.groupName,
            groupAdmins: conv.groupAdmins,
            groupAvatar: conv.groupAvatar || "/group-avatar.svg",
            otherParticipant: {
              _id: conv._id, // use group id as key to avoid key collisions
              fullName: conv.groupName,
              avatar: conv.groupAvatar || "/group-avatar.svg",
              headline: "Group Chat",
              type: "group",
            },
          };
        } else {
          const otherParticipantId = conv.participants.find(
            (p) => p.toString() !== userId
          );

          // Fetch unread count for this conversation (messages sent by other user, not seen yet)
          const unreadCount = await Message.countDocuments({
            conversationId: conv._id,
            senderId: otherParticipantId,
            isSeen: false,
          });

          // Fetch other participant profile
          const profile = await Profile.findOne({ userId: otherParticipantId }).select(
            "fullName avatar headline"
          );

          return {
            _id: conv._id,
            participants: conv.participants,
            lastMessage: conv.lastMessage,
            updatedAt: conv.updatedAt,
            unreadCount,
            type: "private",
            otherParticipant: {
              _id: otherParticipantId,
              fullName: profile?.fullName || "LinkedIn Member",
              avatar: profile?.avatar || "/avatar.svg",
              headline: profile?.headline || "",
              type: "private",
            },
          };
        }
      })
    );

    res.status(200).json({ success: true, conversations: formattedConversations });
  } catch (error) {
    console.error("getConversations error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userId: targetId } = req.params; // targetId could be either a conversationId or another userId

    // Check if targetId is an existing conversation
    let conversation = null;
    if (targetId.match(/^[0-9a-fA-F]{24}$/)) {
      conversation = await Conversation.findById(targetId);
    }

    if (conversation) {
      // It's a direct conversation lookup by Conversation ID
      // Validate that the user is a participant or has left the group
      const hasLeft = conversation.leftUsers?.some(
        (lu) => lu.userId?.toString() === userId
      );
      if (!conversation.participants.includes(userId) && !hasLeft) {
        return res.status(403).json({ success: false, message: "Not authorized to view these messages" });
      }
    } else {
      // It's a private chat lookup by other user's ID
      conversation = await Conversation.findOne({
        participants: { $all: [userId, targetId] },
        type: "private",
      });
    }

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [], conversationId: null });
    }

    const hasLeft = conversation.leftUsers?.some(
      (lu) => lu.userId?.toString() === userId
    );

    // Mark messages as seen if we are fetching them and have not left
    if (!hasLeft) {
      if (conversation.type === "group") {
        await Message.updateMany(
          {
            conversationId: conversation._id,
            senderId: { $ne: userId },
            seenBy: { $ne: userId },
          },
          { $addToSet: { seenBy: userId } }
        );
      } else {
        const otherUserId = conversation.participants.find(p => p.toString() !== userId);
        if (otherUserId) {
          await Message.updateMany(
            {
              conversationId: conversation._id,
              senderId: otherUserId,
              isSeen: false,
            },
            { $set: { isSeen: true } }
          );

          // Emit 'messagesSeen' to the sender so their UI updates
          const io = getIO();
          if (io) {
            io.to(otherUserId.toString()).emit("messagesSeen", {
              conversationId: conversation._id,
              seenBy: userId,
            });
          }
        }
      }
    }

    // Build the query to retrieve messages
    const messagesQuery = { conversationId: conversation._id };
    if (hasLeft) {
      const leftEntry = conversation.leftUsers.find(
        (lu) => lu.userId?.toString() === userId
      );
      if (leftEntry) {
        messagesQuery.createdAt = { $lte: leftEntry.leftAt };
      }
    }

    const messages = await Message.find(messagesQuery).sort({
      createdAt: 1,
    });

    // Populate sender profile info for each message
    const populatedMessages = await Promise.all(
      messages.map(async (msg) => {
        const senderProfile = await Profile.findOne({ userId: msg.senderId }).select(
          "fullName avatar headline"
        );
        return {
          ...msg.toObject(),
          sender: {
            _id: msg.senderId,
            fullName: senderProfile?.fullName || "LinkedIn Member",
            avatar: senderProfile?.avatar || "/avatar.svg",
            headline: senderProfile?.headline || "",
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      messages: populatedMessages,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("getMessages error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.markAsSeen = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (conversation.type === "group") {
      await Message.updateMany(
        {
          conversationId,
          senderId: { $ne: userId },
          seenBy: { $ne: userId },
        },
        { $addToSet: { seenBy: userId } }
      );
    } else {
      const otherUserId = conversation.participants.find(p => p.toString() !== userId);
  
      await Message.updateMany(
        {
          conversationId,
          senderId: otherUserId,
          isSeen: false,
        },
        { $set: { isSeen: true } }
      );
  
      const io = getIO();
      if (io) {
        io.to(otherUserId.toString()).emit("messagesSeen", {
          conversationId,
          seenBy: userId,
        });
      }
    }

    res.status(200).json({ success: true, message: "Messages marked as seen" });
  } catch (error) {
    console.error("markAsSeen error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { name, avatar, participantIds } = req.body;
    const adminId = req.user.id;

    if (!name || !participantIds || !Array.isArray(participantIds) || participantIds.length < 2) {
      return res.status(400).json({ success: false, message: "A group chat requires a minimum of three members (you and at least two others)." });
    }

    // Ensure adminId is part of the participants list
    const participants = Array.from(new Set([adminId, ...participantIds]));

    const newGroup = await Conversation.create({
      participants: [...participantIds, adminId],
      type: "group",
      groupName: name,
      groupAdmins: [adminId],
      groupAvatar: avatar || "/group-avatar.svg",
    });

    const io = getIO();
    if (io) {
      participants.forEach((pId) => {
        io.to(pId.toString()).emit("group:create", newGroup);
      });
    }

    res.status(201).json({ success: true, group: newGroup });
  } catch (error) {
    console.error("createGroup error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const groups = await Conversation.find({
      $or: [
        { participants: userId },
        { "leftUsers.userId": userId }
      ],
      type: "group",
    })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    const formattedGroups = await Promise.all(
      groups.map(async (group) => {
        const unreadCount = await Message.countDocuments({
          conversationId: group._id,
          senderId: { $ne: userId },
          seenBy: { $ne: userId },
        });

        return {
          _id: group._id,
          participants: group.participants,
          lastMessage: group.lastMessage,
          updatedAt: group.updatedAt,
          unreadCount,
          type: "group",
          groupName: group.groupName,
          groupAdmins: group.groupAdmins,
          groupAvatar: group.groupAvatar || "/group-avatar.svg",
          otherParticipant: {
            _id: group._id,
            fullName: group.groupName,
            avatar: group.groupAvatar || "/group-avatar.svg",
            headline: "Group Chat",
            type: "group",
          }
        };
      })
    );

    res.status(200).json({ success: true, groups: formattedGroups });
  } catch (error) {
    console.error("getUserGroups error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getGroupMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    // Validate that the requestor is part of the conversation (either active or has left)
    const hasLeft = conversation.leftUsers?.some(
      (lu) => lu.userId?.toString() === userId
    );
    if (!conversation.participants.includes(userId) && !hasLeft) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Fetch profile details for all active participants
    const members = await Promise.all(
      conversation.participants.map(async (pId) => {
        const profile = await Profile.findOne({ userId: pId }).select("fullName avatar headline");
        return {
          _id: pId,
          fullName: profile?.fullName || "LinkedIn Member",
          avatar: profile?.avatar || "/avatar.svg",
          headline: profile?.headline || "",
        };
      })
    );

    res.status(200).json({ success: true, members });
  } catch (error) {
    console.error("getGroupMembers error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.exitGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(400).json({ success: false, message: "You are not a member of this group" });
    }

    // Fetch leaving user's profile to get their name
    const leavingUserProfile = await Profile.findOne({ userId }).select("fullName");
    let userName = leavingUserProfile?.fullName;

    // Fallback to User's firstName and lastName if profile does not exist or has no name
    if (!userName && req.user) {
      if (req.user.firstName || req.user.lastName) {
        userName = `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim();
      }
    }

    if (!userName) {
      userName = "A member";
    }

    // Create system message in DB first so we can use its createdAt timestamp
    const systemMessage = await Message.create({
      conversationId: conversation._id,
      senderId: userId, // Keep track of who left
      message: `${userName} has left the group`,
      messageType: "system",
    });

    // Remove from participants
    conversation.participants = conversation.participants.filter(p => p.toString() !== userId);

    // Initialize leftUsers if it doesn't exist, and add with exit timestamp slightly after message creation
    if (!conversation.leftUsers) {
      conversation.leftUsers = [];
    }
    const alreadyLeft = conversation.leftUsers.some(
      (lu) => lu.userId?.toString() === userId
    );
    if (!alreadyLeft) {
      conversation.leftUsers.push({
        userId: userId,
        leftAt: new Date(systemMessage.createdAt.getTime() + 1000), // Enforce limit 1s after system message
      });
    }

    // If leaving user was admin, assign next participant as admin
    // Check if the user is an admin
    const isAdmin = conversation.groupAdmins.some(admin => admin.toString() === userId);

    if (isAdmin) {
      // If user is an admin, remove them from the admin list
      conversation.groupAdmins = conversation.groupAdmins.filter(admin => admin.toString() !== userId);
      
      // If no admins left but there are participants, assign a random participant as admin
      if (conversation.groupAdmins.length === 0 && conversation.participants.length > 0) {
        conversation.groupAdmins = [conversation.participants[0]];
      }
    }

    // Update conversation lastMessage
    conversation.lastMessage = systemMessage._id;
    await conversation.save();

    // Populate sender profile for the socket broadcast
    const populatedMessage = {
      ...systemMessage.toObject(),
      sender: {
        _id: userId,
        fullName: userName,
        avatar: "/avatar.svg",
        headline: "System",
      },
    };

    // Emit Socket.IO event: "group:userLeft" to the room
    const io = getIO();
    if (io) {
      // Broadcast to all room members (including the one who left so they see it instantly)
      io.to(conversation._id.toString()).emit("group:userLeft", {
        conversationId: conversation._id,
        userId,
        message: populatedMessage,
      });
    }

    res.status(200).json({ success: true, message: "Exited group successfully" });
  } catch (error) {
    console.error("exitGroup error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.editGroupDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, avatar } = req.body;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    const isAdmin = conversation.groupAdmins.some(admin => admin.toString() === userId);
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Only the group admin can edit group details" });
    }

    if (name) conversation.groupName = name;
    
    if (avatar !== undefined && avatar !== conversation.groupAvatar) {
      // If there was an old avatar and it was a Cloudinary URL, delete it
      if (conversation.groupAvatar && conversation.groupAvatar.includes("cloudinary.com")) {
        try {
          // Extract public_id from URL: e.g. https://res.cloudinary.com/.../upload/v1234/folder/file.jpg
          const parts = conversation.groupAvatar.split("/upload/");
          if (parts.length === 2) {
            let path = parts[1];
            // Remove version tag (e.g., v1234567890/) if present
            path = path.replace(/^v\d+\//, "");
            // Remove file extension
            const publicId = path.replace(/\.[^/.]+$/, "");
            if (publicId) {
              const fs = require("fs");
              fs.appendFileSync("cloudinary_debug.txt", `Deleting publicId: ${publicId}\n`);
              const destroyResult = await cloudinary.uploader.destroy(publicId);
              fs.appendFileSync("cloudinary_debug.txt", `Destroy result: ${JSON.stringify(destroyResult)}\n`);
            }
          }
        } catch (err) {
          const fs = require("fs");
          fs.appendFileSync("cloudinary_debug.txt", `Error: ${err.message}\n`);
          console.error("Error deleting old group avatar from Cloudinary:", err);
        }
      }
      conversation.groupAvatar = avatar;
    }

    await conversation.save();

    const io = getIO();
    if (io) {
      io.to(conversation._id.toString()).emit("group:updated", conversation);
    }

    res.status(200).json({ success: true, group: conversation });
  } catch (error) {
    console.error("editGroupDetails error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.addGroupMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;
    const { participantIds } = req.body;

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return res.status(400).json({ success: false, message: "No members specified to add." });
    }

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    const isAdmin = conversation.groupAdmins.some(admin => admin.toString() === adminId);
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Only the group admin can add members." });
    }

    let addedCount = 0;
    participantIds.forEach((pId) => {
      if (!conversation.participants.includes(pId)) {
        conversation.participants.push(pId);
        addedCount++;
        // Remove from leftUsers if they previously left
        if (conversation.leftUsers) {
          conversation.leftUsers = conversation.leftUsers.filter(
            (lu) => lu.userId?.toString() !== pId.toString()
          );
        }
      }
    });

    if (addedCount > 0) {
      await conversation.save();

      // Emit update so everyone can refresh members
      const io = getIO();
      if (io) {
        io.to(conversation._id.toString()).emit("group:updated", conversation);
        // Also emit group:create to the new members so they join the room on client side
        participantIds.forEach((pId) => {
          io.to(pId.toString()).emit("group:create", conversation);
        });
      }
    }

    res.status(200).json({ success: true, group: conversation });
  } catch (error) {
    console.error("addGroupMembers error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.removeGroupMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const adminId = req.user.id;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    const isAdmin = conversation.groupAdmins.some(admin => admin.toString() === adminId);
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Only the group admin can remove members." });
    }

    if (adminId === memberId) {
      return res.status(400).json({ success: false, message: "Admin cannot remove themselves. Use 'Exit Group' instead." });
    }

    if (!conversation.participants.includes(memberId)) {
      return res.status(400).json({ success: false, message: "User is not a member of this group." });
    }

    // Fetch removed user's profile to get their name
    const removedUserProfile = await Profile.findOne({ userId: memberId }).select("fullName");
    let userName = removedUserProfile?.fullName || "A member";

    // Create system message
    const systemMessage = await Message.create({
      conversationId: conversation._id,
      senderId: adminId, // Admin initiated
      message: `Admin has removed ${userName}`,
      messageType: "system",
    });

    // Remove from participants
    conversation.participants = conversation.participants.filter(p => p.toString() !== memberId);
    
    // If the removed member was an admin, remove them from admins
    conversation.groupAdmins = conversation.groupAdmins.filter(admin => admin.toString() !== memberId);
    if (conversation.groupAdmins.length === 0 && conversation.participants.length > 0) {
      conversation.groupAdmins.push(conversation.participants[0]);
    }
    
    await conversation.save();

    // Initialize leftUsers if it doesn't exist, and add with exit timestamp
    if (!conversation.leftUsers) {
      conversation.leftUsers = [];
    }
    const alreadyLeft = conversation.leftUsers.some(
      (lu) => lu.userId?.toString() === memberId
    );
    if (!alreadyLeft) {
      conversation.leftUsers.push({
        userId: memberId,
        leftAt: new Date(systemMessage.createdAt.getTime() + 1000),
      });
    }

    conversation.lastMessage = systemMessage._id;
    await conversation.save();

    // Populate sender profile for the socket broadcast
    const adminProfile = await Profile.findOne({ userId: adminId }).select("fullName");
    let adminName = adminProfile?.fullName || "Admin";
    if (!adminProfile && req.user) {
      if (req.user.firstName || req.user.lastName) {
        adminName = `${req.user.firstName || ""} ${req.user.lastName || ""}`.trim();
      }
    }

    const populatedMessage = {
      ...systemMessage.toObject(),
      sender: {
        _id: adminId,
        fullName: adminName,
        avatar: "/avatar.svg",
        headline: "System",
      },
    };

    const io = getIO();
    if (io) {
      io.to(conversation._id.toString()).emit("group:userLeft", {
        conversationId: conversation._id,
        userId: memberId,
        message: populatedMessage,
      });
      io.to(conversation._id.toString()).emit("group:updated", conversation);
    }

    res.status(200).json({ success: true, message: "Member removed successfully", group: conversation });
  } catch (error) {
    console.error("removeGroupMember error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    const isAdmin = conversation.groupAdmins.some(admin => admin.toString() === userId);
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Only the group admin can delete the group." });
    }

    // Optionally delete group avatar from Cloudinary
    if (conversation.groupAvatar && conversation.groupAvatar.includes("cloudinary.com")) {
      try {
        const parts = conversation.groupAvatar.split("/upload/");
        if (parts.length === 2) {
          let path = parts[1].replace(/^v\d+\//, "");
          const publicId = path.replace(/\.[^/.]+$/, "");
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        }
      } catch (err) {
        console.error("Error deleting group avatar from Cloudinary:", err);
      }
    }

    // Get all participants before deleting to notify them
    const allParticipants = [...conversation.participants];
    if (conversation.leftUsers) {
      conversation.leftUsers.forEach(lu => {
        if (!allParticipants.includes(lu.userId)) {
          allParticipants.push(lu.userId);
        }
      });
    }

    // Delete all messages in the conversation
    await Message.deleteMany({ conversationId: id });

    // Delete the conversation itself
    await Conversation.findByIdAndDelete(id);

    // Notify all participants
    const io = getIO();
    if (io) {
      io.to(id.toString()).emit("group:deleted", { conversationId: id });
    }

    res.status(200).json({ success: true, message: "Group deleted successfully" });
  } catch (error) {
    console.error("deleteGroup error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.assignGroupAdmin = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const adminId = req.user.id;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    if (!conversation.groupAdmins.some(admin => admin.toString() === adminId)) {
      return res.status(403).json({ success: false, message: "Only group admins can assign other admins" });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(400).json({ success: false, message: "User is not a participant of this group" });
    }

    // Check if the user is already an admin
    if (!conversation.groupAdmins.some(admin => admin.toString() === userId)) {
      conversation.groupAdmins.push(userId);
      await conversation.save();

      const io = getIO();
      if (io) {
        io.to(id.toString()).emit("group:updated", conversation);
      }
    }

    res.status(200).json({ success: true, group: conversation });
  } catch (error) {
    console.error("assignGroupAdmin error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.removeGroupAdmin = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const adminId = req.user.id;

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    if (!conversation.groupAdmins.some(admin => admin.toString() === adminId)) {
      return res.status(403).json({ success: false, message: "Only group admins can remove admins" });
    }

    // Check if the user to remove is actually an admin
    if (!conversation.groupAdmins.some(admin => admin.toString() === userId)) {
      return res.status(400).json({ success: false, message: "User is not an admin" });
    }

    // Prevent removing the last admin
    if (conversation.groupAdmins.length === 1) {
      return res.status(400).json({ success: false, message: "Cannot remove the only admin of the group" });
    }

    conversation.groupAdmins = conversation.groupAdmins.filter(admin => admin.toString() !== userId);
    await conversation.save();

    const io = getIO();
    if (io) {
      io.to(id.toString()).emit("group:updated", conversation);
    }

    res.status(200).json({ success: true, group: conversation });
  } catch (error) {
    console.error("removeGroupAdmin error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
