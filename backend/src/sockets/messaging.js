const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Profile = require("../models/Profile");

// Maintain online users map: userId -> new Set([socketIds])
const onlineUsers = new Map();

module.exports = (io, socket) => {
  const userId = socket.user.id;

  // Track online status
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
    // Broadcast user is online
    socket.broadcast.emit("userOnline", { userId });
  }
  onlineUsers.get(userId).add(socket.id);

  // Send current online users to this socket
  const onlineUserIds = Array.from(onlineUsers.keys());
  socket.emit("onlineUsers", onlineUserIds);

  // Auto-join all participant group rooms on socket connection (including groups user has left)
  const joinUserGroups = async () => {
    try {
      const userGroups = await Conversation.find({
        $or: [
          { participants: userId },
          { "leftUsers.userId": userId }
        ],
        type: "group",
      });
      userGroups.forEach((group) => {
        socket.join(group._id.toString());
        console.log(`Socket ${socket.id} (User: ${userId}) auto-joined group room: ${group._id}`);
      });
    } catch (err) {
      console.error("Error auto-joining group rooms on connect:", err);
    }
  };
  joinUserGroups();

  // Handle explicitly joining a group room
  socket.on("group:join", ({ conversationId }) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} (User: ${userId}) explicitly joined group room: ${conversationId}`);
  });

  // Handle group messaging
  socket.on("group:message", async ({ conversationId, messageText }) => {
    try {
      // Validate: only group members can send messages
      const group = await Conversation.findOne({
        _id: conversationId,
        participants: userId,
        type: "group",
      });

      if (!group) {
        console.warn(`Unauthorized group:message from User: ${userId} to Group: ${conversationId}`);
        return;
      }

      // Create message in database
      const newMessage = await Message.create({
        conversationId: group._id,
        senderId: userId,
        message: messageText,
      });

      // Update lastMessage in Conversation
      group.lastMessage = newMessage._id;
      await group.save();

      // Fetch sender profile details for frontend display
      const senderProfile = await Profile.findOne({ userId }).select("fullName avatar headline");

      const populatedMessage = {
        ...newMessage.toObject(),
        sender: {
          _id: userId,
          fullName: senderProfile?.fullName || "Group Member",
          avatar: senderProfile?.avatar || "/avatar.svg",
          headline: senderProfile?.headline || "",
        },
      };

      // Broadcast to all active participants in the group individually
      group.participants.forEach((pId) => {
        io.to(pId.toString()).emit("group:message", populatedMessage);
      });
    } catch (error) {
      console.error("Socket group:message error:", error);
    }
  });

  // Handle typing
  socket.on("typing", ({ receiverId, isTyping }) => {
    io.to(receiverId).emit("userTyping", {
      userId,
      isTyping,
    });
  });

  // Handle send message
  socket.on("sendMessage", async ({ receiverId, messageText }) => {
    try {
      // Find or create conversation
      let conversation = await Conversation.findOne({
        participants: { $all: [userId, receiverId] },
        type: "private",
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [userId, receiverId],
          type: "private",
        });
      }

      // Create message
      const newMessage = await Message.create({
        conversationId: conversation._id,
        senderId: userId,
        receiverId,
        message: messageText,
      });

      // Update last message in conversation
      conversation.lastMessage = newMessage._id;
      await conversation.save();

      // Emit to receiver
      io.to(receiverId).emit("receiveMessage", newMessage);
      // Emit back to sender (to confirm and show in other devices)
      io.to(userId).emit("receiveMessage", newMessage);

    } catch (error) {
      console.error("Socket sendMessage error:", error);
    }
  });

  // Handle message seen
  socket.on("messageSeen", async ({ conversationId, senderId }) => {
    try {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return;

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
        await Message.updateMany(
          {
            conversationId,
            senderId,
            isSeen: false,
          },
          { $set: { isSeen: true } }
        );
      }

      // Notify the sender that their messages were seen
      io.to(senderId).emit("messagesSeen", {
        conversationId,
        seenBy: userId,
      });
    } catch (error) {
      console.error("Socket messageSeen error:", error);
    }
  });

  // Disconnect handler specific to messaging
  socket.on("disconnect", () => {
    const userSocketSet = onlineUsers.get(userId);
    if (userSocketSet) {
      userSocketSet.delete(socket.id);
      if (userSocketSet.size === 0) {
        onlineUsers.delete(userId);
        // Broadcast user offline
        io.emit("userOffline", { userId });
      }
    }
  });
};
