const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  let conversation = await Conversation.findOne({
    participants: { $all: [req.user.id, req.body.recipientId] }
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user.id, req.body.recipientId]
    });
  }

  const message = await Message.create({
    conversationId: conversation._id,
    sender: req.user.id,
    text: req.body.text
  });

  res.json(message);
};

exports.getMessages = async (req, res) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId
  }).sort("createdAt");

  res.json(messages);
};
