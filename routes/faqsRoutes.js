// routes/faqRoutes.js
import express from "express";
import {
  getAllFaqs,
  getFaqById,
  createFaqCategory,
  updateFaqCategory,
  deleteFaqCategory
} from "../controllers/faqsController.js"
import { uploadFiles } from "../multer/multerConfig.js";
import { verifyToken } from "../middlewar/verifyToken.js";
import { allowRoles } from "../middlewar/checkRole.js";


const router = express.Router();

router.get("/", getAllFaqs);
router.get("/:id", getFaqById);
router.post("/", uploadFiles , verifyToken , allowRoles("admin" , 'modifier' , "superadmin") , createFaqCategory);
router.put("/:id", uploadFiles ,verifyToken , allowRoles('modifier' , "superadmin") ,updateFaqCategory);
router.delete("/:id",verifyToken , allowRoles("superadmin" , "modifier") , deleteFaqCategory);

export default router;
