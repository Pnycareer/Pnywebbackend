import { Router } from "express";
import { createApplication, getAllApplications, markApplicationDone } from "../controllers/application.controller.js";

const router = Router();

// POST /api/applications
router.post("/", createApplication);
router.get("/", getAllApplications);
router.patch("/:id/done", markApplicationDone);

export default router;
