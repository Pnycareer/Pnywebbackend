import multer from "multer";

// Set up storage configuration for multiple image types and brochures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case "course_Image":
        cb(null, "uploads/images/courseimages");
        cb(null, "uploads/images/academiacourses");
        break;
      case "Brochure":
      case "Brochuresub":
        cb(null, "uploads/images/flyers/brochures");
        cb(null, "uploads/academia/files");
        break;
      case "postThumbnailImage":
        cb(null, "uploads/images/postThumbnail");
        break;
      case "flyerFile":
        cb(null, "uploads/images/flyers/images");
        break;
      case "categoryImage":
        cb(null, "uploads/images/categories");
        break;
      case "coverImage":
        cb(null, "uploads/images/covers");
        break;
      case "faqImage":
        cb(null, "uploads/images/faq");
        break;
      case "photo":
        cb(null, "uploads/images/instructorphoto");
        break;
      case "image":
        cb(null, "uploads/images/events");
        break;
      case "webbanner":
        cb(null, "uploads/images/webbanner");
        break;
      case "subimage":
      case "Imagesub":
        cb(null, "uploads/images/subimage");
        break;
      case "blogImage":
        cb(null, "uploads/images/blogs");
        break;

      case "authorProfileImage":
        cb(null, "uploads/images/authorprofile");
        break;
      case "editorImage":
        cb(null, "uploads/images/editor");
        break;
      case "galleryImages":
        cb(null, "uploads/images/gallery");
        break;

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
