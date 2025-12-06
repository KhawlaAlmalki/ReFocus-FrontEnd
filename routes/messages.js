const router = require("express").Router();
const controller = require("../controllers/messageController");
const auth = require("../middleware/auth");

router.post("/", auth, controller.sendMessage);
router.get("/:conversationId", auth, controller.getMessages);

module.exports = router;
