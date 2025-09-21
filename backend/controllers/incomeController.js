// const addIncome = async (req, res) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Not authorized: user not found in request" });
//     }

//     const userId = req.user.id;
//     const { icon, source, amount, date } = req.body;

//     if (!source || !amount || !date) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const newIncome = new Income({
//       userId,
//       icon,
//       source,
//       amount,
//       date: new Date(date)
//     });

//     await newIncome.save();
//     res.status(201).json(newIncome);

//   } catch (error) {
//     console.error("❌ addIncome error:", error);
//     res.status(500).json({
//       message: "Server error",
//       error: error.message || "Unknown error"
//     });
//   }
// };

// const getAllIncome = async (req, res) => {
//   try {
//     res.status(200).json({ message: "All incomes retrieved" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// const deleteIncome = async (req, res) => {
//   try {
//     const { id } = req.params;
//     res.status(200).json({ message: `Income with id ${id} deleted` });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// const downloadIncomeExcel = async (req, res) => {
//   try {
//     res.status(200).send("Excel download placeholder");
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// module.exports = {
//   addIncome,
//   getAllIncome,
//   deleteIncome,
//   downloadIncomeExcel
// };
const Income = require("../models/Income");

const xlsx = require('xlsx');
// ✅ Add Income
const addIncome = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized: user not found in request" });
    }

    const userId = req.user.id;
    const { icon, source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date)
    });

    await newIncome.save();
    res.status(201).json(newIncome);

  } catch (error) {
    console.error("❌ addIncome error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message || "Unknown error"
    });
  }
};

// ✅ Get All Incomes
const getAllIncome = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const income = await Income.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete Income
const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Income.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Download Income as Excel
 // Ensure this is imported at the top

const downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    const filePath = 'income_details.xlsx';
    xlsx.writeFile(wb, filePath);

    res.download(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Exporting all together
module.exports = {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel,
};
