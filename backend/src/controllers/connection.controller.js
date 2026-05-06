const Connection = require("../models/Connection");
const Profile = require("../models/Profile");

exports.getUserConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    const connections = await Connection.find({
      $or: [{ user1: userId }, { user2: userId }],
    }).populate("user1", "firstName lastName avatar role").populate("user2", "firstName lastName avatar role");

    // Extract the other user from the connection
    const formattedConnections = connections.map(conn => {
      const isUser1 = conn.user1._id.toString() === userId;
      const connectedUser = isUser1 ? conn.user2 : conn.user1;
      return connectedUser;
    });

    // Also populate profile data if needed
    const connectedUserIds = formattedConnections.map(u => u._id);
    const profiles = await Profile.find({ userId: { $in: connectedUserIds } }).select("userId headline banner avatar");

    const completeConnections = formattedConnections.map(user => {
      const profile = profiles.find(p => p.userId.toString() === user._id.toString());
      return {
        _id: user._id,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "Unknown",
        avatar: user.avatar || profile?.avatar || "/avatar.svg",
        headline: profile?.headline || "",
        role: user.role,
      };
    });

    res.status(200).json({ success: true, connections: completeConnections });
  } catch (error) {
    console.error("getUserConnections error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
