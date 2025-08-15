import BrochureRequest from "../models/BrochureRequest.js";

// @desc    Create new brochure request
export const createBrochureRequest = async (req, res) => {
  try {
    const newRequest = await BrochureRequest.create(req.body);
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Get all brochure requests
export const getAllBrochureRequests = async (req, res) => {
  try {
    const requests = await BrochureRequest.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get single brochure request
export const getBrochureRequestById = async (req, res) => {
  try {
    const request = await BrochureRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Not Found" });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update brochure request
export const updateBrochureRequest = async (req, res) => {
  try {
    const updated = await BrochureRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Delete brochure request
export const deleteBrochureRequest = async (req, res) => {
  try {
    await BrochureRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
