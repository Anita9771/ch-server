const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Limit = require("../models/Limit");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const protectAdmin = require("../middleware/adminAuth");


// Generate JWT
const generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};


// Admin registration (run only once to create an admin)
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const exists = await Admin.findOne({ username });
  if (exists) return res.status(400).json({ message: "Admin already exists" });

  const admin = await Admin.create({ username, password });
  res.json({ message: "Admin created" });
});

// Admin login
router.post("/login",  async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(admin._id);
  res.json({ token });
});


// Admin-specific route
// router.post("/admin-login", adminLogin);; // Add this


// Approve user
router.patch("/approve-user/:id", protectAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Credit a user
router.post("/credit/:id", protectAdmin, async (req, res) => {
  try {
    const { amount } = req.body;
    const transaction = await Transaction.create({
      user: req.params.id,
      type: "credit",
      amount,
      status: "approved"
    });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get("/users", protectAdmin, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get all transactions
router.get("/transactions", protectAdmin, async (req, res) => {
  const transactions = await Transaction.find().populate("user");
  res.json(transactions);
});

// Update transaction status
router.patch("/transaction/:id/status", protectAdmin, async (req, res) => {
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });

  const transaction = await Transaction.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!transaction) return res.status(404).json({ message: "Transaction not found" });
  res.json(transaction);
});

// Set category limits
router.post("/set-limits", protectAdmin, async (req, res) => {
  const { category, creditLimit, withdrawLimit, cryptoLimit } = req.body;
  const limit = await Limit.findOneAndUpdate(
    { category },
    { creditLimit, withdrawLimit, cryptoLimit },
    { upsert: true, new: true }
  );
  res.json(limit);
});


module.exports = router;
