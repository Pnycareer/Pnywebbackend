// routes/cityCategoryRoutes.js
import express from 'express';
import { createFreeTrial, deleteFreeTrial, getFreeTrialById, getFreeTrials } from '../controllers/freeTrialController.js';


const freetrailrouter = express.Router();

// @route GET /api/city-categories
freetrailrouter.get('/',getFreeTrials);

// @route POST /api/city-categories
// freetrailrouter.post('/',createNewBlog);
freetrailrouter.post('/',createFreeTrial);
// @route GET /api/city-categories/:id
freetrailrouter.get('/:id',getFreeTrialById);




// @route DELETE /api/city-categories/:id
freetrailrouter.delete('/:id', deleteFreeTrial);

export default freetrailrouter;
