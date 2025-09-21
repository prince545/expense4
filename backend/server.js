const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config();

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ CORS Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://expense4-zi5r.vercel.app', 'http://localhost:3000'], // add all needed origins
  credentials: true,
}));

// ✅ JSON Body Parser
app.use(express.json());

// ✅ Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);  // ✅ This line is essential
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// ✅ Default Route (Optional)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Start the Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
