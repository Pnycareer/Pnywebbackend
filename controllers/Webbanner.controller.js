import WebBanner from "../models/Webbanner.js";
import fs from "fs";
import path from "path";

// Upload Web Banner
export const uploadWebBanner = async (req, res) => {
  try {
    if (!req.files || !req.files.webbanner) {
      return res.status(400).json({ message: "No web banner uploaded!" });
    }

    const file = req.files.webbanner[0];
    const imageUrl = `/uploads/images/webbanner/${file.filename}`;

    // Save new banner
    const newBanner = new WebBanner({ imageUrl });
    await newBanner.save();

    res.status(201).json({
      message: "Web banner uploaded successfully!",
      banner: newBanner,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading web banner", error });
  }
};

// Get Active Web Banner
export const getActiveWebBanner = async (req, res) => {
  try {
    const banner = await WebBanner.find()
    if (!banner) {
      return res.status(404).json({ message: "No web banner found!" });
    }
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Error fetching web banner", error });
  }
};

// Delete Web Banner
export const deleteWebBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await WebBanner.findById(id);

    if (!banner) {
      return res.status(404).json({ message: "Web banner not found!" });
    }

    // Delete file from storage
    const imagePath = path.join(
      "uploads/images/webbanner",
      path.basename(banner.imageUrl)
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await WebBanner.findByIdAndDelete(id);
    res.status(200).json({ message: "Web banner deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting web banner", error });
  }
};


export const updateWebBanner = async (req, res) => {
  try {
    const { id } = req.params;

    // Find existing banner
    const existingBanner = await WebBanner.findById(id);
    if (!existingBanner) {
      return res.status(404).json({ message: "Web banner not found!" });
    }

    let imageUrl = existingBanner.imageUrl; // Keep old image if no new one is uploaded

    // If a new file is uploaded, replace the existing one
    if (req.files && req.files.webbanner) {
      const file = req.files.webbanner[0];
      imageUrl = `/uploads/images/webbanner/${file.filename}`;

      // Delete old file if it exists
      const oldImagePath = path.join("uploads/images/webbanner", path.basename(existingBanner.imageUrl));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update banner in database
    existingBanner.imageUrl = imageUrl;
    await existingBanner.save();

    res.status(200).json({ message: "Web banner updated successfully!", banner: existingBanner });
  } catch (error) {
    res.status(500).json({ message: "Error updating web banner", error });
  }
}
