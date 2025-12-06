// Load environment variables FIRST
const dotenv = require("dotenv");
dotenv.config();

// Import modules
const express = require("express");
const app = express();
const connectDB = require("./config/db");

// Connect to the database
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
connectDB();

// Middleware
app.use(express.json());

// ROUTES
app.use("/api/users", require("./routes/users"));
app.use("/api/challenges", require("./routes/challenges"));
app.use("/api/challenge-templates", require("./routes/challenge-templates"));
app.use("/api/badges", require("./routes/badges"));
app.use("/api/community", require("./routes/community"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/moderation", require("./routes/moderation"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


