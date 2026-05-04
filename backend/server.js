const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/auth.routes");
const emailRoutes = require("./src/routes/email.routes");
const phoneRoutes = require("./src/routes/phone.routes");
const forgotRoutes = require("./src/routes/forgot.routes");
const profileRoutes = require("./src/routes/profile.routes");
const companyRoutes = require("./src/routes/company.routes");

dotenv.config();

const app = express();

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

/* DB */
connectDB();

/* SERVER */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});