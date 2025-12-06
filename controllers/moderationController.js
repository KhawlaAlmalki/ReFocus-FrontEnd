const CommunityPost = require("../models/CommunityPost");
const ReportedContent = require("../models/ReportedContent");

exports.getFlaggedPosts = async (req, res) => {
  const reports = await ReportedContent.find()
    .populate("post")
    .populate("reportedBy");
  res.json(reports);
};

exports.flagPost = async (req, res) => {
  const report = await ReportedContent.create({
    post: req.params.id,
    reason: req.body.reason,
    reportedBy: req.user.id
  });

  await CommunityPost.findByIdAndUpdate(req.params.id, { flagged: true });

  res.json(report);
};

exports.deletePost = async (req, res) => {
  await CommunityPost.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
