const router = require("express").Router();
const controller = require("../controllers/communityController");
const auth = require("../middleware/auth");

router.get("/", auth, controller.getPosts);
router.post("/", auth, controller.createPost);

module.exports = router;
