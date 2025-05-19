const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Get all users
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpires");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Approve user
router.put("/approve/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.approved = true;
    await user.save();
    res.json({ message: "User approved" });
  } catch (err) {
    res.status(500).json({ message: "Error approving user" });
  }
});


// Get all transaction requests
router.get("/transactions", protect, adminOnly, async (req, res) => {
  const txns = await Transaction.find().populate("user", "email category").sort({ createdAt: -1 });
  res.json(txns);
});

// Approve/reject transaction
router.put("/transactions/:id", protect, adminOnly, async (req, res) => {
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const txn = await Transaction.findById(req.params.id);
  if (!txn) return res.status(404).json({ message: "Transaction not found" });

  txn.status = status;
  await txn.save();
  res.json({ message: `Transaction ${status}` });
});


module.exports = router;
