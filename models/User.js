const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },    // First Name
  lastName: { type: String, required: true },     // Last Name
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },  // Phone Number
  dateOfBirth: { type: Date, required: true },    // Date of Birth
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  ssnLast4: { type: String, required: true },     // last 4 digits of SSN

  password: { type: String, required: true },
  role: { type: String, default: "user" }, // can also be "admin"
  approved: { type: Boolean, default: false },
  balance: { type: Number, default: 0 },
  otp: { type: String },
  otpExpires: { type: Date },
});

module.exports = mongoose.model("User", UserSchema);
