import News from '../models/News.js';

export const createNews = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const news = new News({ title, description, date });
    await news.save();
    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const news = await News.findByIdAndUpdate(req.params.id, { title, description, date }, { new: true });
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.status(200).json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
