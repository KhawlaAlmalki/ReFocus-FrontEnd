const router = require("express").Router();
const controller = require("../controllers/badgeController");
const auth = require("../middleware/auth");

//Get all badges
router.get("/", auth, controller.getBadges);

//Create badge (admin or system)
router.post("/", auth, controller.createBadge);

module.exports = router;
