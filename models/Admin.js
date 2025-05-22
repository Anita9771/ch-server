const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

// Hash password before saving
adminSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Admin", adminSchema);



// const mongoose = require("mongoose");
// const validator = require("validator");
// const bcrypt = require("bcryptjs");

// const AdminSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: [true, "Username is required"],
//     unique: true,
//     trim: true,
//     minlength: [4, "Username must be at least 4 characters"],
//     maxlength: [20, "Username cannot exceed 20 characters"]
//   },
//   password: {
//     type: String,
//     required: [true, "Password is required"],
//     minlength: [12, "Password must be at least 12 characters"],
//     select: false
//   },
//   email: {
//     type: String,
//     required: [true, "Email is required"],
//     unique: true,
//     trim: true,
//     lowercase: true,
//     validate: [validator.isEmail, "Please provide a valid email"]
//   },
//   name: {
//     type: String,
//     required: [true, "Name is required"],
//     trim: true
//   },
//   role: {
//     type: String,
//     enum: ["admin", "superadmin"],
//     default: "admin"
//   },
//   permissions: {
//     type: [String],
//     enum: [
//       "user_management", 
//       "transaction_approval",
//       "system_config",
//       "audit_logs"
//     ],
//     default: ["user_management"]
//   },
//   lastLogin: Date,
//   active: {
//     type: Boolean,
//     default: true
//   },
//   loginAttempts: {
//     type: Number,
//     default: 0,
//     select: false
//   },
//   lockUntil: {
//     type: Date,
//     select: false
//   },
//   twoFactorEnabled: {
//     type: Boolean,
//     default: false
//   },
//   twoFactorSecret: {
//     type: String,
//     select: false
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Indexes
// AdminSchema.index({ username: 1 }, { unique: true });
// AdminSchema.index({ email: 1 }, { unique: true });
// AdminSchema.index({ role: 1 });
// AdminSchema.index({ active: 1 });

// // Password hashing middleware
// AdminSchema.pre("save", async function(next) {
//   if (!this.isModified("password")) return next();
  
//   try {
//     const salt = await bcrypt.genSalt(12);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// // Account lock after failed attempts
// AdminSchema.methods.incrementLoginAttempts = async function() {
//   if (this.lockUntil && this.lockUntil > Date.now()) return;
  
//   const updates = { $inc: { loginAttempts: 1 } };
  
//   if (this.loginAttempts + 1 >= 5) {
//     updates.$set = { 
//       lockUntil: Date.now() + 30 * 60 * 1000 // 30 minutes lock
//     };
//   }
  
//   return this.updateOne(updates);
// };

// // Password comparison method
// AdminSchema.methods.comparePassword = async function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// // Prevent returning sensitive data
// AdminSchema.methods.toJSON = function() {
//   const admin = this.toObject();
//   delete admin.password;
//   delete admin.twoFactorSecret;
//   delete admin.loginAttempts;
//   delete admin.lockUntil;
//   return admin;
// };

// module.exports = mongoose.model("Admin", AdminSchema);