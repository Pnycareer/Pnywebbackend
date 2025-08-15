// routes/subCourseRoutes.js
import express from "express";
import {
  createsubcategorycourses,
  Deletecategory,
  getAllSubCourses,
  getSubCourseBySlug,
  // updateCategoryCourseOrInstructor,
  updateSubCourse,
} from "../controllers/SubCourseController.js";

const router = express.Router();

// Route to get all subcourses
router.get("/", getAllSubCourses);

// Route to create a new subcourse
router.post("/", createsubcategorycourses);
router.get("/getsubcourses/:url_slug", getSubCourseBySlug);

// Route to update an existing subcourse
router.put("/update-sub-courses/:id/:itemId?" , updateSubCourse);
router.delete("/delete-category/:id/:itemId?" , Deletecategory)

export default router;
