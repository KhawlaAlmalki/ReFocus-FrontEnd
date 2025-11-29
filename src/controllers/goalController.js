import Goal from "../models/Goal.js";

// Add / Update user's goal
export const setGoal = async (req, res) => {
  try {
    const userId = req.body.userId; // later will come from auth
    const { goalText } = req.body;

    if (!goalText) {
      return res.status(400).json({ message: "Goal text is required" });
    }

    // If user already has a goal, replace it
    let goal = await Goal.findOne({ userId });

    if (goal) {
      goal.goalText = goalText;
      await goal.save();
    } else {
      goal = await Goal.create({ userId, goalText });
    }

    res.status(200).json(goal);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving goal" });
  }
};

// Get user goal
export const getGoal = async (req, res) => {
  try {
    const userId = req.params.userId;

    const goal = await Goal.findOne({ userId });

    if (!goal) {
      return res.status(404).json({ message: "No goal found" });
    }

    res.json(goal);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching goal" });
  }
};
