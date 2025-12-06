const Template = require("../models/ChallengeTemplate");

exports.createTemplate = async (req, res) => {
  const template = await Template.create({
    title: req.body.title,
    description: req.body.description,
    durationDays: req.body.durationDays,
    focusArea: req.body.focusArea,
    coach: req.user.id
  });
  res.json(template);
};

exports.getAllTemplates = async (req, res) => {
  const templates = await Template.find();
  res.json(templates);
};
