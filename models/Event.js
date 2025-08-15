// models/Event.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventCategory',

  },
  image: {
    type: String,

    trim: true,
  },
  date: {
    type: Date,

  },
  address: {
    type: String,

    trim: true,
  },
  description: {
    type: String,
  
  },
  link: {
    type: String,

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

export default mongoose.model('Event', eventSchema);
