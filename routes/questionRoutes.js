import express from 'express';
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion
} from '../controllers/questionController.js';

const routerquestion = express.Router();

// POST: Create a new FAQ Question
routerquestion.post('/', createQuestion);

// GET: Fetch all FAQ Questions
routerquestion.get('/', getAllQuestions);

// GET: Fetch a single FAQ Question by ID
routerquestion.get('/:id', getQuestionById);

// PUT: Update an FAQ Question
routerquestion.put('/:id', updateQuestion);

// DELETE: Delete an FAQ Question
routerquestion.delete('/:id', deleteQuestion);

export default routerquestion;
