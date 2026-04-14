const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

module.exports = app;