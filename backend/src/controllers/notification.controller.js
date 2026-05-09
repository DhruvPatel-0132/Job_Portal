const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const Profile = require("../models/Profile");

const ALLOWED_CATEGORIES = ["CONNECTION", "SOCIAL", "POST"];

const attachSenderProfile = async (notifications) => {
  const senderIds = [...new Set(notifications.map((n) => String(n.senderId)).filter(Boolean))];
  const profiles = await Profile.find({ userId: { $in: senderIds } }).select("userId fullName avatar");

  const profileMap = profiles.reduce((acc, profile) => {
    acc[String(profile.userId)] = {
      fullName: profile.fullName || "User",
      avatar: profile.avatar || "/avatar.svg",
    };
    return acc;
  }, {});

  return notifications.map((notification) => {
    const notificationObj = notification.toObject();
    const senderProfile = profileMap[String(notificationObj.senderId)] || {
      fullName: "User",
      avatar: "/avatar.svg",
    };

    return {
      ...notificationObj,
      sender: senderProfile,
    };
  });
};

exports.getNotifications = async (req, res) => {
  try {
    const recipientId = req.user.id;
    const { category } = req.query;

    const query = { recipientId };
    if (category) {
      if (!ALLOWED_CATEGORIES.includes(category)) {
        return res.status(400).json({ success: false, message: "Invalid notification category" });
      }
      query.category = category;
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    const notificationsWithSender = await attachSenderProfile(notifications);

    res.status(200).json({ success: true, notifications: notificationsWithSender });
  } catch (error) {
    console.error("getNotifications error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const recipientId = req.user.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid notification id" });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipientId },
      { $set: { isRead: true } },
      { returnDocument: "after" }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error("markAsRead error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const recipientId = req.user.id;
    const result = await Notification.updateMany(
      { recipientId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      updatedCount: result.modifiedCount || 0,
    });
  } catch (error) {
    console.error("markAllAsRead error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const recipientId = req.user.id;
    const unreadCount = await Notification.countDocuments({ recipientId, isRead: false });
    res.status(200).json({ success: true, unreadCount });
  } catch (error) {
    console.error("getUnreadCount error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
