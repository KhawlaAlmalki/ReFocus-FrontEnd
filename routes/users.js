const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// TEMP USER MODEL (use yours later)
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    email: String,
    password: String,
  })
);

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    res.status(201).json({
      message: "User registered",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.log("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

