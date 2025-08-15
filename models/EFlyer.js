// models/CategoryWithEflyers.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const CategoryWithEflyersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    eflyers: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                default: 'No description available.'
            },
            brochureUrl: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true });

const CategoryWithEflyers = model('CategoryWithEflyers', CategoryWithEflyersSchema);

export default CategoryWithEflyers;
