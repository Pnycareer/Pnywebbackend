// models/Page.js
import mongoose from "mongoose";

const Privacypolicy = new mongoose.Schema(
  {
    page_description: { type: String, required: true },
    page_title: { type: String, required: true },
    shortdescription: { type: String },
    meta_title: { type: String },
    meta_description: { type: String },
  },
  { timestamps: true }
);

const Page = mongoose.model("privacypolicy", Privacypolicy);
export default Page;
