// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config({ override: true });
console.log("JWT_SECRET from env:", process.env.JWT_SECRET);

const app = express();

// Allow ALL origins 
app.use(cors());

// Accept JSON requests
app.use(express.json());

// ----------------------
// MONGO CONNECTION
// ----------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("Backend running");
});

// ----------------------
// ROUTES
// ----------------------

// PUBLIC ROUTES
import authRoutes from "./src/routes/auth.js";
app.use("/api/auth", authRoutes);

// PROTECTED ROUTES
import auth from "./src/middleware/auth.js";
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
