const ConnectRequest = require("../models/ConnectRequest");
const Connection = require("../models/Connection");
const User = require("../models/User");
const { createNotification } = require("../services/notification.service");

exports.sendRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recipientId } = req.body;

    if (senderId === recipientId) {
      return res.status(400).json({ success: false, message: "Cannot send request to yourself" });
    }

    // Check if a connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { user1: senderId, user2: recipientId },
        { user1: recipientId, user2: senderId },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({ success: false, message: "Already connected" });
    }

    // Check if a request already exists
    const existingRequest = await ConnectRequest.findOne({
      $or: [
        { senderId, recipientId },
        { senderId: recipientId, recipientId: senderId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: "Request already exists" });
    }

    const newRequest = await ConnectRequest.create({
      senderId,
      recipientId,
    });

    await createNotification({
      recipientId,
      senderId,
      type: "CONNECTION_REQUEST",
      category: "CONNECTION",
      entityId: newRequest._id,
    });

    res.status(201).json({ success: true, message: "Request sent", request: newRequest });
  } catch (error) {
    console.error("sendRequest error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const recipientId = req.user.id;
    const { requestId } = req.params;

    const request = await ConnectRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.recipientId.toString() !== recipientId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Create connection
    await Connection.create({
      user1: request.senderId,
      user2: request.recipientId,
    });

    await createNotification({
      recipientId: request.senderId,
      senderId: request.recipientId,
      type: "CONNECTION_ACCEPTED",
      category: "CONNECTION",
      entityId: request._id,
    });

    // Remove the request (or mark as accepted, but prompt says "Remove request")
    await ConnectRequest.findByIdAndDelete(requestId);

    // Update connection count if field exists (we can check if schema has it)
    if (User.schema.paths.connectionsCount) {
      await User.updateMany(
        { _id: { $in: [request.senderId, request.recipientId] } },
        { $inc: { connectionsCount: 1 } }
      );
    }

    res.status(200).json({ success: true, message: "Request accepted" });
  } catch (error) {
    console.error("acceptRequest error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const recipientId = req.user.id;
    const { requestId } = req.params;

    const request = await ConnectRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.recipientId.toString() !== recipientId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await ConnectRequest.findByIdAndDelete(requestId);

    res.status(200).json({ success: true, message: "Request rejected" });
  } catch (error) {
    console.error("rejectRequest error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { recipientId } = req.params; // or requestId, let's use recipientId for simplicity from UI

    const request = await ConnectRequest.findOneAndDelete({
      senderId,
      recipientId,
    });

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({ success: true, message: "Request cancelled" });
  } catch (error) {
    console.error("cancelRequest error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Incoming requests
    const incomingRequests = await ConnectRequest.find({ recipientId: userId, status: "pending" })
      .populate("senderId", "firstName lastName avatar role")
      .sort({ createdAt: -1 });

    // Outgoing requests
    const outgoingRequests = await ConnectRequest.find({ senderId: userId, status: "pending" })
      .populate("recipientId", "firstName lastName avatar role")
      .sort({ createdAt: -1 });

    // Fetch profiles for all these users
    const userIdsToFetch = [
      ...incomingRequests.map(r => r.senderId?._id),
      ...outgoingRequests.map(r => r.recipientId?._id)
    ].filter(id => id);

    const Profile = require("../models/Profile");
    const profiles = await Profile.find({ userId: { $in: userIdsToFetch } }).select("userId headline avatar banner");

    const incoming = incomingRequests.map(r => {
      const p = profiles.find(profile => profile.userId.toString() === r.senderId?._id.toString());
      if (r.senderId) {
        return {
          ...r.toObject(),
          senderId: {
            ...r.senderId.toObject(),
            avatar: r.senderId.avatar || p?.avatar || "/avatar.svg",
            headline: p?.headline || "",
            banner: p?.banner || "linear-gradient(to bottom right, #a1c4fd, #c2e9fb)"
          }
        };
      }
      return r;
    });

    const outgoing = outgoingRequests.map(r => {
      const p = profiles.find(profile => profile.userId.toString() === r.recipientId?._id.toString());
      if (r.recipientId) {
        return {
          ...r.toObject(),
          recipientId: {
            ...r.recipientId.toObject(),
            avatar: r.recipientId.avatar || p?.avatar || "/avatar.svg",
            headline: p?.headline || "",
            banner: p?.banner || "linear-gradient(to bottom right, #a1c4fd, #c2e9fb)"
          }
        };
      }
      return r;
    });

    res.status(200).json({ success: true, incoming, outgoing });
  } catch (error) {
    console.error("getPendingRequests error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
