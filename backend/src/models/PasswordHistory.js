const mongoose = require("mongoose");

const passwordHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        oldPassword: {
            type: String,
            required: true,
        },
        changedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("PasswordHistory", passwordHistorySchema);
