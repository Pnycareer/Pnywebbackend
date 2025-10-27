import mongoose from "mongoose";

const { Schema } = mongoose;

const AcademiaCourseSchema = new Schema(
  {
    coursename: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    coursecategory: { type: String, trim: true }, // "academia" | "corporate trainings"
    Course_Description: { type: String },

    Instructor: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },

    Brochure: { type: String }, // stored file path

    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    viewOnWeb: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },
    In_Sitemap: { type: Boolean, default: false },
    Page_Index: { type: Boolean, default: true },

    course_Image: { type: String }, // stored file path
    course_Image_Alt: { type: String },

    Short_Description: { type: String },
    Meta_Title: { type: String },
    Meta_Description: { type: String },

    subjects: {
      type: [{ type: String, trim: true }],
      default: [],
    },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],

    // NEW: only for "corporate trainings"
    Audience: {
      type: String,
      trim: true,
      required: function () {
        return (this.coursecategory || "").toLowerCase() === "corporate trainings";
      },
    },
    software: {
      type: String,
      trim: true,
      required: function () {
        return (this.coursecategory || "").toLowerCase() === "corporate trainings";
      },
    },
  },
  { timestamps: true }
);

AcademiaCourseSchema.path("slug").validate(async function (value) {
  const count = await this.constructor.countDocuments({
    slug: value,
    _id: { $ne: this._id },
  });
  return count === 0;
}, "Slug already exists.");

export default mongoose.model("AcademiaCourse", AcademiaCourseSchema);
