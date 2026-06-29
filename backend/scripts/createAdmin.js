const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Check if admin already exists
    const existing = await User.findOne({ email: "admin@ommobile.com" });
    if (existing) {
      console.log("⚠️  Admin already exists. Skipping.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@1234", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@ommobile.com",
      phone: "9999999999",
      password: "ommobile@1234",
      role: "admin",
    });

    console.log("🎉 Admin account created successfully!");
    console.log("📧 Email   : admin@ommobile.com");
    console.log("🔑 Password: Admin@1234");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

createAdmin();
