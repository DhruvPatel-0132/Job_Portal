const mongoose = require("mongoose");
const Notification = require("../models/Notification");

const createNotification = async ({
  recipientId,
  senderId,
  type,
  category,
  entityId = null,
}) => {
  if (!recipientId || !senderId || !type || !category) return null;
  if (String(recipientId) === String(senderId)) return null;

  return Notification.create({
    recipientId,
    senderId,
    type,
    category,
    entityId: entityId && mongoose.Types.ObjectId.isValid(entityId) ? entityId : null,
  });
};

module.exports = {
  createNotification,
};
