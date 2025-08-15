// controllers/pageController.js
import Page from '../models/Privacypolicy.js';

// Create Page
export const createPage = async (req, res) => {
  try {
    const page = new Page(req.body);
    const savedPage = await page.save();
    res.status(201).json(savedPage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Pages
export const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find();
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Page
export const getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Page
export const updatePage = async (req, res) => {
  try {
    const updatedPage = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPage) return res.status(404).json({ error: 'Page not found' });
    res.json(updatedPage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Page
export const deletePage = async (req, res) => {
  try {
    const deleted = await Page.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Page not found' });
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
