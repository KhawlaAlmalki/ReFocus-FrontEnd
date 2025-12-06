const router = require("express").Router();
const controller = require("../controllers/moderationController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.get("/", auth, roleCheck("admin"), controller.getFlaggedPosts);
router.post("/:id/flag", auth, controller.flagPost);
router.delete("/:id", auth, roleCheck("admin"), controller.deletePost);

module.exports = router;
