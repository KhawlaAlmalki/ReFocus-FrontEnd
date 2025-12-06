const Challenge = require("../models/Challenge");

exports.getAllChallenges = async (req, res) => {
  const challenges = await Challenge.find();
  res.json(challenges);
};

exports.createChallenge = async (req, res) => {
  const challenge = await Challenge.create({
    title: req.body.title,
    description: req.body.description,
    durationDays: req.body.durationDays,
    focusArea: req.body.focusArea,
    createdBy: req.user.id
  });
  res.json(challenge);
};

exports.joinChallenge = async (req, res) => {
  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) return res.status(404).json({ message: "Not found" });

  if (!challenge.participants.includes(req.user.id)) {
    challenge.participants.push(req.user.id);
    await challenge.save();
  }
  res.json({ message: "Joined challenge" });
};
