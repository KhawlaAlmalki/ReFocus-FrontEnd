import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("Session", sessionSchema);
