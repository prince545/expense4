const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // Make sure this path is correct

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUserInfo);

// Image upload route
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

module.exports = router;
