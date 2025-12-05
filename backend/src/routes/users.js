// src/routes/users.js
import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  getUserById,
  upload,
  uploadProfilePicture,
  deleteProfilePicture,
  getCoachProfile,
  getAllCoaches
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

// Upload profile picture
router.post("/profile/picture", upload.single('profilePicture'), uploadProfilePicture);

// Delete profile picture
router.delete("/profile/picture", deleteProfilePicture);

// Get all approved coaches (public access for authenticated users)
router.get("/coaches", getAllCoaches);

// Get specific coach profile (public access for authenticated users)
router.get("/coaches/:coachId", getCoachProfile);

// Get user by ID (admin only)
router.get("/:userId", isAdmin, getUserById);

export default router;