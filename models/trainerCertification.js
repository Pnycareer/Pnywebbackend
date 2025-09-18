import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema(
  {
    intro: { type: String, required: true }, // short intro paragraph
    whyItMatters: {
      title: { type: String, default: "Why it matters" },
      description: { type: String },
      points: [{ type: String }] // bullet points
    },
    extraContent: { type: String } // full detailed content (markdown/HTML allowed)
  },
  { timestamps: true }
);

export default mongoose.model("TrainerCertification", certificationSchema);
