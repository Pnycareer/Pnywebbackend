import { Router } from "express";
import { createApplication } from "../controllers/application.controller.js";

const router = Router();

// POST /api/applications
router.post("/", createApplication);

export default router;
