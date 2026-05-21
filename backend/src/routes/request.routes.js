const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { sendRequest, acceptRequest, rejectRequest, cancelRequest, getPendingRequests } = require("../controllers/request.controller");

router.post("/send", authMiddleware, sendRequest);
router.post("/accept/:requestId", authMiddleware, acceptRequest);
router.post("/reject/:requestId", authMiddleware, rejectRequest);
router.delete("/cancel/:recipientId", authMiddleware, cancelRequest);
router.get("/pending", authMiddleware, getPendingRequests);

module.exports = router;
