import GalleryCategory from '../models/GalleryCategory.js';
import { uploadFiles } from '../multer/multerConfig.js';

// Create a new Gallery Category
export const createGalleryCategory = (req, res) => {
  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    try {
      const { galleryTitle, isViewOnWeb, note } = req.body;
      const coverImage = req.files['coverImage'] ? req.files['coverImage'][0].path : null;

      const galleryCategory = new GalleryCategory({
        galleryTitle,
        isViewOnWeb,
        coverImage,
        note,
      });

      await galleryCategory.save();
      res.status(201).json({
        message: 'Gallery Category created successfully',
        galleryCategory
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Fetch all Gallery Categories
export const getAllGalleryCategories = async (req, res) => {
  try {
    const galleryCategories = await GalleryCategory.find();
    res.status(200).json(galleryCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch a single Gallery Category by ID
export const getGalleryCategoryById = async (req, res) => {
  try {
    const galleryCategory = await GalleryCategory.findById(req.params.id);
    if (!galleryCategory) return res.status(404).json({ message: 'Gallery Category not found' });
    res.status(200).json(galleryCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Gallery Category
export const updateGalleryCategory = (req, res) => {
  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { galleryTitle, isViewOnWeb, note } = req.body;
      
      // Debugging: Check the contents of req.files
      console.log("Uploaded files:", req.files);

      // Check for the 'coverImage' file in req.files
      const coverImage = req.files && req.files['coverImage'] ? req.files['coverImage'][0].path : undefined;

      // Prepare updated fields
      const updatedFields = {
        galleryTitle,
        isViewOnWeb,
        note,
      };

      // Only include coverImage if it was uploaded
      if (coverImage) updatedFields.coverImage = coverImage;

      const galleryCategory = await GalleryCategory.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
      if (!galleryCategory) return res.status(404).json({ message: 'Gallery Category not found' });

      res.status(200).json({
        message: 'Gallery Category updated successfully',
        galleryCategory
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};


// Delete a Gallery Category
export const deleteGalleryCategory = async (req, res) => {
  try {
    const galleryCategory = await GalleryCategory.findByIdAndDelete(req.params.id);
    if (!galleryCategory) return res.status(404).json({ message: 'Gallery Category not found' });
    res.status(200).json({ message: 'Gallery Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
