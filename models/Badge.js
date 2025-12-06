const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: String,
  trigger: String
}, { timestamps: true });

module.exports = mongoose.model("Badge", badgeSchema);
