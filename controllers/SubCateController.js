
import SUBCategory from "../models/SUBCategory.js";
import { uploadFiles } from "../multer/multerConfig.js";
// Create a new category
export const createsubCategory = async (req, res) => {
  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    try {
      const subimage = req.files && req.files["subimage"] ? req.files["subimage"][0].path : null;
      const courses = Array.isArray(req.body.courses) ? req.body.courses : [req.body.courses];

      const categoryData = {
        ...req.body,
        subimage: subimage,
        courses: courses,
      };

      const category = new SUBCategory(categoryData);
      await category.save();
      res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
      console.error("Error adding subcategory:", error);
      res.status(500).json({ message: "Internal server error: " + error.message });
    }
  });
};
// Get all categories
export const getAllsubCategories = async (req, res) => {
  try {
    const categories = await SUBCategory.find().populate("courses");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// Get a single category by ID
export const getsubCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await SUBCategory.findById(id).populate("courses");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
};

// Update an existing category
export const updatesubCategory = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      // Handle the subimage file upload
      if (req.files && req.files["subimage"]) {
        updates.subimage = req.files["subimage"][0].path;
      }

      // Update the category
      const updatedCategory = await SUBCategory.findByIdAndUpdate(id, updates, { new: true }).populate("courses");
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.status(200).json(updatedCategory);s
    } catch (error) {
      res.status(400).json({ message: "Error updating category", error });
    }
  });
};

// Delete a category
export const deletesubCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // Find and delete the category
    const deletedCategory = await SUBCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Remove the category reference from all associated courses
    await Course.updateMany({ category: id }, { $unset: { category: 1 } });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};