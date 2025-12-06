const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  title: String,
  description: String,
  durationDays: Number,
  focusArea: String,
  coach: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("ChallengeTemplate", templateSchema);
