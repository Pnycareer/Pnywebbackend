import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    // user info
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    contact: { type: String, required: true, trim: true, maxlength: 30 },

    // course info
    courseId: { type: String, required: true, index: true },
    course_Name: { type: String, required: true, trim: true },
    url_Slug: { type: String, default: "" },

    // discount
    discountPercent: { type: Number, required: true, min: 0, max: 100 },

    status: { type: String, enum: ["pending", "done" , "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

// 🚫 One email cannot apply twice for the same course
ApplicationSchema.index({ email: 1, courseId: 1 }, { unique: true, name: "uniq_email_course" });

export const Application =
  mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
