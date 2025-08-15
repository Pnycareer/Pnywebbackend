import Gallery from "../models/Gallery.js";
import fs from "fs";
import path from "path";

// Create new gallery
export const createGallery = async (req, res) => {
  try {
    const { category_Name, category_Description } = req.body;

    // Get uploaded files
    const files = req.files?.galleryImages || [];
    const newPictures = files.map((file) => file.path.replace(/\\/g, "/")); // clean windows paths

    // Check if the category already exists
    let existingGallery = await Gallery.findOne({
      category_Name: category_Name,
    });

    if (existingGallery) {
      // If gallery exists, update it by pushing new images
      existingGallery.pictures.push(...newPictures);

      // Optional: you can also update description if you want
      if (category_Description) {
        existingGallery.category_Description = category_Description;
      }

      const updatedGallery = await existingGallery.save();
      res
        .status(200)
        .json({
          message: "Gallery updated with new images",
          gallery: updatedGallery,
        });
    } else {
      // If no existing gallery, create new
      const newGallery = new Gallery({
        category_Name,
        category_Description,
        pictures: newPictures,
      });

      const savedGallery = await newGallery.save();
      res
        .status(201)
        .json({ message: "New gallery created", gallery: savedGallery });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error while creating or updating gallery" });
  }
};

// Get all galleries
export const getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find();
    res.status(200).json(galleries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error while getting galleries" });
  }
};

// Get single gallery by ID
export const getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    res.status(200).json(gallery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error while getting gallery" });
  }
};

// Update gallery
export const updateGallery = async (req, res) => {
  try {
    const { category_Name, category_Description } = req.body;

    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    const files = req.files?.galleryImages || [];
    const newPictures = files.map((file) => file.path.replace(/\\/g, "/"));

    // If new images uploaded, delete old ones
    if (newPictures.length > 0) {
      gallery.pictures.forEach((oldImagePath) => {
        const fullPath = path.resolve(oldImagePath);
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error(`Failed to delete old image: ${fullPath}`, err);
          }
        });
      });

      gallery.pictures = newPictures; // Replace with new images
    }

    gallery.category_Name = category_Name || gallery.category_Name;
    gallery.category_Description =
      category_Description || gallery.category_Description;

    const updatedGallery = await gallery.save();
    res.status(200).json(updatedGallery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error while updating gallery" });
  }
};

// Delete gallery
export const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    // Delete all gallery pictures from storage
    gallery.pictures.forEach((imagePath) => {
      const fullPath = path.resolve(imagePath);
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error(`Failed to delete image: ${fullPath}`, err);
        }
      });
    });

    await gallery.deleteOne();
    res.status(200).json({ message: "Gallery deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error while deleting gallery" });
  }
};

export const deleteGalleryImage = async (req, res) => {
  try {
    const { galleryId } = req.params;
    const { imagePath } = req.body; // 👈 Pass image path from body

    console.log(imagePath);

    const gallery = await Gallery.findById(galleryId);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    // Check if image exists in pictures array
    if (!gallery.pictures.includes(imagePath)) {
      return res.status(400).json({ message: "Image not found in gallery" });
    }

    // Delete file from server
    const fullPath = path.resolve(imagePath);
    fs.unlink(fullPath, (err) => {
      if (err && err.code !== "ENOENT") {
        console.error("Error deleting image file:", err);
      }
    });

    // Remove imagePath from pictures array
    gallery.pictures = gallery.pictures.filter(
      (picture) => picture !== imagePath
    );
    const updatedGallery = await gallery.save();

    res
      .status(200)
      .json({ message: "Image deleted successfully", gallery: updatedGallery });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server Error while deleting gallery image" });
  }
};
