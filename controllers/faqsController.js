// controllers/faqController.js
import Faq from "../models/Faqs.js";
import fs from 'fs';
import path from 'path';

export const createFaqCategory = async (req, res) => {
  try {
    let category = req.body.category;
    let faqs = req.body.faqs;

    // Parse stringified form-data
    if (typeof category === "string") category = JSON.parse(category);
    if (typeof faqs === "string") faqs = JSON.parse(faqs);

    if (!category || !category.name) {
      return res.status(400).json({ error: "Category name is required." });
    }

    // Handle file if uploaded
    if (req.files?.faqImage?.[0]) {
      category.category_image = req.files.faqImage[0].path;
    }

    // Check for existing category
    const existing = await Faq.findOne({ "category.name": category.name });

    if (existing) {
      existing.faqs.push(...faqs);
      const updated = await existing.save();
      return res.status(200).json(updated);
    }

    const newFaq = new Faq({ category, faqs });
    const saved = await newFaq.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllFaqs = async (req, res) => {
  try {
    const data = await Faq.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFaqById = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ error: "Not found" });
    res.json(faq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateFaqCategory = async (req, res) => {
  try {
    let category = req.body.category;
    let faqs = req.body.faqs;

    if (typeof category === "string") category = JSON.parse(category);
    if (typeof faqs === "string") faqs = JSON.parse(faqs);

    const existing = await Faq.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });

    // If a new image is uploaded, delete the old one
    if (req.files?.faqImage?.[0]) {
      // Delete old image if exists
      if (existing.category.category_image) {
        const oldImagePath = path.resolve(existing.category.category_image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Failed to delete old image:', err);
        });
      }

      category.category_image = req.files.faqImage[0].path;
    } else {
      category.category_image = existing.category.category_image;
    }

    existing.category.name = category.name;
    existing.category.category_image = category.category_image;
    existing.faqs = faqs;

    const updated = await existing.save();

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};



export const deleteFaqCategory = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ error: "Not found" });

    // Delete the image from disk if exists
    if (faq.category.category_image) {
      const imagePath = path.resolve(faq.category.category_image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image:", err.message);
        }
      });
    }

    await faq.deleteOne(); // Or use `await Faq.findByIdAndDelete(req.params.id);`

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
