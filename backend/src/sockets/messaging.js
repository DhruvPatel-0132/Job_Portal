const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

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
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [userId, receiverId],
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
      await Message.updateMany(
        {
          conversationId,
          senderId,
          isSeen: false,
        },
        { $set: { isSeen: true } }
      );

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
