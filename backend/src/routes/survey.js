import express from "express";
import { submitSurvey, getSurveyByUser } from "../controllers/surveyController.js";

const router = express.Router();

router.post("/", submitSurvey);
router.get("/:userId", getSurveyByUser);

export default router;
