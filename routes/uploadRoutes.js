// routes/uploadRoutes.js
import express from "express";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { uploadSingleImage } from "../middlewar/uploads.js";

const router = express.Router();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// adjust if your uploads live elsewhere
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// --- helper: turn a public URL back into a safe local file path
function urlToLocalPath(publicUrl) {
  if (!publicUrl || typeof publicUrl !== "string") return null;

  const base = (process.env.BASE_URL || "").replace(/\/+$/, "");
  if (!base) return null;
  if (!publicUrl.startsWith(base)) return null;

  // strip BASE_URL + optional leading slash
  let rel = publicUrl.slice(base.length).replace(/^\/+/, "");

  // normalize, strip any ../ shenanigans
  rel = path.normalize(rel).replace(/^(\.\.(\/|\\|$))+/, "");

  const absolute = path.join(process.cwd(), rel);

  // enforce it’s inside the uploads directory
  const uploadsReal = path.resolve(UPLOADS_DIR);
  const absoluteReal = path.resolve(absolute);
  if (!absoluteReal.startsWith(uploadsReal)) return null;

  return absoluteReal;
}

// ---- Upload route specifically for React Quill image uploads
router.post("/upload-editor-image", uploadSingleImage, (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const imageUrl = `${process.env.BASE_URL}/${req.file.path.replace(/\\/g, "/")}`;
    res.status(200).json({ success: true, url: imageUrl });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: err.message,
    });
  }
});

// ---- NEW: delete an uploaded image by its public URL
router.delete("/upload-editor-image", async (req, res) => {
  try {
    const { url } = req.body || {};
    const localPath = urlToLocalPath(url);
    if (!localPath) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing url" });
    }

    try {
      await fs.unlink(localPath);
      return res.status(200).json({ success: true, deleted: true });
    } catch (err) {
      // if file already gone: treat as success (idempotent)
      if (err.code === "ENOENT") {
        return res.status(204).end();
      }
      throw err;
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: err.message,
    });
  }
});

export default router;
