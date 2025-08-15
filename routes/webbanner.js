import express from "express";
import { uploadFiles } from "../multer/multerConfig.js";
import { uploadWebBanner, getActiveWebBanner, deleteWebBanner, updateWebBanner } from "../controllers/Webbanner.controller.js";
import { allowRoles, checkPublicToken } from "../middlewar/checkRole.js";
import { verifyToken } from "../middlewar/verifyToken.js";

const router = express.Router();


// Public Routes
// Get Active Web Banner
router.get("/get", checkPublicToken, getActiveWebBanner);

// Private Routes

// Upload Web Banner
router.post("/upload", uploadFiles, verifyToken, allowRoles("superadmin") , uploadWebBanner);

// Delete Web Banner
router.delete("/:id", verifyToken, allowRoles("superadmin") ,deleteWebBanner);


// Update Web Banner
router.put("/update/:id", uploadFiles, verifyToken, allowRoles("superadmin") , updateWebBanner);

export default router;
