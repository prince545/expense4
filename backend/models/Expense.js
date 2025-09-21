const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  category: {
    type: String,
    required: true,
    enum: ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Education", "Other"],
  },
  icon: {
    type: String,
    default: "💸",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // assuming you have a User model
    required: true,
  },
  note: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Expense", expenseSchema);
