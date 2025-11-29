import mongoose from "mongoose";

const surveySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  answers: {
    mainGoal: String,
    desiredHoursPerDay: String,
    currentHoursPerDay: Number,
    distractions: [String],
    loseFocusWhen: String,
    productivityStyle: String,
    upcomingEvents: Boolean,
    motivationStyle: String,
    statsVisibility: String,
    consistency: Number
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Survey", surveySchema);
