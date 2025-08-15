import express from "express";
import {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
} from "../controllers/categoryController.js";
import { verifyToken } from "../middlewar/verifyToken.js";
import { allowRoles, checkPublicToken } from "../middlewar/checkRole.js";

const categoryRoutes = express.Router();

categoryRoutes.get("/", checkPublicToken, getCategories);
categoryRoutes.get("/get-courses-on-slug-category/:slug", getCategoryBySlug);
categoryRoutes.get("/:id", getCategoryById);
// Protected Routes

categoryRoutes.post(
  "/",
  verifyToken,
  allowRoles("admin", "modifier", "superadmin"),
  createCategory
);
categoryRoutes.put(
  "/:id",
  verifyToken,
  allowRoles("superadmin", "modifier"),
  updateCategory
);
categoryRoutes.delete(
  "/:id",
  verifyToken,
  allowRoles("superadmin", "modifier"),
  deleteCategory
);

export default categoryRoutes;
