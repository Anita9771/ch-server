const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

// Create new transaction request
router.post("/", protect, async (req, res) => {
  const { type, amount } = req.body;

  if (!["credit", "withdraw"].includes(type)) {
    return res.status(400).json({ message: "Invalid transaction type" });
  }

  const transaction = new Transaction({
    user: req.user.id,
    type,
    amount,
  });

  await transaction.save();
  res.status(201).json({ message: "Transaction submitted", transaction });
});

// Get user's own transactions
router.get("/my", protect, async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(transactions);
});

module.exports = router;
