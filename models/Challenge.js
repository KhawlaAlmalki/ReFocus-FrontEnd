const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  durationDays: Number,
  focusArea: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("Challenge", challengeSchema);
