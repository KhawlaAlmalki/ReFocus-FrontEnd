// src/routes/auth.js
import express from "express";
import { register, verifyEmail, resendVerification, getCurrentUser, logout } from "../controllers/authController.js";
import { login } from "../controllers/loginController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Email verification
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);

// Protected routes (require authentication)
router.get("/me", auth, getCurrentUser);
router.post("/logout", auth, logout);

export default router;