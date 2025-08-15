import fs from "fs";
import SubCourse from "../models/SubCourse.js";
import Instructor from "../models/Instructor.js";
import Course from "../models/Course.js";
import mongoose from "mongoose";

export const createsubcategorycourses = async (req, res) => {
  try {
    let {
      name,
      url_slug,
      meta_title,
      meta_description,
      category_courses,
      category_instructors,
    } = req.body;

    // ✅ Check required fields
    if (!name || !url_slug || !meta_title || !meta_description) {
      return res.status(400).json({
        error:
          "Missing required fields: name, url_slug, meta_title, meta_description",
      });
    }

    // Parse JSON if sent as a string
    if (typeof category_courses === "string") {
      try {
        category_courses = JSON.parse(category_courses);
      } catch (error) {
        return res.status(400).json({
          error: "Invalid JSON format for category_courses",
        });
      }
    }

    if (typeof category_instructors === "string") {
      try {
        category_instructors = JSON.parse(category_instructors);
      } catch (error) {
        return res.status(400).json({
          error: "Invalid JSON format for category_instructors",
        });
      }
    }

    if (!Array.isArray(category_courses)) category_courses = [];
    if (!Array.isArray(category_instructors)) category_instructors = [];

    // ✅ Fetch and validate courses
    let validCourses = [];
    let courseSet = new Set();
    for (const course of category_courses) {
      const courseId = course.course_id ? course.course_id : course;

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          error: `Invalid course ID: ${courseId}`,
        });
      }

      const courseData = await Course.findById(courseId);
      if (!courseData) {
        return res.status(404).json({
          error: `Course with ID ${courseId} not found`,
        });
      }

      if (!courseSet.has(courseData._id.toString())) {
        courseSet.add(courseData._id.toString());
        validCourses.push({ course_id: courseData._id });
      }
    }

    // ✅ Fetch and validate instructors
    let validInstructors = [];
    let instructorSet = new Set();
    for (const instructor of category_instructors) {
      const instructorId = instructor.instructor_id
        ? instructor.instructor_id
        : instructor;

      if (!mongoose.Types.ObjectId.isValid(instructorId)) {
        return res.status(400).json({
          error: `Invalid instructor ID: ${instructorId}`,
        });
      }

      const instructorData = await Instructor.findById(instructorId);
      if (!instructorData) {
        return res.status(404).json({
          error: `Instructor with ID ${instructorId} not found`,
        });
      }

      if (!instructorSet.has(instructorData._id.toString())) {
        instructorSet.add(instructorData._id.toString());
        validInstructors.push({ instructor_id: instructorData._id });
      }
    }

    // ✅ Check if the subcategory already exists
    let existingCategory = await SubCourse.findOne({ url_slug });

    if (existingCategory) {
      existingCategory.category_courses = [
        ...existingCategory.category_courses.filter(
          (existing) => !courseSet.has(existing.course_id.toString())
        ),
        ...validCourses,
      ];
      existingCategory.category_instructors = [
        ...existingCategory.category_instructors.filter(
          (existing) => !instructorSet.has(existing.instructor_id.toString())
        ),
        ...validInstructors,
      ];

      await existingCategory.save();

      return res.status(200).json({
        message: "Subcategory updated successfully",
        data: existingCategory,
      });
    } else {
      // ✅ Create new subcategory with unique courses & instructors
      const newCategory = new SubCourse({
        name,
        url_slug,
        meta_title,
        meta_description,
        description: req.body.description || "",
        category_courses: validCourses,
        category_instructors: validInstructors,
      });

      await newCategory.save();
      return res.status(201).json({
        message: "Subcategory created successfully",
        data: newCategory,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// export const getSubCourseBySlug = async (req, res) => {
//   try {
//     const { url_slug } = req.params;

//     // Find subcategory by url_slug
//     const subCourse = await SubCourse.findOne({ url_slug });

//     if (!subCourse) {
//       return res.status(404).json({ message: "Subcategory not found" });
//     }

//     res.status(200).json(subCourse);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Internal Server Error", error: error.message });
//   }
// };

// ✅ Get all SubCourses

export const getSubCourseBySlug = async (req, res) => {
  try {
    const { url_slug } = req.params;

    // ✅ Populate both instructors and courses
    const subCourse = await SubCourse.findOne({ url_slug })
      .populate("category_instructors.instructor_id")
      .populate("category_courses.course_id");

    if (!subCourse) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(200).json(subCourse);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllSubCourses = async (req, res) => {
  try {
    const subCourses = await SubCourse.find();
    res.status(200).json(subCourses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// ✅ Update a SubCourse
// export const updateSubCourse = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedCourse = await SubCourse.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });

//     if (!updatedCourse) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     res.status(200).json(updatedCourse);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error updating course", error: error.message });
//   }
// };

export const updateSubCourse = async (req, res) => {
  try {
    const { id, itemId } = req.params; // Get main sub-course ID and optional item ID
    const updateData = req.body; // Data to update

    // Extract file paths from request (if provided)
    const newCourseImagePath = req.files?.course_image?.[0]?.path || null;
    const newInstructorPhotoPath = req.files?.photo?.[0]?.path || null;

    // Fetch the existing sub-course
    const existingCourse = await SubCourse.findById(id);
    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    let itemUpdated = false;

    // If itemId is provided, update a specific course/instructor
    if (itemId) {
      // Update category_courses if itemId matches a course
      existingCourse.category_courses = existingCourse.category_courses.map(
        (course) => {
          if (course._id.toString() === itemId) {
            // Delete old image if a new one is uploaded
            if (
              newCourseImagePath &&
              course.course_image &&
              fs.existsSync(course.course_image)
            ) {
              try {
                fs.unlinkSync(course.course_image);
              } catch (err) {
                console.error("Error removing old course image:", err);
              }
            }

            itemUpdated = true;
            return {
              ...course.toObject(),
              ...updateData,
              course_image: newCourseImagePath || course.course_image, // Update course image if provided
            };
          }
          return course;
        }
      );

      // Update category_instructors if itemId matches an instructor
      if (!itemUpdated) {
        existingCourse.category_instructors =
          existingCourse.category_instructors.map((instructor) => {
            if (instructor._id.toString() === itemId) {
              // Delete old photo if a new one is uploaded
              if (
                newInstructorPhotoPath &&
                instructor.photo &&
                fs.existsSync(instructor.photo)
              ) {
                try {
                  fs.unlinkSync(instructor.photo);
                } catch (err) {
                  console.error("Error removing old instructor photo:", err);
                }
              }

              itemUpdated = true;
              return {
                ...instructor.toObject(),
                ...updateData,
                photo: newInstructorPhotoPath || instructor.photo, // Update instructor photo if provided
              };
            }
            return instructor;
          });
      }

      if (!itemUpdated) {
        return res.status(404).json({
          message: "Item not found in category_courses or category_instructors",
        });
      }
    } else {
      // If no itemId is provided, update the whole sub-course
      Object.assign(existingCourse, updateData);
    }

    // Save the updated document
    const updatedCourse = await existingCourse.save();
    res.status(200).json(updatedCourse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating course", error: error.message });
  }
};

export const Deletecategory = async (req, res) => {
  try {
    const { id, itemId } = req.params;

    // Find the sub-course by ID
    const existingCourse = await SubCourse.findById(id);
    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // If itemId is provided, delete the specific course or instructor
    if (itemId) {
      let itemDeleted = false;

      // Remove from category_courses if it matches itemId
      const updatedCourses = existingCourse.category_courses.filter(
        (course) => {
          if (course._id.toString() === itemId) {
            // Delete associated image
            if (course.course_image && fs.existsSync(course.course_image)) {
              try {
                fs.unlinkSync(course.course_image);
              } catch (err) {
                console.error("Error removing course image:", err);
              }
            }
            itemDeleted = true;
            return false; // Remove from array
          }
          return true;
        }
      );

      // Remove from category_instructors if it matches itemId
      const updatedInstructors = existingCourse.category_instructors.filter(
        (instructor) => {
          if (instructor._id.toString() === itemId) {
            // Delete associated image
            if (instructor.photo && fs.existsSync(instructor.photo)) {
              try {
                fs.unlinkSync(instructor.photo);
              } catch (err) {
                console.error("Error removing instructor photo:", err);
              }
            }
            itemDeleted = true;
            return false; // Remove from array
          }
          return true;
        }
      );

      if (!itemDeleted) {
        return res.status(404).json({ message: "Item not found" });
      }

      // Update and save
      existingCourse.category_courses = updatedCourses;
      existingCourse.category_instructors = updatedInstructors;
      await existingCourse.save();

      return res.status(200).json({ message: "Item deleted successfully" });
    }

    // If only id is provided, delete the entire sub-course and associated images
    existingCourse.category_courses.forEach((course) => {
      if (course.course_image && fs.existsSync(course.course_image)) {
        try {
          fs.unlinkSync(course.course_image);
        } catch (err) {
          console.error("Error removing course image:", err);
        }
      }
    });

    existingCourse.category_instructors.forEach((instructor) => {
      if (instructor.photo && fs.existsSync(instructor.photo)) {
        try {
          fs.unlinkSync(instructor.photo);
        } catch (err) {
          console.error("Error removing instructor photo:", err);
        }
      }
    });

    await SubCourse.findByIdAndDelete(id);

    return res.status(200).json({ message: "Sub-course deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting sub-course", error: error.message });
  }
};
