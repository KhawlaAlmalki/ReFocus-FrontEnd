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

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// ----------------------
// MONGO CONNECTION
// ----------------------
const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    const mongoUri = process.env.NODE_ENV === 'test'
      ? process.env.MONGODB_TEST_URI
      : process.env.MONGO_URI;
    console.log("MONGO_URI:", mongoUri ? "✓ Found" : "✗ Missing");

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✓ Connected to MongoDB successfully");
  } catch (err) {
    console.error("✗ MongoDB Connection Error:", err.message);
    console.error("Full error:", err);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

// Connect to database (will be handled by tests in test environment)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

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

import devRoutes from "./src/routes/dev.js";
app.use("/api/dev", auth, devRoutes);

// ----------------------
// START SERVER
// ----------------------
const PORT = process.env.APP_PORT || 5050;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}

// Export app and connectDB for testing
export default app;
export { connectDB };
