import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  Category_Name: { type: String, required: true, unique: true },
  url_Slug: { type: String, required: true, unique: true },
  Icon: { type: String, required: true },
  position: { type: Number, required: true },
  viewonweb: { type: Boolean, required: true },
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
