// backend/config/cloudinary.js
const cloudinary = require("cloudinary").v2;

// Prefer CLOUDINARY_URL (auto-parsed by the SDK: cloudinary://key:secret@cloud_name)
// Fall back to individual vars for backward compatibility.
if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDNARY_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET,
  });
}

module.exports = cloudinary;
