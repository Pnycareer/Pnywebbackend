import TrainerCertification from "../models/trainerCertification.js";

// GET certification content
export const getCertification = async (req, res) => {
  try {
    const data = await TrainerCertification.findOne(); // single doc
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST new content
export const createCertification = async (req, res) => {
  try {
    const newData = new TrainerCertification(req.body);
    const saved = await newData.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE existing content
export const updateCertification = async (req, res) => {
  try {
    const updated = await TrainerCertification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE content
export const deleteCertification = async (req, res) => {
  try {
    await TrainerCertification.findByIdAndDelete(req.params.id);
    res.json({ message: "Certification content deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
