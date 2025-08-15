// models/Page.js
import mongoose from 'mongoose';

const Termscondition = new mongoose.Schema({
  page_name: { type: String, required: true },
  page_slug: { type: String, required: true, unique: true },
  page_title: { type: String, required: true },
  page_description: { type: String, required: true },
  page_image: { type: String },
  shortdescription: { type: String },
  meta_title: { type: String },
  meta_description: { type: String },
}, { timestamps: true });

const Page = mongoose.model('Termsandcondition', Termscondition);
export default Page;
