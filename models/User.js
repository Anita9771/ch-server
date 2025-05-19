const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  category: {
    type: String,
    enum: ["Gold", "Silver", "Platinum"],
    required: true,
  },
  role: { type: String, default: "user" }, // can also be "admin"
  approved: { type: Boolean, default: false },
  balance: { type: Number, default: 0 },
  otp: { type: String },
  otpExpires: { type: Date },

});

module.exports = mongoose.model("User", UserSchema);
