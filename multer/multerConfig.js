import fs from "fs";
import path from "path";
import multer from "multer";

const ensureUploadDir = (cb, ...candidatePaths) => {
  let lastError = null;

  for (const relPath of candidatePaths) {
    try {
      const absolutePath = path.resolve(relPath);
      fs.mkdirSync(absolutePath, { recursive: true });
      cb(null, absolutePath);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  cb(lastError || new Error("Unable to resolve upload directory"), false);
};

// Set up storage configuration for multiple image types and brochures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case "course_Image":
        return ensureUploadDir(cb, "uploads/images/academiacourses", "uploads/images/courseimages");
      case "Brochure":
      case "Brochuresub":
        return ensureUploadDir(cb, "uploads/academia/files", "uploads/images/flyers/brochures");
      case "postThumbnailImage":
        return ensureUploadDir(cb, "uploads/images/postThumbnail");
      case "flyerFile":
        return ensureUploadDir(cb, "uploads/images/flyers/images");
      case "categoryImage":
        return ensureUploadDir(cb, "uploads/images/categories");
      case "coverImage":
        return ensureUploadDir(cb, "uploads/images/covers");
      case "faqImage":
        return ensureUploadDir(cb, "uploads/images/faq");
      case "photo":
        return ensureUploadDir(cb, "uploads/images/instructorphoto");
      case "image":
        return ensureUploadDir(cb, "uploads/images/events");
      case "webbanner":
        return ensureUploadDir(cb, "uploads/images/webbanner");
      case "subimage":
      case "Imagesub":
        return ensureUploadDir(cb, "uploads/images/subimage");
      case "blogImage":
        return ensureUploadDir(cb, "uploads/images/blogs");

      case "authorProfileImage":
        return ensureUploadDir(cb, "uploads/images/authorprofile");
      case "editorImage":
        return ensureUploadDir(cb, "uploads/images/editor");
      case "galleryImages":
        return ensureUploadDir(cb, "uploads/images/gallery");

      default:
        cb(new Error("Invalid field name"), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to accept only specific file types
const fileFilter = (req, file, cb) => {
  if (
    [
      "course_Image",
      "postThumbnailImage",
      "flyerFile",
      "categoryImage",
      "coverImage",
      "faqImage",
      "photo",
      "image",
      "subimage",
      "Imagesub",
      "webbanner",
      "blogImage",
      "authorProfileImage",
      "editorImage",
      "galleryImages",
    ].includes(file.fieldname)
  ) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."));
    }
  } else if (["Brochure", "Brochuresub"].includes(file.fieldname)) {
    // ✅ Added Brochuresub for subcourses
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF is allowed for Brochures."));
    }
  } else {
    cb(new Error("Unknown file field name."));
  }
};

// Multer configuration with file size limits
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter,
});

// ✅ Updated `upload.fields()` configuration
export const uploadFiles = upload.fields([
  { name: "course_Image", maxCount: 1 },
  { name: "Brochure", maxCount: 1 },
  { name: "Brochuresub", maxCount: 10 },
  { name: "postThumbnailImage", maxCount: 1 },
  { name: "flyerFile", maxCount: 1 },
  { name: "categoryImage", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
  { name: "faqImage", maxCount: 1 },
  { name: "subimage", maxCount: 1 },
  { name: "Imagesub", maxCount: 1 },
  { name: "photo", maxCount: 1 },
  { name: "image", maxCount: 1 },
  { name: "webbanner", maxCount: 1 },
  { name: "blogImage", maxCount: 1 },
  { name: "authorProfileImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 10 },
]);

export { storage, fileFilter };
