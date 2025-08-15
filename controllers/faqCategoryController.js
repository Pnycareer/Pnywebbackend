import FaqCategory from '../models/FaqCategory.js';
import { uploadFiles } from '../multer/multerConfig.js';

// Create a new FAQ Category
export const createFaqCategory = async (req, res) => {
  uploadFiles(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    try {
      // Get file paths if files were uploaded
      const faqImage = req.files['faqImage'] ? req.files['faqImage'][0].path : null;

      // Extract other form fields from req.body
      const {
        categoryName,
        urlSlug,
        categoryDescription,
        metaTitle,
        metaDescription,
        inSitemap,
        indexPage,
        customCanonicalUrl
      } = req.body;

      // Prepare the category data with the uploaded image path and other fields
      const faqCategoryData = {
        categoryName,
        urlSlug,
        categoryDescription,
        metaTitle,
        metaDescription,
        inSitemap,
        indexPage,
        customCanonicalUrl,
        faqImage, // Add the image path here
      };

      // Create and save the FAQ category
      const faqCategory = new FaqCategory(faqCategoryData);
      await faqCategory.save();

      // Return the response
      res.status(201).json({
        message: 'FAQ Category created successfully',
        faqCategory
      });
    } catch (error) {
      // Handle server-side errors
      res.status(500).json({
        message: 'Internal server error: ' + error.message
      });
    }
  });
};


// Fetch all FAQ Categories
export const getAllFaqCategories = async (req, res) => {
  try {
    const faqCategories = await FaqCategory.find();
    res.status(200).json(faqCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch a single FAQ Category by ID
export const getFaqCategoryById = async (req, res) => {
  try {
    const faqCategory = await FaqCategory.findById(req.params.id);
    if (!faqCategory) return res.status(404).json({ message: 'FAQ Category not found' });
    res.status(200).json(faqCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an FAQ Category
export const updateFaqCategory = async (req, res) => {
  try {
    // Apply multer middleware to handle file upload
    uploadFiles(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      // Extract other form fields from req.body
      const { categoryName, urlSlug, categoryDescription, metaTitle, metaDescription, inSitemap, indexPage, customCanonicalUrl } = req.body;

      // If a new file is uploaded, get the file path
      const faqImage = req.file ? req.file.path : undefined;

      // Prepare the fields to be updated
      const updatedFields = {
        categoryName,
        urlSlug,
        categoryDescription,
        metaTitle,
        metaDescription,
        inSitemap,
        indexPage,
        customCanonicalUrl
      };

      // If a new image is uploaded, include it in the update
      if (faqImage) updatedFields.faqImage = faqImage;

      // Update the FAQ category by its ID
      const faqCategory = await FaqCategory.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

      // If the category is not found, return a 404 error
      if (!faqCategory) return res.status(404).json({ message: 'FAQ Category not found' });

      res.status(200).json(faqCategory);  // Respond with the updated category
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an FAQ Category
export const deleteFaqCategory = async (req, res) => {
  try {
    const faqCategory = await FaqCategory.findByIdAndDelete(req.params.id);
    if (!faqCategory) return res.status(404).json({ message: 'FAQ Category not found' });
    res.status(200).json({ message: 'FAQ Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
