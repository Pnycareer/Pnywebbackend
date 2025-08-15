// routes/uploadRoutes.js
import express from "express";
import dotenv from "dotenv";
import { uploadSingleImage } from "../middlewar/uploads.js";

const router = express.Router();

dotenv.config();

// Upload route specifically for React Quill image uploads
router.post("/upload-editor-image", uploadSingleImage, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const imageUrl = `${process.env.BASE_URL}/${req.file.path.replace(/\\/g, "/")}`;
    res.status(200).json({ success: true, url: imageUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: "Image upload failed", error: err.message });
  }
});

export default router;
