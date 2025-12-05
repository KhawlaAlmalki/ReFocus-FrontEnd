import Session from "../models/Session.js";
import Progress from "../models/Progress.js";
import { filterByTimeRange, computeStats } from "../utils/analytics.js";

// ➤ Start a session
export const startSession = async (req, res) => {
  try {
    const { userId, category, duration } = req.body;

    const session = await Session.create({
      userId,
      category,
      duration,
      startedAt: Date.now(),
      completed: false
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: "Could not start session" });
  }
};

// ➤ End a session
export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.completed = true;
    session.endedAt = new Date();
    await session.save();

    // Update progress
    let progress = await Progress.findOne({ userId: session.userId });
    if (!progress) {
      progress = await Progress.create({
        userId: session.userId
      });
    }

    progress.totalMinutes += session.duration;
    progress.sessionsCompleted += 1;
    await progress.save();

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: "Could not end session" });
  }
};

// ➤ Get all sessions (with optional filter)
export const getAllSessions = async (req, res) => {
  try {
    const { userId, filter } = req.query;

    let sessions = await Session.find({ userId }).sort({ startedAt: -1 });

    if (filter) {
      sessions = filterByTimeRange(sessions, filter);
    }

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Could not get sessions" });
  }
};

// ➤ Get one session by ID
export const getSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Not found" });

    res.json(session);
  } catch {
    res.status(500).json({ error: "Could not get session" });
  }
};

// ➤ Get stats for charts
export const getSessionStats = async (req, res) => {
  try {
    const { userId } = req.query;

    const sessions = await Session.find({ userId });
    const stats = computeStats(sessions);

    res.json(stats);
  } catch {
    res.status(500).json({ error: "Could not compute stats" });
  }
};
