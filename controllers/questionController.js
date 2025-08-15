import Question from '../models/Question.js';
import FaqCategory from '../models/FaqCategory.js';
// Create a new FAQ Question
export const createQuestion = async (req, res) => {
  try {
    const { question, faqCategory, answer, status } = req.body;

    // Check if the category exists
    const categoryExists = await FaqCategory.findById(faqCategory);
    if (!categoryExists) return res.status(404).json({ message: 'FAQ Category not found' });

    const newQuestion = new Question({
      question,
      faqCategory,
      answer,
      status
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch all FAQ Questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('faqCategory', 'categoryName');
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch a single FAQ Question by ID
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('faqCategory', 'categoryName');
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an FAQ Question
export const updateQuestion = async (req, res) => {
  try {
    const { question, faqCategory, answer, status } = req.body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { question, faqCategory, answer, status },
      { new: true }
    ).populate('faqCategory', 'categoryName');

    if (!updatedQuestion) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an FAQ Question
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
