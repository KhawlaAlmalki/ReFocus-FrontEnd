// src/routes/games.js
import express from "express";
import {
  getPublicGameLibrary,
  getPublicGameById
} from "../controllers/gameController.js";

const router = express.Router();

// ============================================
// Public Game Library (No Auth Required)
// ============================================

// Get public game library - dynamically populates frontend
router.get("/library", getPublicGameLibrary);

// Get single public game details
router.get("/library/:gameId", getPublicGameById);

export default router;
