import express from "express";
import {
  startSession,
  endSession,
  getAllSessions,
  getSession,
  getSessionStats
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/start", startSession);
router.post("/end", endSession);

// IMPORTANT: Put the more specific path BEFORE the param path.
router.get("/stats/data", getSessionStats);

router.get("/", getAllSessions);
router.get("/:id", getSession);

export default router;
