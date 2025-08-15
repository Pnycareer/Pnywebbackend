
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  url_Slug: {
    type: String,
  },
  subimage: {
    type: String,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course', // Reference to the Course model
    },
  ],
});
const SUBCategory = mongoose.model('SUBCategory', categorySchema);
export default SUBCategory;