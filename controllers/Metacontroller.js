import Meta from "../models/Meta.js";

// @desc Add meta information
// @route POST /api/metas
// @access Public
export const addMeta = async (req, res) => {
    try {
      const { meta_title, meta_description, meta_keywords } = req.body;
  
      const newMeta = new Meta({
        meta_title,
        meta_description,
        meta_keywords,
      });
  
      await newMeta.save();
  
      res.status(201).json({
        metas: [
          {
            id: newMeta._id.toString(),
            meta_title: newMeta.meta_title,
            meta_description: newMeta.meta_description,
            meta_keywords: newMeta.meta_keywords || "",
          },
        ],
      });
    } catch (error) {
      res.status(500).json({ message: "Error adding meta data", error: error.message });
    }
  };

// @desc Get all meta information
// @route GET /api/metas
// @access Public
export const getMetas = async (req, res) => {
    try {
      const metas = await Meta.find();
  
      res.status(200).json({
        metas: metas.map(meta => ({
          id: meta._id.toString(), // Convert ObjectId to string
          meta_title: meta.meta_title,
          meta_description: meta.meta_description,
          meta_keywords: meta.meta_keywords || "", // Ensure empty string if null
        })),
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching meta data", error: error.message });
    }
  }
