// src/routes/users.js
import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  getUserById
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import { isAdmin } from "../middleware/roleCheck.js";

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get own profile
router.get("/profile", getProfile);

// Update own profile
router.put("/profile", updateProfile);

// Change password
router.put("/change-password", changePassword);

// Get user by ID (admin only for now)
router.get("/:userId", isAdmin, getUserById);

export default router;