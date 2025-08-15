import express from 'express';
import {
  createFaqCategory,
  getAllFaqCategories,
  getFaqCategoryById,
  updateFaqCategory,
  deleteFaqCategory
} from '../controllers/faqCategoryController.js';
// Middleware for handling image uploads
const routerfaq = express.Router();
// POST: Create a new FAQ Category
routerfaq.post('/', createFaqCategory);

// GET: Fetch all FAQ Categories
routerfaq.get('/', getAllFaqCategories);

// GET: Fetch a single FAQ Category by ID
routerfaq.get('/:id', getFaqCategoryById);

// PUT: Update an FAQ Category
routerfaq.put('/:id', updateFaqCategory);

// DELETE: Delete an FAQ Category
routerfaq.delete('/:id', deleteFaqCategory);

export default routerfaq;
