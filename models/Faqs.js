// models/faq.js
import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  category: {
    name: { type: String, required: true },
    url_slug: { type: String, required: false },
    category_image: { type: String },
    description: { type: String },
    meta_title: { type: String },
    meta_description: { type: String },
    meta_keywords: { type: String }
  },
  faqs: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
      status: { type: String, enum: ["0", "1"], default: "1" },
    }
  ]
}, { timestamps: true });

export default mongoose.model("Faq", faqSchema);
