// middlewares/upload.js
import multer from "multer";
import { storage, fileFilter } from "../multer/multerConfig.js"; // adjust as needed

const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export const uploadSingleImage = uploadSingle.single("editorImage");
