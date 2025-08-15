import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url_slug: { type: String, required: true },
    description: { type: String, default: "" },
    meta_title: { type: String, required: true },
    meta_description: { type: String, required: true },
    category_courses: [
      {
        course_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course", // ✅ Reference to Course model
          required: true,
        },
      },
    ],
    category_instructors: [
      {
        instructor_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Instructor", // ✅ Reference to Instructor model
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SubCourses = mongoose.model("Subcategorycourses", SubcategorySchema);
export default SubCourses;
