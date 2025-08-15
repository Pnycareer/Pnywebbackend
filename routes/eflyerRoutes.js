import express from "express";
import {
  createEFlyer,
  deleteEFlyer,
  getAllEFlyers,
  getEFlyerById,
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

export default router;
