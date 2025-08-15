// controllers/eventCategoryController.js
import EventCategory from '../models/EventCategory.js';

export const createEventCategory = async (req, res) => {
  try {
    const { name, slug, metaTitle, metaDescription, inSitemap, pageIndex, customCanonicalUrl } = req.body;
    
    const existingCategory = await EventCategory.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ error: "Category with this slug already exists" });
    }

    const eventCategory = new EventCategory({
      name,
      slug,
      metaTitle,
      metaDescription,
      inSitemap,
      pageIndex,
      customCanonicalUrl,
    });

    await eventCategory.save();
    res.status(201).json({ message: "Event category created successfully", eventCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllEventCategories = async (req, res) => {
  try {
    const eventCategories = await EventCategory.find();
    res.status(200).json(eventCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEventCategoryById = async (req, res) => {
  try {
    const eventCategory = await EventCategory.findById(req.params.id);
    if (!eventCategory) {
      return res.status(404).json({ error: "Event category not found" });
    }
    res.status(200).json(eventCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateEventCategory = async (req, res) => {
  try {
    const { name, slug, metaTitle, metaDescription, inSitemap, pageIndex, customCanonicalUrl } = req.body;

    const eventCategory = await EventCategory.findByIdAndUpdate(
      req.params.id,
      { name, slug, metaTitle, metaDescription, inSitemap, pageIndex, customCanonicalUrl },
      { new: true }
    );

    if (!eventCategory) {
      return res.status(404).json({ error: "Event category not found" });
    }

    res.status(200).json({ message: "Event category updated successfully", eventCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteEventCategory = async (req, res) => {
  try {
    const eventCategory = await EventCategory.findByIdAndDelete(req.params.id);
    if (!eventCategory) {
      return res.status(404).json({ error: "Event category not found" });
    }
    res.status(200).json({ message: "Event category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
