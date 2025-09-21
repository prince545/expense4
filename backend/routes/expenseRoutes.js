const express = require("express");
const router = express.Router();

const {
  addExpense,
  getAllExpenses,
  deleteExpense,
  downloadExpenseExcel
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware"); // ✅ Import protect

// ✅ Use protect to require valid token
router.post("/add", protect, addExpense);
router.get("/all", protect, getAllExpenses);
router.delete("/:id", protect, deleteExpense);
router.get("/download/excel", protect, downloadExpenseExcel);

module.exports = router;
