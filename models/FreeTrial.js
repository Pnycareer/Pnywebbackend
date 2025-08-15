import mongoose from 'mongoose';

const freeTrialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
  city: { type: String, required: true },
  type: { type: String, required: true, default: 'Free Trial' },
}, { timestamps: true });

export default mongoose.model('FreeTrial', freeTrialSchema);
