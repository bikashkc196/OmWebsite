const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
dotenv.config();
const ADMIN_EMAIL = process.env.ADMIN_EMAI;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    let admin = await User.findOne({ email: ADMIN_EMAIL });
    if (!admin) {
      admin = await User.create({
        name: process.env.ADMIN_NAME || "Super Admin",
        email: ADMIN_EMAIL,
        phone: process.env.ADMIN_PHONE || "9999999999",
        password: ADMIN_PASSWORD,
        role: "admin",
        isActive: true,
      });
      console.log("🎉 Admin account created successfully!");
    } else {
      admin.name = process.env.ADMIN_NAME || admin.name || "Super Admin";
      admin.phone = process.env.ADMIN_PHONE || admin.phone || "9999999999";
      admin.role = "admin";
      admin.isActive = true;
      admin.password = ADMIN_PASSWORD;
      await admin.save();
      console.log("🔄 Existing admin account updated successfully!");
    }
    console.log(`📧 Email   : ${ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};
createAdmin();
