import { Router } from "express";
import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  getCoursesByCategory,
} from "../controllers/academiaCourse.controller.js";
import { uploadFiles } from "../multer/multerConfig.js";

const router = Router();

// list + create
router.route("/").get(getCourses).post(uploadFiles, createCourse); // expects form-data with fields + files
router.get("/category/:category", getCoursesByCategory);


// read / update / delete by :idOrSlug
router
  .route("/:idOrSlug")
  .get(getCourse)
  .put(uploadFiles, updateCourse) // full update (supports file replacement)
  .patch(uploadFiles, updateCourse) // partial is fine too
  .delete(deleteCourse);

export default router;
