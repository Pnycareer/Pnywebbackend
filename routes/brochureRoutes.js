import express from "express";
import {
  createBrochureRequest,
  getAllBrochureRequests,
  getBrochureRequestById,
  updateBrochureRequest,
  deleteBrochureRequest,
} from "../controllers/brochureController.js";

const router = express.Router();

// /api/brochure
router.post("/", createBrochureRequest);
router.get("/", getAllBrochureRequests);
router.get("/:id", getBrochureRequestById);
router.put("/:id", updateBrochureRequest);
router.delete("/:id", deleteBrochureRequest);

export default router;
