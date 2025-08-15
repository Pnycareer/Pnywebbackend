// models/EventCategory.js
import mongoose from 'mongoose';
const EventCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  metaTitle: {
    type: String,
    trim: true,
  },
  metaDescription: {
    type: String,
    trim: true,
  },
  inSitemap: {
    type: Boolean,
    default: false,
  },
  pageIndex: {
    type: Boolean,
    default: false,
  },
  customCanonicalUrl: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

export default mongoose.model('EventCategory', EventCategorySchema);
