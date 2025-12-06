const Badge = require("../models/Badge");

exports.getBadges = async (req, res) => {
  const badges = await Badge.find();
  res.json(badges);
};

exports.createBadge = async (req, res) => {
  const badge = await Badge.create(req.body);
  res.json(badge);
};
