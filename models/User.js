// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contact: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'modifier' , 'csr' , 'advertisement'],
    default: null
  },
  password: {
    type: String,
    required: true
  },
   blocked: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
