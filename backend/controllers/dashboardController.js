const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

// Dashboard Data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const userObjectId = new Types.ObjectId(userId);

    // Total Income
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Total Expenses
    const totalExpense = await Expense.aggregate([
      { $match: { user: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Income Transactions in the Last 60 Days
    const last60DaysIncomeTransactions = await Income.find({
      userId: userObjectId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
    }).sort({ date: -1 });

    // Total Income for Last 60 Days
    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Expense Transactions in the Last 30 Days
    const last30DaysExpenseTransactions = await Expense.find({
      user: userObjectId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).sort({ date: -1 });

    // Total Expenses for Last 30 Days
    const expensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Recent 5 Transactions (Income + Expense)
    const lastTransactions = [
      ...(await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5)).map(txn => ({
        ...txn.toObject(),
        type: "income"
      })),
      ...(await Expense.find({ user: userObjectId }).sort({ date: -1 }).limit(5)).map(txn => ({
        ...txn.toObject(),
        type: "expense"
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Final Response
    res.json({
      totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpense[0]?.total || 0,

      last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },

      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },

      recentTransactions: lastTransactions
    });

  } catch (error) {
    console.error("❌ Error in getDashboardData:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
