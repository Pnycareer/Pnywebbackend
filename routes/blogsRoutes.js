import express from "express";
import { uploadFiles } from "../multer/multerConfig.js";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
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


// ------------------Private Routes-----------------------------------------------

// Create blog
router.post("/", uploadFiles, verifyToken, allowRoles("admin" , 'modifier' , "superadmin") , createBlog);

// Update blog
router.put("/:id", uploadFiles, verifyToken, allowRoles('modifier' , "superadmin"), updateBlog);

// Delete blog
router.delete("/:id", uploadFiles, verifyToken, allowRoles('modifier' , "superadmin"), deleteBlog);



export default router;
