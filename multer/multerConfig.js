import multer from "multer";

// Set up storage configuration for multiple image types and brochures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case "course_Image":
        cb(null, "uploads/images/courseimages");
        break;
      case "Brochure":
      case "Brochuresub": // ✅ Added Brochuresub for subcourses
        // cb(null, "uploads/images/flyers/brochures"); // 👈 updated path
        cb(null, "uploads/images/flyers/brochures"); // 👈 updated path
        break;
      case "postThumbnailImage":
        cb(null, "uploads/images/postThumbnail");
        break;
      case "flyerFile":
        cb(null, "uploads/images/flyers/images"); // 👈 updated path
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
      case "Imagesub": // ✅ Added Imagesub for subcourses
        cb(null, "uploads/images/subimage");
        break;
      case "blogImage":
        cb(null, "uploads/images/blogs");
        break;
      // --- Inside destination switch ---
      case "authorProfileImage": // ✅ NEW case added
        cb(null, "uploads/images/authorprofile");
        break;
      case "editorImage": // ✅ Add this case
        cb(null, "uploads/images/editor");
        break;
      case "galleryImages":
        cb(null, "uploads/images/gallery"); // ✅ Create uploads/images/gallery folder
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
      "webbanner", // ✅ Add this here
      "blogImage", // ✅ add this here!
      "authorProfileImage", // ✅ NEW field allowed here
      "editorImage",
      "galleryImages" // ✅ Add here too
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
  { name: "Brochuresub", maxCount: 10 }, // ✅ Added Brochuresub
  { name: "postThumbnailImage", maxCount: 1 },
  { name: "flyerFile", maxCount: 1 },
  { name: "categoryImage", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
  { name: "faqImage", maxCount: 1 },
  { name: "subimage", maxCount: 1 },
  { name: "Imagesub", maxCount: 1 }, // ✅ Added Imagesub
  { name: "photo", maxCount: 1 },
  { name: "image", maxCount: 1 },
  { name: "webbanner", maxCount: 1 },
  { name: "blogImage", maxCount: 1 },
  { name: "authorProfileImage", maxCount: 1 }, // ✅ NEW field added here
  { name: "galleryImages", maxCount: 10 }, // ✅ ADD THIS LINE for multiple gallery uploads
]);

export { storage, fileFilter };
