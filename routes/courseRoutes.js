import express from "express";
import {
  createCourse,
  getCoursesByCategorySlug,
  getallCourses,
  getCoursesByName,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByCategory,
  getBootcampCoursesOnly,
  updateCategoryInfo,
  addFaqToCourse,
  getCourseFaqs,
  updateFaq,
  deleteFaq,
  getAllFaqsInCourses,
  getCoursesByCategoryById,
  getCourseCategories,
  reorderCourses,
} from "../controllers/courseController.js";
import { uploadFiles } from "../multer/multerConfig.js";
import { allowRoles, checkPublicToken } from "../middlewar/checkRole.js";
import { verifyToken } from "../middlewar/verifyToken.js";

const courseRoutes = express.Router();

// Public
courseRoutes.get("/get-course", checkPublicToken, getallCourses);
courseRoutes.get("/faqs", getAllFaqsInCourses);
courseRoutes.get("/getonslug/:slug", getCoursesByCategorySlug);
courseRoutes.get("/:categoryId", getCoursesByName);
courseRoutes.get(
  "/getoncategory/:category", 
  checkPublicToken,
  getCoursesByCategory
);
courseRoutes.get(
  "/getoncategoryid/:id",
  checkPublicToken,
  getCoursesByCategoryById
);
courseRoutes.get("/getallcategories/getcategory", getCourseCategories);
courseRoutes.get("/bootcamp-courses/get", getBootcampCoursesOnly);
courseRoutes.get("/getonid/:id", getCourseById);

// Protected
courseRoutes.post(
  "/add-course",
  verifyToken,
  allowRoles("admin", "modifier", "superadmin"),
  uploadFiles,
  createCourse
);

courseRoutes.put(
  "/update/:id",
  verifyToken,
  allowRoles("superadmin", "modifier"),
  updateCourse
);

// routes
courseRoutes.put(
  "/reorder/:categoryId",
  verifyToken,
  allowRoles("superadmin", "modifier"),
  reorderCourses
);




courseRoutes.patch("/category-update/:id", updateCategoryInfo);
courseRoutes.delete(
  "/delete/:id",
  verifyToken,
  allowRoles("superadmin", "modifier"),
  deleteCourse
);

courseRoutes.post(
  "/add-faq/:courseId",
  verifyToken,
  allowRoles("admin", "modifier", "superadmin"),
  addFaqToCourse
);



courseRoutes.get("/faqs/:courseId", getCourseFaqs);
courseRoutes.put(
  "/faqs/:courseId/:faqId",
  verifyToken,
  allowRoles("superadmin", "modifier"),
  updateFaq
);
courseRoutes.delete(
  "/faqs/:courseId/:faqId",
  verifyToken,
  allowRoles("superadmin", "modifier"),
  deleteFaq
);

export default courseRoutes;
