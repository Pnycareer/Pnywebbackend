import mongoose from "mongoose";

const BrochureSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      city: { type: String, required: true },
      courseName: { type: String, required: true }, // ✅ added
    },
    { timestamps: true }
  );
  

export default mongoose.models.BrochureRequest ||
  mongoose.model("BrochureRequest", BrochureSchema);
