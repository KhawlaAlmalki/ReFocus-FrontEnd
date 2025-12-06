const router = require("express").Router();
const controller = require("../controllers/challengeController");
const auth = require("../middleware/auth");

router.get("/", auth, controller.getAllChallenges);
router.post("/", auth, controller.createChallenge);
router.post("/:id/join", auth, controller.joinChallenge);

module.exports = router;
