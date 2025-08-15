import mongoose from 'mongoose';

const cityCategorySchema = new mongoose.Schema({
    cityCategoryName: { type: String, required: true },
    urlSlug: { type: String, required: true, unique: true },
    shortDescription: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
    inSitemap: { type: Boolean, default: false },
    pageIndex: { type: Boolean, default: false },
    customCanonicalUrl: { type: String },
});

const CityCategory = mongoose.model('CityCategory', cityCategorySchema);

export default CityCategory;
