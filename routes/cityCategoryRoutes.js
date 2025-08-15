import express from 'express';
import { createCityCategory, deleteCityCategory, getAllCityCategories, getCityCategoryById, updateCityCategory } from '../controllers/cityCategoryController.js';

const specialcityroutes= express.Router();

specialcityroutes.post('/', createCityCategory);
specialcityroutes.get('/', getAllCityCategories);
specialcityroutes.get('/:id', getCityCategoryById);
specialcityroutes.put('/:id', updateCityCategory);
specialcityroutes.delete('/:id',deleteCityCategory);
export default specialcityroutes;
