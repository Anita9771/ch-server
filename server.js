const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);


const transactionRoutes = require("./routes/transactions");
app.use("/api/transactions", transactionRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync('your-password', salt);
console.log(hash, "password hash");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
  app.listen(5000, () => console.log("Server started on http://localhost:5000", hash,));
})
.catch((err) => console.error("MongoDB error:", err));