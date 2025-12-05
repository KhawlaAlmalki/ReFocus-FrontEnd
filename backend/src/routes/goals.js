import express from "express";
import { setGoal, getGoal } from "../controllers/goalController.js";

const router = express.Router();

router.post("/", setGoal);
router.get("/:userId", getGoal);

export default router;
