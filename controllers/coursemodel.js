import CourseFeature from "../models/courseModel.js";
import CourseGroup from "../models/Course.js";

// Create a new course feature
// export const createCourseFeature = async (req, res) => {
//   try {
//     const { courseId, lectures } = req.body;

//     // Check if CourseFeature with the same courseId exists
//     let courseFeature = await CourseFeature.findOne({ courseId });

//     if (courseFeature) {
//       // If it exists, push new lectures to the existing lectures array
//       courseFeature.lectures.push(...lectures);
//       await courseFeature.save();
//       return res.status(200).json(courseFeature);
//     } else {
//       // Else create a new CourseFeature document
//       courseFeature = new CourseFeature({ courseId, lectures });
//       await courseFeature.save();
//       return res.status(201).json(courseFeature);
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const createCourseFeature = async (req, res) => {
  try {
    const { courseId, lectures } = req.body;

    // Validate input
    if (!courseId || !Array.isArray(lectures) || lectures.length === 0) {
      return res.status(400).json({ message: "courseId and lectures are required" });
    }

    // Find if CourseFeature with courseId already exists
    let courseFeature = await CourseFeature.findOne({ courseId });

    if (courseFeature) {
      if (courseFeature.lectures && courseFeature.lectures.length > 0) {
        // If lectures already exist, return message
        return res.status(400).json({ message: "Lectures already added. You can only edit them." });
      } else {
        // If no lectures exist yet, add them
        courseFeature.lectures = lectures;
        await courseFeature.save();
        return res.status(200).json(courseFeature);
      }
    } else {
      // If no CourseFeature exists, create one
      courseFeature = new CourseFeature({ courseId, lectures });
      await courseFeature.save();
      return res.status(201).json(courseFeature);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all course features
export const getAllCourseFeatures = async (req, res) => {
  try {
    const features = await CourseFeature.find();

    const allCourses = await CourseGroup.find(); // get all categories and their courses

    const featuresWithCourseNames = features.map((feature) => {
      let courseName = "";
      allCourses.forEach((category) => {
        category.courses.forEach((course) => {
          if (course._id.toString() === feature.courseId.toString()) {
            courseName = course.course_Name;
          }
        });
      });

      return {
        ...feature.toObject(),
        courseName,
      };
    });

    res.status(200).json(featuresWithCourseNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const getCourseFeatureById = async (req, res) => {
  try {
    const feature = await CourseFeature.findById(req.params.id);
    if (!feature) {
      return res.status(404).json({ error: "Course feature not found" });
    }

    const allCourses = await CourseGroup.find();

    let courseName = "";
    allCourses.forEach((category) => {
      category.courses.forEach((course) => {
        if (course._id.toString() === feature.courseId.toString()) {
          courseName = course.course_Name;
        }
      });
    });

    const featureWithCourseName = {
      ...feature.toObject(),
      courseName,
    };

    res.status(200).json(featureWithCourseName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update course feature
// PUT /api/coursemodel/:id
export const updateCourseFeature = async (req, res) => {
  try {
    const { courseId, lectures } = req.body;

    // Validate required fields
    if (!courseId || !lectures || !Array.isArray(lectures)) {
      return res
        .status(400)
        .json({ error: "Missing or invalid courseId or lectures" });
    }

    const updatedFeature = await CourseFeature.findByIdAndUpdate(
      req.params.id,
      { courseId, lectures },
      { new: true, runValidators: true }
    ).populate("courseId");

    if (!updatedFeature) {
      return res.status(404).json({ error: "Course feature not found" });
    }

    res.status(200).json(updatedFeature);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete course feature
export const deleteCourseFeature = async (req, res) => {
  try {
    await CourseFeature.findByIdAndDelete(req.params.id);
    res.json({ message: "Course feature deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/coursemodel/:featureId/lecture/:lectureId
export const deleteLectureFromCourseFeature = async (req, res) => {
  try {
    const { featureId, lectureId } = req.params;

    const courseFeature = await CourseFeature.findById(featureId);
    if (!courseFeature) {
      return res.status(404).json({ error: "Course feature not found" });
    }

    // Remove the lecture by _id
    courseFeature.lectures = courseFeature.lectures.filter(
      (lecture) => lecture._id.toString() !== lectureId
    );

    await courseFeature.save();
    res
      .status(200)
      .json({ message: "Lecture deleted successfully", courseFeature });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
