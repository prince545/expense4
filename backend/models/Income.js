const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema(
  {
    icon: { type: String },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    source: { type: String, required: true } // Example: Salary, Freelance, etc.
  },
  { timestamps: true }
);

// ✅ Avoid OverwriteModelError in dev
module.exports = mongoose.models.Income || mongoose.model("Income", IncomeSchema)
