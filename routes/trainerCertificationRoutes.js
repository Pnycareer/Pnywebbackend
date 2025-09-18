import express from "express";
import {
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification
} from "../controllers/trainerCertificationController.js";

const router = express.Router();

router.get("/", getCertification);
router.post("/", createCertification);
router.put("/:id", updateCertification);
router.delete("/:id", deleteCertification);

export default router;
