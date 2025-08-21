import mongoose from "mongoose";

// 1. Blog Schema (sub-document)
const blogSubSchema = new mongoose.Schema({
  blogName: { type: String, required: true, trim: true },
  url_slug: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true, trim: true },
  blogDescription: { type: String, required: true },
  publishDate: { type: Date, default: Date.now },
  blogImage: { type: String, required: true },
  tags: [{ type: String }],
  metaTitle: { type: String, required: true, trim: true },
  metaDescription: { type: String, required: true, trim: true },
  author: {
    name: { type: String, required: true },
    bio: { type: String },
    profileImage: { type: String }
  },
  pageindex: { type: Boolean, default: true },
  insitemap: { type: Boolean, default: true },
  // canonical: { type: String, trim: true },
  inviewweb: { type: Boolean, default: true },
  showtoc: { type: Boolean, default: true } // ✅ Added this field
});

// 2. BlogCategory Schema
const blogCategorySchema = new mongoose.Schema({
  blogCategory: { type: String, required: true, unique: true, trim: true },
  blogs: [blogSubSchema]
});

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);

export default BlogCategory;
