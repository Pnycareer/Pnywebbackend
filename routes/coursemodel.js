import express from "express";
import {
  createCourseFeature,
  getAllCourseFeatures,
  getCourseFeatureById,
  updateCourseFeature,
  deleteCourseFeature,
  deleteLectureFromCourseFeature,
} from "../controllers/coursemodel.js";
import { allowRoles, checkPublicToken } from "../middlewar/checkRole.js";
import { verifyToken } from "../middlewar/verifyToken.js";

const router = express.Router();


router.get("/", checkPublicToken , getAllCourseFeatures);
router.get("/:id",  checkPublicToken ,getCourseFeatureById);

// protected Routes
router.post("/", verifyToken , allowRoles("admin" , 'modifier' , "superadmin") ,createCourseFeature);
router.put("/:id", verifyToken , allowRoles('modifier' , "superadmin") , updateCourseFeature);
router.delete("/:id", verifyToken , allowRoles('modifier' , "superadmin") ,deleteCourseFeature);
router.delete("/coursemodel/:featureId/:lectureId", verifyToken , allowRoles('modifier' , "superadmin") , deleteLectureFromCourseFeature);

export default router;
