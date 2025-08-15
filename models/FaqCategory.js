import mongoose from 'mongoose';
const faqCategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,

    trim: true
  },
  urlSlug: {
    type: String,
    trim: true
  },
  faqImage: {
    type: String,  // Store the image URL/path after upload

  },
  categoryDescription: {
    type: String,
    trim: true
  },
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  inSitemap: {
    type: Boolean,
    default: false
  },
  indexPage: {
    type: Boolean,
    default: false
  },
  customCanonicalUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const FaqCategory = mongoose.model('FaqCategory', faqCategorySchema);
export default FaqCategory;
