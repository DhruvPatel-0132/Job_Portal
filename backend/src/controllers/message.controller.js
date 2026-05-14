const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Profile = require("../models/Profile");
const { getIO } = require("../config/socket");

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch conversations where user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    // Format response: attach other participant's profile and calculate unread count
    const formattedConversations = await Promise.all(
      conversations.map(async (conv) => {
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
          otherParticipant: {
            _id: otherParticipantId,
            fullName: profile?.fullName || "LinkedIn Member",
            avatar: profile?.avatar || "/avatar.svg",
            headline: profile?.headline || "",
          },
        };
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
    const { userId: otherUserId } = req.params;

    // Find conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [], conversationId: null });
    }

    // Mark messages as seen if we are fetching them
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

    const messages = await Message.find({ conversationId: conversation._id }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      messages,
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

    res.status(200).json({ success: true, message: "Messages marked as seen" });
  } catch (error) {
    console.error("markAsSeen error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
