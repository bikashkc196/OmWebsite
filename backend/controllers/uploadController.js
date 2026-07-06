// backend/controllers/uploadController.js
const cloudinary = require("../config/cloudinary");

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "om-website/products", resource_type: "image" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    uploadStream.end(buffer);
  });
};

// ─────────────────────────────────────────
// @POST   /api/upload/image
// @Access Admin only
// @Desc   Upload a single image to Cloudinary
// ─────────────────────────────────────────
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image file provided" });
    }
    const result = await streamUpload(req.file.buffer);
    res.status(201).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadImage };
