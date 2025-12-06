const router = require("express").Router();
const controller = require("../controllers/challengeTemplateController");
const auth = require("../middleware/auth");

router.get("/", auth, controller.getAllTemplates);
router.post("/", auth, controller.createTemplate);

module.exports = router;
