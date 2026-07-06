// backend/controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
// ─────────────────────────────────────────
// @POST   /api/auth/register
// ─────────────────────────────────────────
const register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });
    const user = await User.create({ name, email, phone, password });
    const token = generateToken(user._id, user.role);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ─────────────────────────────────────────
// @POST   /api/auth/login
// ─────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });
    if (!user.isActive)
      return res
        .status(403)
        .json({ message: "Account deactivated. Contact support" });
    const token = generateToken(user._id, user.role);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ─────────────────────────────────────────
// @GET    /api/auth/me
// ─────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ─────────────────────────────────────────
// @PUT    /api/auth/profile
// @Access Protected (logged-in user)
// @Desc   Update name & phone
// ─────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }
    if (!phone?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Phone is required" });
    }
    // Check if phone is taken by another user
    const phoneExists = await User.findOne({
      phone,
      _id: { $ne: req.user._id },
    });
    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: "Phone number already in use by another account",
      });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim(), phone: phone.trim() },
      { new: true, runValidators: true },
    ).select("-password");
    res.json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// ─────────────────────────────────────────
// @PUT    /api/auth/change-password
// @Access Protected (logged-in user)
// @Desc   Change password (requires current password)
// ─────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    // Validations
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as current password",
      });
    }
    // Fetch user with password
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }
    user.password = newPassword; // pre-save hook will hash it
    await user.save();
    res.json({ success: true, message: "Password changed successfully! 🔒" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { register, login, getMe, updateProfile, changePassword };
