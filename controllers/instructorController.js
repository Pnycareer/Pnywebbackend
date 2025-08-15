import fs from 'fs';
import path from 'path';
import Instructor from "../models/Instructor.js";
import SubCourses from "../models/SubCourse.js"; // Ensure correct path
import { uploadFiles } from "../multer/multerConfig.js";


// Create Category
export const createInstructor = async (req, res) => {
  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      // 1. Handle uploaded photo
      const instructorImage = req.files?.photo?.[0]?.path || null;

      // 2. Extract categories from request body
      let { categories, ...otherData } = req.body;

      // If client sent a comma-separated string, split it into an array
      if (typeof categories === 'string') {
        categories = categories
          .split(',')
          .map(cat => cat.trim())
          .filter(Boolean);
      }

      // Validate
      if (!Array.isArray(categories) || categories.length === 0) {
        return res
          .status(400)
          .json({ message: 'You must provide at least one category.' });
      }

      // 3. Build the payload
      const instructorData = {
        ...otherData,
        photo: instructorImage,
        categories
      };

      // 4. Save to Mongo
      const instructor = new Instructor(instructorData);
      await instructor.save();

      res
        .status(201)
        .json({ message: 'Instructor created successfully', instructor });

    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Internal server error: ' + error.message });
    }
  });
};

// Get all categories
// export const getInstructor = async (req, res) => {
//   try {
//     const categories = await Instructor.find();
//     res.status(200).json(categories);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getInstructor = async (req, res) => {
  try {
    const { category } = req.query;

    // If a category was passed, only return instructors
    // whose categories array contains that value
    const filter = category
      ? { categories: category }
      : {};

    const instructors = await Instructor.find(filter);
    res.status(200).json(instructors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

// Update Category
export const updateInstructor = async (req, res) => {
  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const instructor = await Instructor.findById(req.params.id);
      if (!instructor) {
        return res.status(404).json({ message: "Instructor not found" });
      }

      // Prepare updated data
      const updatedData = { ...req.body };

      if (req.files && req.files["photo"]) {
        const newPhotoPath = req.files["photo"][0].path;

        // Delete old profile picture if it exists
        if (instructor.photo) {
          const oldPhotoPath = path.resolve(instructor.photo);
          fs.unlink(oldPhotoPath, (err) => {
            if (err) {
              console.error("Error deleting old photo:", err);
            }
          });
        }

        // Assign new photo path to updated data
        updatedData.photo = newPhotoPath;
      }

      // Update instructor
      const updatedInstructor = await Instructor.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );

      res
        .status(200)
        .json({
          message: "Instructor updated successfully",
          updatedInstructor,
        });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error: " + error.message });
    }
  });
};

// Delete Category
// export const deleteInstructor = async (req, res) => {
//   try {
//     // Find the instructor by ID
//     const instructor = await Instructor.findById(req.params.id);
//     if (!instructor) {
//       return res.status(404).json({ message: "Instructor not found" });
//     }

//     // Delete the profile picture if it exists
//     if (instructor.photo) {
//       const photoPath = path.resolve(instructor.photo);
//       fs.unlink(photoPath, (err) => {
//         if (err) {
//           console.error("Error deleting profile picture:", err);
//         }
//       });
//     }

//     // Delete the instructor from the database
//     await Instructor.findByIdAndDelete(req.params.id);

//     res.status(200).json({ message: "Instructor deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Internal server error: " + error.message });
//   }
// };

export const deleteInstructor = async (req, res) => {
  try {
    const instructorId = req.params.id;

    // Find the instructor by ID
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Check if instructor ID exists in any SubCourses documents
    const subCoursesWithInstructor = await SubCourses.find({
      "category_instructors.instructor_id": instructorId,
    });

    if (subCoursesWithInstructor.length > 0) {
      // Remove the instructor reference from all found subcategories
      await SubCourses.updateMany(
        { "category_instructors.instructor_id": instructorId },
        { $pull: { category_instructors: { instructor_id: instructorId } } }
      );
    }

    // Delete the profile picture if it exists
    if (instructor.photo) {
      const photoPath = path.resolve(instructor.photo);
      fs.unlink(photoPath, (err) => {
        if (err) {
          console.error("Error deleting profile picture:", err);
        }
      });
    }

    // Delete the instructor from the database
    await Instructor.findByIdAndDelete(instructorId);

    res.status(200).json({ message: "Instructor deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

export const instructorbyid = async (req, res) => {
  try {
    const data = await Instructor.findById(req.params.id);
    res.status(200).json({ message: "detail fetch", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
