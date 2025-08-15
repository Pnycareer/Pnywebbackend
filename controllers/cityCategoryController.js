import CityCategory from "../models/cityCategoryModel.js";
import cloudinary from "../lib/cloudinary.js";

// Create a City Category
export const createCityCategory = async (req, res) => {
    try {
        const newCategory = new CityCategory(req.body);
        await newCategory.save();
        res.status(201).json({ message: 'City Category created successfully', newCategory });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create category', error: error.message });
    }
};

// Get all City Categories
export const getAllCityCategories = async (req, res) => {
    try {
        const categories = await CityCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve categories', error: error.message });
    }
};

// Get a single City Category

export const getCityCategoryById = async (req, res) => {
    try {
        const category = await CityCategory.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch category', error: error.message });
    }
};

// Update a City Category

export const updateCityCategory = async (req, res) => {
    try {
        const category = await CityCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update category', error: error.message });
    }
};

// Delete a City Category

export const deleteCityCategory = async (req, res) => {
    try {
        await CityCategory.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete category', error: error.message });
    }
};