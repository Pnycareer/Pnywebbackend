import mongoose from 'mongoose';

const cityWiseSchema = new mongoose.Schema({

  city_Name: { type: String, required: true },
  special_Page: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SpecialPage' }], // One-to-Many relationship
  view_On_Web: { type: Boolean, default: false }
});

const CityWise = mongoose.model('CityWise', cityWiseSchema);
export default CityWise;
