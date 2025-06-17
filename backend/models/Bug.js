const mongoose = require("mongoose");

const bugSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    severity: {
      type: String,
      required: [true, "Severity is required"],
      enum: {
        values: ["Low", "Medium", "High", "Critical"],
        message: "Severity must be Low, Medium, High, or Critical",
      },
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["Open", "In Progress", "Resolved", "Closed"],
        message: "Status must be Open, In Progress, Resolved, or Closed",
      },
      default: "Open",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    priority: {
      type: Number,
      default: function () {
        const severityMap = { Low: 1, Medium: 2, High: 3, Critical: 4 };
        return severityMap[this.severity] || 1;
      },
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
bugSchema.index({ status: 1, severity: 1, assignedTo: 1 });
bugSchema.index({ reportedBy: 1 });
bugSchema.index({ tags: 1 });

module.exports = mongoose.model("Bug", bugSchema);
