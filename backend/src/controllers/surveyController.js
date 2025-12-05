// src/controllers/surveyController.js

import Survey from "../models/Survey.js";
import User from "../models/User.js";

// -------------------------------------------------
// SUBMIT SURVEY
// POST /api/survey
// -------------------------------------------------
export const submitSurvey = async (req, res) => {
  try {
    const { userId, answers } = req.body;

    if (!userId || !answers) {
      return res.status(400).json({ message: "userId and answers are required" });
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save survey
    const newSurvey = await Survey.create({
      userId,
      answers
    });

    res.status(201).json({
      message: "Survey saved successfully",
      survey: newSurvey
    });

  } catch (error) {
    console.error("SUBMIT SURVEY ERROR:", error);
    res.status(500).json({ message: "Server error saving survey" });
  }
};

// -------------------------------------------------
// GET SURVEY BY USER
// GET /api/survey/:userId
// -------------------------------------------------
export const getSurveyByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const survey = await Survey.findOne({ userId });

    if (!survey) {
      return res.status(404).json({ message: "No survey found for this user" });
    }

    res.json(survey);

  } catch (error) {
    console.error("GET SURVEY ERROR:", error);
    res.status(500).json({ message: "Server error retrieving survey" });
  }
};
