import mongoose from "mongoose";

const MetaSchema = new mongoose.Schema({
  meta_title: { type: String, required: true },
  meta_description: { type: String, required: true },
  meta_keywords: { type: String, default: "" },
});

const Meta = mongoose.model("Meta", MetaSchema);
export default Meta;
