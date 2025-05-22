const mongoose = require("mongoose");

const limitSchema = new mongoose.Schema({
  category: { type: String, enum: ["gold", "silver", "platinum"], required: true, unique: true },
  creditLimit: { type: Number, required: true },
  withdrawLimit: { type: Number, required: true },
  cryptoLimit: { type: Number, required: true },
});

module.exports = mongoose.model("Limit", limitSchema);
