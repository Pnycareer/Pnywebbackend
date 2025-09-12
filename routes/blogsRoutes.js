import express from "express";
import { uploadFiles } from "../multer/multerConfig.js";
import {
  addFaqToBlog,
  createBlog,
  deleteBlog,
  deleteBlogFaq,
  getAllBlogs,
  getAllFaqsInBlogs,
  getBlogById,
  getBlogBySlug,
  getBlogCategories,
  getBlogFaqs,
  getBlogsByCategory,
  updateBlog,
  updateBlogFaq,
} from "../controllers/blogController.js";
import { allowRoles, checkPublicToken } from "../middlewar/checkRole.js";
import { verifyToken } from "../middlewar/verifyToken.js";

const router = express.Router();

// ------------------PublicRoutes-----------------------------------------------

// Get all blogs
router.get("/", checkPublicToken, getAllBlogs);

// Get single blog
router.get("/:id", getBlogById);

router.get("/getonslug/:slug",  getBlogBySlug);

router.get("/categories/get", getBlogCategories);

router.get("/by-category/:category", getBlogsByCategory);


// Blog-Faq's Routes

router.post(
  "/add-faq/:blogId",
  verifyToken,
  allowRoles("admin", "modifier", "superadmin"),
  addFaqToBlog
);

router.get("/faqs/:blogId", getBlogFaqs);
router.get("/blogfaqs/get", getAllFaqsInBlogs);

router.put(
  "/faqs/:blogId/:faqId",
  verifyToken,
  allowRoles("superadmin", "modifier"),
  updateBlogFaq
);

router.delete(
  "/faqs/:blogId/:faqId",
  verifyToken,
  allowRoles("superadmin", "modifier"),
  deleteBlogFaq
);


// ---------------------


// ------------------Private Routes-----------------------------------------------

// Create blog
router.post("/", uploadFiles, verifyToken, allowRoles("admin" , 'modifier' , "superadmin") , createBlog);

// Update blog
router.put("/:id", uploadFiles, verifyToken, allowRoles('modifier' , "superadmin"), updateBlog);

// Delete blog
router.delete("/:id", uploadFiles, verifyToken, allowRoles('modifier' , "superadmin"), deleteBlog);







export default router;
