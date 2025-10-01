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
    coursecategory: { type: String, trim: true }, // flip to ObjectId later if you have a category model
    Course_Description: { type: String },

    Instructor: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },

    Brochure: { type: String }, // stored file path (e.g., uploads/academia/files/123.pdf)

    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    viewOnWeb: { type: Boolean, default: true }, // "view on web"
    priority: { type: Number, default: 0 },
    In_Sitemap: { type: Boolean, default: false },
    Page_Index: { type: Boolean, default: true },

    course_Image: { type: String }, // stored file path (e.g., uploads/images/academiacourses/xyz.jpg)
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
