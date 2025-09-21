const Expense = require("../models/Expense");
const xlsx = require("xlsx");

// ✅ Add Expense
const addExpense = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized: user not found in request" });
    }

    const { icon, category, title, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "Category, amount, and date are required" });
    }

    const newExpense = new Expense({
      user: req.user.id,
      icon,
      category,
      title: title || category,
      amount,
      date: new Date(date)
    });

    await newExpense.save();
    res.status(201).json(newExpense);

  } catch (error) {
    console.error("❌ addExpense error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message || "Unknown error"
    });
  }
};

// ✅ Get All Expenses
const getAllExpenses = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete Expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Expense.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Download Expenses as Excel
const downloadExpenseExcel = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ user: userId }).sort({ date: -1 });

    const data = expenses.map((item) => ({
      Title: item.title,
      Category: item.category,
      Amount: item.amount,
      Date: item.date.toDateString(),
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");

    const filePath = "expenses.xlsx";
    xlsx.writeFile(wb, filePath);

    res.download(filePath);
  } catch (error) {
    console.error("❌ downloadExpenseExcel error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  deleteExpense,
  downloadExpenseExcel,
};
