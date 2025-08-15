import express from "express";
import {
  createInstructor,
  deleteInstructor,
  getInstructor,
  instructorbyid,
  updateInstructor,
} from "../controllers/instructorController.js";
import { allowRoles, checkPublicToken } from "../middlewar/checkRole.js";
import { verifyToken } from "../middlewar/verifyToken.js";

const router = express.Router();

router.get("/get-instructor", checkPublicToken, getInstructor);
router.get("/:id", instructorbyid);
router.post("/add-instructor", verifyToken, allowRoles("admin" , 'modifier' , "superadmin") , createInstructor);
router.delete("/:id", verifyToken, allowRoles('modifier' , "superadmin") ,deleteInstructor);
router.put("/:id", verifyToken, allowRoles('modifier' , "superadmin") ,updateInstructor);

export default router;
