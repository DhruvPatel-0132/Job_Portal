const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const { emitToUser } = require("../config/socket");

const createNotification = async ({
  recipientId,
  senderId,
  type,
  category,
  entityId = null,
}) => {
  if (!recipientId || !senderId || !type || !category) return null;
  if (String(recipientId) === String(senderId)) return null;

  const notification = await Notification.create({
    recipientId,
    senderId,
    type,
    category,
    entityId: entityId && mongoose.Types.ObjectId.isValid(entityId) ? entityId : null,
  });

  // Emit real-time notification
  emitToUser(recipientId, "notification", notification);

  return notification;
};

module.exports = {
  createNotification,
};
