import CategoryWithEflyers from '../models/EFlyer.js';
import fs from 'fs';
import path from 'path';

export const createEFlyer = async (req, res) => {
  try {
    const { name } = req.body;
    let eflyers = [];

    if (req.body.eflyers) {
      eflyers = JSON.parse(req.body.eflyers);
    }

    const flyerImage = req.files?.flyerFile ? req.files.flyerFile[0].path : "";
    const flyerBrochure = req.files?.Brochure ? req.files.Brochure[0].path : "";

    // Update eflyers to add brochure URL
    if (eflyers.length > 0) {
      eflyers = eflyers.map(flyer => ({
        ...flyer,
        brochureUrl: flyerBrochure || "", // use uploaded brochure path
      }));
    }

    // First, check if category with same name exists
    const existingCategory = await CategoryWithEflyers.findOne({ name });

    if (existingCategory) {
      // If category exists, push new flyers into existing category
      existingCategory.eflyers.push(...eflyers);

      // If you want to update the image if a new one uploaded
      if (flyerImage) {
        existingCategory.imageUrl = flyerImage;
      }

      const updatedCategory = await existingCategory.save();
      res.status(200).json(updatedCategory);

    } else {
      // If no category exists, create a new one
      const newCategory = new CategoryWithEflyers({
        name,
        imageUrl: flyerImage,
        eflyers
      });

      const savedCategory = await newCategory.save();
      res.status(201).json(savedCategory);
    }

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};



// Get all Categories with their Eflyers
export const getAllEFlyers = async (req, res) => {
  try {
      const categories = await CategoryWithEflyers.find();
      res.status(200).json(categories);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};



export const deleteEFlyer = async (req, res) => {
  try {
    const { id } = req.params;

    // Find all categories to locate the flyer
    const categories = await CategoryWithEflyers.find();

    let updated = false;

    for (let category of categories) {
      const flyerIndex = category.eflyers.findIndex(
        (flyer) => flyer._id.toString() === id
      );

      if (flyerIndex !== -1) {
        const flyer = category.eflyers[flyerIndex];

        // ✅ Only delete brochure file
        if (flyer.brochureUrl) {
          const brochurePath = path.resolve(flyer.brochureUrl);
          if (fs.existsSync(brochurePath)) {
            fs.unlinkSync(brochurePath);
          }
        }

        // Remove eflyer from the category
        category.eflyers.splice(flyerIndex, 1);
        await category.save();
        updated = true;
        break;
      }
    }

    if (!updated) {
      return res.status(404).json({ message: "Eflyer not found" });
    }

    res.status(200).json({ message: "Eflyer and associated brochure deleted successfully" });

  } catch (error) {
    console.error("Delete Eflyer Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a single Category by ID
export const getEFlyerById = async (req, res) => {
  try {
    const { id } = req.params;

    const categories = await CategoryWithEflyers.find();

    for (let category of categories) {
      const eflyer = category.eflyers.find((f) => f._id.toString() === id);
      if (eflyer) {
        return res.status(200).json({ eflyer });
      }
    }

    res.status(404).json({ message: "Eflyer not found" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


export const updateEFlyer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Handle new brochure upload
    const newBrochure = req.files?.Brochure?.[0]?.path;

    const categories = await CategoryWithEflyers.find();

    for (let category of categories) {
      const flyerIndex = category.eflyers.findIndex((f) => f._id.toString() === id);

      if (flyerIndex !== -1) {
        const oldFlyer = category.eflyers[flyerIndex];

        // 🔥 Delete old brochure if new one is uploaded
        if (newBrochure && oldFlyer.brochureUrl) {
          const oldPath = path.resolve(oldFlyer.brochureUrl);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }

        // 🔁 Update fields
        const updatedFlyer = {
          ...oldFlyer.toObject(),
          ...updatedData,
          brochureUrl: newBrochure || oldFlyer.brochureUrl,
        };

        // 🧠 Replace the flyer
        category.eflyers[flyerIndex] = updatedFlyer;
        await category.save();

        return res.status(200).json({ message: "Eflyer updated successfully", eflyer: updatedFlyer });
      }
    }

    res.status(404).json({ message: "Eflyer not found" });

  } catch (error) {
    console.error("Update Eflyer Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


