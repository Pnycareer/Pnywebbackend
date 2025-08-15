import mongoose from 'mongoose';

const galleryCategorySchema = new mongoose.Schema({
  galleryTitle: {
    type: String,
    trim: true
  },
  isViewOnWeb: {
    type: Boolean,
    default: false  // true = Yes, false = No
  },
  coverImage: {
    type: String,  // Store the image URL/path after upload
  },
  note: {
    type: String  // To store rich text from a text editor
  }
}, {
  timestamps: true
});

const GalleryCategory = mongoose.model('GalleryCategory', galleryCategorySchema);
export default GalleryCategory;
