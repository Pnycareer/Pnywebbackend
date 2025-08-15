import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
    category_Name: {
        type: String,
        required: true,
    },
    category_Description: {
        type: String,
        required: true,
    },
    pictures: [
        {
            type: String,
        }
    ]
}, { timestamps: true });

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;
