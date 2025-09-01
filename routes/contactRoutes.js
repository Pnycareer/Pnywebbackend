import express from "express";
import {
  getAllContacts,
  submitContactForm,
} from "../controllers/contactController.js";

const router = express.Router();

router.post("/", submitContactForm);
router.get("/", getAllContacts); // new route

export default router;
