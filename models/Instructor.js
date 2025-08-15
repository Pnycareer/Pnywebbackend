import mongoose from 'mongoose';

const instructorSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  photo:    { type: String },
  other_info: { type: String },
  in_View:  { type: Boolean, default: true },
  categories: {
    type: [String],
    required: true,
  }
});

const Instructor = mongoose.model('Instructor', instructorSchema);
export default Instructor;
