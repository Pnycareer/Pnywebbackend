import express from 'express';
import {
  createGalleryCategory,
  getAllGalleryCategories,
  getGalleryCategoryById,
  updateGalleryCategory,
  deleteGalleryCategory
} from '../controllers/galleryCategoryController.js';


const routergallery = express.Router();

// POST: Create a new Gallery Category
routergallery.post('/',createGalleryCategory);

// GET: Fetch all Gallery Categories
routergallery.get('/', getAllGalleryCategories);

// GET: Fetch a single Gallery Category by ID
routergallery.get('/:id', getGalleryCategoryById);

// PUT: Update a Gallery Category
routergallery.put('/:id', updateGalleryCategory);

// DELETE: Delete a Gallery Category
routergallery.delete('/:id', deleteGalleryCategory);

export default routergallery;
