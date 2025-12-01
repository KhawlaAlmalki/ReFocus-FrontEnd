// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config({ override: true });
console.log("JWT_SECRET from env:", process.env.JWT_SECRET);

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Accept JSON requests
app.use(express.json());

// ----------------------
// MONGO CONNECTION
// ----------------------
const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("MONGO_URI:", process.env.MONGO_URI ? "✓ Found" : "✗ Missing");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✓ Connected to MongoDB successfully");
  } catch (err) {
    console.error("✗ MongoDB Connection Error:", err.message);
    console.error("Full error:", err);
    process.exit(1);
  }
};

connectDB();

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

// ----------------------
// ROOT ROUTE
// ----------------------
app.get("/", (req, res) => {
  res.send("ReFocus Backend API - Running");
});

// ----------------------
// ROUTES
// ----------------------

// PUBLIC ROUTES
import authRoutes from "./src/routes/auth.js";
app.use("/api/auth", authRoutes);

import coachRoutes from "./src/routes/coach.js";
app.use("/api/coach", coachRoutes);

// PROTECTED ROUTES
import auth from "./src/middleware/auth.js";

import userRoutes from "./src/routes/users.js";
app.use("/api/users", userRoutes);

import adminRoutes from "./src/routes/admin.js";
app.use("/api/admin", adminRoutes);

import goalRoutes from "./src/routes/goals.js";
app.use("/api/goals", auth, goalRoutes);

import sessionRoutes from "./src/routes/sessions.js";
app.use("/api/sessions", auth, sessionRoutes);

import surveyRoutes from "./src/routes/survey.js";
app.use("/api/survey", auth, surveyRoutes);

// ----------------------
// START SERVER
// ----------------------
const PORT = process.env.APP_PORT || 5050;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
