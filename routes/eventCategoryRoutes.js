// routes/eventCategoryRoutes.js
import express from 'express';
import { createEventCategory, getAllEventCategories, getEventCategoryById, updateEventCategory, deleteEventCategory } from '../controllers/eventCategoryController.js';

const eventrouter = express.Router();

eventrouter.post('/', createEventCategory);
eventrouter.get('/', getAllEventCategories);
eventrouter.get('/:id', getEventCategoryById);
eventrouter.put('/:id', updateEventCategory);
eventrouter.delete('/:id', deleteEventCategory);

export default eventrouter;
