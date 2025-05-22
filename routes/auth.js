const express = require("express");
const {
  register,
  login,
  verifyOtp,
  resendOtp,
  resetPassword,
  forgotPassword,
  // adminLogin,
  // adminLoginLimiter,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Regular user routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);


// Protected routes
router.get("/protected", protect, (req, res) => {
  res.json({ message: `Welcome user ${req.user.id}` });
});

module.exports = router;
