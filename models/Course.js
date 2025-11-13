import mongoose from "mongoose";

const courseDetailSchema = new mongoose.Schema(
  {
    course_Name: { type: String, required: true },
    url_Slug: { type: String, required: true },
    course_Image: { type: String },
    course_Image_Alt: { type: String },
    video_Id: { type: String },
    Skill_Level: { type: String },
    Course_Description: { type: String },
    Instructor: { type: mongoose.Schema.Types.ObjectId, ref: "Instructor" },
    Monthly_Fee: { type: Number },
    Admission_Fee: { type: String },
    Duration_Months: { type: Number },
    Duration_Day: { type: Number },
    Meta_Title: { type: String },
    Meta_Description: { type: String },
    Brochure: { type: String },
    schemas: {
      type: [mongoose.Schema.Types.Mixed], // or [{}]
      default: [],
    },

    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    View_On_Web: { type: Boolean, default: false },
    showtoc: { type: Boolean, default: false },
    bootcamp: { type: Boolean, default: false },
    In_Sitemap: { type: Boolean, default: false },
    priority: { type: Number },
    Page_Index: { type: Boolean, default: false },
    Custom_Canonical_Url: { type: String },
    Short_Description: { type: String },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const categoryWithCoursesSchema = new mongoose.Schema({
  category_Name: { type: String, required: true },
  category_Description: { type: String },
  category_Meta_Title: { type: String },
  category_Meta_Description: { type: String },
  courses: [courseDetailSchema],
});

const CourseGroup = mongoose.model("Course", categoryWithCoursesSchema);
export default CourseGroup;
