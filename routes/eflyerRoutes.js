import express from "express";
import {
  createEFlyer,
  deleteEFlyer,
  getAllEFlyers,
  getEFlyerById,
  updateCategoryImage,
  updateEFlyer,
} from "../controllers/eflyerController.js";
import { uploadFiles } from "../multer/multerConfig.js";
import multer from "multer";

const router = express.Router();
router.post("/", uploadFiles, createEFlyer);
router.delete("/:id", deleteEFlyer); // NEW
router.get("/", getAllEFlyers);
router.get("/getonid/:id", getEFlyerById);
router.put('/:id', uploadFiles, updateEFlyer);
router.put("/category/:categoryId/image", uploadFiles, updateCategoryImage);


export default router;
