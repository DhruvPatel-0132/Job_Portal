const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/auth.routes");
const emailRoutes = require("./src/routes/email.routes");
const phoneRoutes = require("./src/routes/phone.routes");
const forgotRoutes = require("./src/routes/forgot.routes");
const profileRoutes = require("./src/routes/profile.routes");
const companyRoutes = require("./src/routes/company.routes");
const uploadRoutes = require("./src/routes/upload.routes");
const requestRoutes = require("./src/routes/request.routes");
const connectionRoutes = require("./src/routes/connection.routes");
const resumeRoutes = require("./src/routes/resume.routes");
const notificationRoutes = require("./src/routes/notification.routes");
const postRoutes = require("./src/routes/post.routes");
const messageRoutes = require("./src/routes/message.routes");

const http = require("http");
const { initSocket } = require("./src/config/socket");

const app = express();
const server = http.createServer(app);

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* ROUTES */
app.use("/api/auth", authRoutes);       // 🔥 includes /me now
app.use("/api/otp", emailRoutes);
app.use("/api/otp/phone", phoneRoutes);
app.use("/api/forgot", forgotRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);


/* DB */
connectDB();

/* SOCKET */
initSocket(server);

/* SERVER */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});