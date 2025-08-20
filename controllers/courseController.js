import fs from "fs";
import path from "path";
import CourseGroup from "../models/Course.js";
import SubCourses from "../models/SubCourse.js"; // Ensure correct path
import { uploadFiles } from "../multer/multerConfig.js";
import CourseFeature from "../models/courseModel.js";
import Instructor from "../models/Instructor.js";

export const createCourse = async (req, res) => {
  try {
    const {
      course_Name,
      url_Slug,
      video_Id,
      course_Category,
      Skill_Level,
      Short_Description,
      Course_Description,
      Instructor,
      Monthly_Fee,
      Admission_Fee,
      Duration_Months,
      Duration_Day,
      Meta_Title,
      Meta_Description,
      status,
      View_On_Web,
      showtoc,
      In_Sitemap,
      priority,
      Page_Index,
      Custom_Canonical_Url,
      category_Description,
      bootcamp,
    } = req.body;

    const course_Image = req.files?.["course_Image"]?.[0]?.path || "";
    const Brochure = req.files?.["Brochure"]?.[0]?.path || "";

    // ✅ Check for duplicate url_Slug and Custom_Canonical_Url
    const existingCourse = await CourseGroup.findOne({
      $or: [
        { "courses.url_Slug": url_Slug },
        // { "courses.Custom_Canonical_Url": Custom_Canonical_Url }
      ],
    });

    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "url_Slug  already exists",
      });
    }

    const courseData = {
      course_Name,
      url_Slug,
      course_Image,
      video_Id,
      Skill_Level,
      Short_Description,
      Course_Description,
      Instructor,
      Monthly_Fee,
      Admission_Fee,
      Duration_Months,
      Duration_Day,
      Meta_Title,
      Meta_Description,
      Brochure,
      priority,
      status: status || "Active",
      View_On_Web: View_On_Web || false,
      showtoc: showtoc || false,
      In_Sitemap: In_Sitemap || false,
      Page_Index: Page_Index || false,
      bootcamp: bootcamp || false,
      Custom_Canonical_Url,
    };

    // Check if category already exists
    let categoryGroup = await CourseGroup.findOne({
      category_Name: course_Category,
    });

    if (categoryGroup) {
      categoryGroup.courses.push(courseData);
      await categoryGroup.save();
    } else {
      categoryGroup = new CourseGroup({
        category_Name: course_Category,
        category_Description: category_Description || "",
        courses: [courseData],
      });
      await categoryGroup.save();
    }

    res.status(201).json({
      success: true,
      message: "Course added successfully",
      data: categoryGroup,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// faq
export const addFaqToCourse = async (req, res) => {
  const { courseId } = req.params;
  const faqs = req.body.faqs;

  if (!Array.isArray(faqs) || faqs.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide an array of FAQs.",
    });
  }

  try {
    const categoryGroup = await CourseGroup.findOne({
      "courses._id": courseId,
    });

    if (!categoryGroup) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const course = categoryGroup.courses.id(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found in category.",
      });
    }

    course.faqs.push(...faqs); // push multiple FAQs
    await categoryGroup.save();

    return res.status(200).json({
      success: true,
      message: "FAQs added successfully.",
      data: course.faqs,
    });
  } catch (err) {
    console.error("Error adding FAQs:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export const getAllFaqsInCourses = async (req, res) => {
  try {
    const allCourses = await CourseGroup.find().lean();

    const result = [];

    for (const group of allCourses) {
      for (const course of group.courses) {
        if (course.faqs && course.faqs.length > 0) {
          result.push({
            _id: course._id,
            courseName: course.course_Name,
            category: group.category_Name,
            faqs: course.faqs,
          });
        }
      }
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("❌ ERROR:", err); // 👈 full error in console

    res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: err.message || "Unknown error", // 👈 include actual message
    });
  }
};

export const getCourseFaqs = async (req, res) => {
  const { courseId } = req.params;

  try {
    const courseGroup = await CourseGroup.findOne({ "courses._id": courseId });
    if (!courseGroup)
      return res.status(404).json({ message: "Course not found" });

    const course = courseGroup.courses.id(courseId);
    res.json(course.faqs || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateFaq = async (req, res) => {
  const { courseId, faqId } = req.params;
  const { question, answer } = req.body;

  try {
    const courseGroup = await CourseGroup.findOne({ "courses._id": courseId });
    if (!courseGroup)
      return res.status(404).json({ message: "Course not found" });

    const course = courseGroup.courses.id(courseId);
    const faq = course.faqs.id(faqId);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    faq.question = question;
    faq.answer = answer;

    await courseGroup.save();

    res.json({ success: true, faq });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteFaq = async (req, res) => {
  const { courseId, faqId } = req.params;

  try {
    const courseGroup = await CourseGroup.findOne({ "courses._id": courseId });
    if (!courseGroup)
      return res.status(404).json({ message: "Course not found" });

    const course = courseGroup.courses.id(courseId);
    course.faqs = course.faqs.filter((faq) => faq._id.toString() !== faqId);

    await courseGroup.save();

    res.json({ success: true, message: "FAQ deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export const getallCourses = async (req, res) => {
//   try {
//     const coursesByCategory = await CourseGroup.find({});
//     res.status(200).json({
//       success: true,
//       data: coursesByCategory,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch courses",
//       error: error.message,
//     });
//   }
// };

export const getallCourses = async (req, res) => {
  try {
    const coursesByCategory = await CourseGroup.find({})
      .populate({
        path: 'courses.Instructor',
        model: 'Instructor',
        select: 'name photo', // whatever you need
      })
      .lean(); // faster response, plain objects

    res.status(200).json({
      success: true,
      data: coursesByCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const id = req.params.id;
    let foundCourse = null;

    const allGroups = await CourseGroup.find({});

    for (const group of allGroups) {
      const course = group.courses.find((c) => c._id.toString() === id);

      if (course) {
        foundCourse = {
          ...course.toObject(),
          category_Name: group.category_Name,
        };
        break;
      }
    }

    if (!foundCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(foundCourse);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const courseId = req.params.id;
      const updatedData = { ...req.body };

      const allGroups = await CourseGroup.find({});

      let targetGroup = null;
      let targetCourse = null;

      // STEP 1: Check for duplicates (only url_Slug)
      for (const group of allGroups) {
        for (const course of group.courses) {
          if (course._id.toString() !== courseId) {
            if (course.url_Slug === updatedData.url_Slug) {
              return res.status(400).json({
                message:
                  "Duplicate found: url_Slug already exists in another course.",
              });
            }
          }
        }
      }

      // STEP 2: Find and update the course
      for (const group of allGroups) {
        const courseIndex = group.courses.findIndex(
          (c) => c._id.toString() === courseId
        );

        if (courseIndex !== -1) {
          targetGroup = group;
          targetCourse = group.courses[courseIndex];

          // --- FILE: Image ---
          if (req.files?.course_Image) {
            const newImagePath = req.files["course_Image"][0].path;

            if (targetCourse.course_Image) {
              const oldImagePath = path.resolve(targetCourse.course_Image);
              fs.unlink(oldImagePath, (err) => {
                if (err) console.error("Error deleting old image:", err);
              });
            }

            targetCourse.course_Image = newImagePath;
          }

          // --- FILE: Brochure ---
          if (req.files?.Brochure) {
            const newBrochurePath = req.files["Brochure"][0].path;

            if (targetCourse.Brochure) {
              const oldBrochurePath = path.resolve(targetCourse.Brochure);
              fs.unlink(oldBrochurePath, (err) => {
                if (err) console.error("Error deleting old brochure:", err);
              });
            }

            targetCourse.Brochure = newBrochurePath;
          }

          // --- Update other fields ---
          for (const key in updatedData) {
            if (updatedData[key] !== undefined) {
              targetCourse[key] = updatedData[key];
            }
          }

          // Save the modified CourseGroup
          await targetGroup.save();

          return res.status(200).json({
            message: "Course updated successfully",
            updatedCourse: targetCourse,
          });
        }
      }

      res.status(404).json({ message: "Course not found" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error: " + error.message });
    }
  });
};

export const updateCategoryInfo = async (req, res) => {
  try {
    const { id } = req.params; // This is the category (CourseGroup) _id
    const { category_Name, category_Description } = req.body;

    const category = await CourseGroup.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category_Name !== undefined) {
      category.category_Name = category_Name;
    }

    if (category_Description !== undefined) {
      category.category_Description = category_Description;
    }

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      updatedCategory: category,
    });
  } catch (err) {
    console.error("Update category error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error: " + err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const allGroups = await CourseGroup.find({});

    let targetGroup = null;
    let targetCourseIndex = -1;
    let deletedCourse = null;

    // Step 1: Find the course in CourseGroups
    for (const group of allGroups) {
      const index = group.courses.findIndex(
        (c) => c._id.toString() === courseId
      );

      if (index !== -1) {
        targetGroup = group;
        targetCourseIndex = index;
        deletedCourse = group.courses[index];
        break;
      }
    }

    if (!targetGroup || targetCourseIndex === -1) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Step 2: Delete course image if exists
    if (deletedCourse.course_Image) {
      const courseImagePath = path.resolve(deletedCourse.course_Image);
      if (fs.existsSync(courseImagePath)) {
        fs.unlink(courseImagePath, (err) => {
          if (err) console.error("Error deleting course image:", err);
        });
      }
    }

    // Step 3: Delete brochure if exists
    if (deletedCourse.Brochure) {
      const brochurePath = path.resolve(deletedCourse.Brochure);
      if (fs.existsSync(brochurePath)) {
        fs.unlink(brochurePath, (err) => {
          if (err) console.error("Error deleting brochure:", err);
        });
      }
    }

    // Step 4: Remove the course from the group
    targetGroup.courses.splice(targetCourseIndex, 1);

    // Step 5: Defensive check — prevent broken duplicates
    const isDuplicate = targetGroup.courses.some(
      (c, i, arr) =>
        c.url_Slug == null ||
        arr.filter((cc) => cc.url_Slug === c.url_Slug).length > 1
    );

    if (isDuplicate) {
      return res.status(400).json({
        message: "Duplicate or null url_Slug detected in courses. Cannot save.",
      });
    }

    // Step 6: Mark array modified and save group
    targetGroup.markModified("courses");
    await targetGroup.save();

    // Step 7: Optional - Remove from SubCourses too
    await SubCourses.updateMany(
      { "category_courses.course_id": courseId },
      { $pull: { category_courses: { course_id: courseId } } }
    );

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      message: "Internal server error: " + error.message,
    });
  }
};

export const getCoursesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Find the category group by slug or name
    const courseGroup = await CourseGroup.findOne({ category_Name: category });

    if (!courseGroup) {
      return res
        .status(404)
        .json({ message: "No category found for this name" });
    }

    // Manually populate Instructor for each course
    const populatedCourses = await Promise.all(
      courseGroup.courses.map(async (course) => {
        const populated = await CourseGroup.populate(course, {
          path: "Instructor",
        });
        return populated;
      })
    );

    // Return the full group, but with populated instructors
    res.status(200).json({
      category_Name: courseGroup.category_Name,
      category_Description: courseGroup.category_Description,
      courses: populatedCourses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error: " + error.message });
  }
};

export const getBootcampCoursesOnly = async (req, res) => {
  try {
    const courseGroups = await CourseGroup.find();

    const bootcampCourses = [];

    for (const group of courseGroups) {
      const matchingCourses = group.courses
        .filter((course) => course.bootcamp === true)
        .map((course) => ({
          ...course.toObject(),
          category_Name: group.category_Name,
          category_Description: group.category_Description,
          bootcampcategory: group.bootcampcategory || "",
        }));

      bootcampCourses.push(...matchingCourses);
    }

    res.status(200).json({
      success: true,
      data: bootcampCourses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};

export const getCoursesByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Step 1: Find the CourseGroup that contains the course with this slug
    const courseGroup = await CourseGroup.findOne({
      "courses.url_Slug": slug,
    }).lean(); // lean gives plain JS objects, not Mongoose docs

    // console.log(courseGroup , 'test')

    if (!courseGroup) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Step 2: Extract the actual course
    const course = courseGroup.courses.find((c) => c.url_Slug === slug);

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found inside category" });
    }

    // Step 3: Populate the instructor (manually since it's nested)
    const populatedInstructor = await Instructor.findById(
      course.Instructor
    ).lean();
    if (populatedInstructor) {
      course.Instructor = populatedInstructor;
    }

    // Step 4: Get the course module
    const courseModule = await CourseFeature.findOne({
      courseId: course._id,
    }).lean();

    // Step 5: Return final data
    return res.status(200).json({
      ...course,
      courseModule: courseModule || null,
      category_Name: courseGroup.category_Name || null, // include category name
    });
  } catch (error) {
    console.error("Error fetching course by slug:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getCourseBySlug = async (req, res) => {
  try {
    const { courseSlug } = req.params;
    const course = await SubCourses.findOne({ url_Slug: courseSlug }).populate(
      "course_Category"
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCoursesByName = async (req, res) => {
  try {
    const categoryId = req.params.categoryId; // Get category ID from URL
    const courses = await Course.find({
      course_Category: "67b31e12965eb35b11c3ea41",
    }); // Filter courses by category
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching courses", error });
  }
};
