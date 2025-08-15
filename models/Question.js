import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  faqCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FaqCategory',
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true  // true = Yes, false = No
  }
}, {
  timestamps: true
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
