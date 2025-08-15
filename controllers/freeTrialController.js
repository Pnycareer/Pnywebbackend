import FreeTrial from '../models/FreeTrial.js';

// Get all free trials
export const getFreeTrials = async (req, res) => {
  try {
    const freeTrials = await FreeTrial.find();
    res.status(200).json(freeTrials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching free trials', error });
  }
};

// Get a single free trial by ID
export const getFreeTrialById = async (req, res) => {
  try {
    const freeTrial = await FreeTrial.findById(req.params.id);
    if (!freeTrial) return res.status(404).json({ message: 'Free trial not found' });
    res.status(200).json(freeTrial);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching free trial', error });
  }
};

// Create a new free trial
export const createFreeTrial = async (req, res) => {
  try {
    const { name, phone, email, course, city, type, dateTime } = req.body;
    const newFreeTrial = new FreeTrial({ name, phone, email, course, city, type, dateTime });
    await newFreeTrial.save();
    res.status(201).json(newFreeTrial);
  } catch (error) {
    res.status(400).json({ message: 'Error creating free trial', error });
  }
};

// Update an existing free trial
export const updateFreeTrial = async (req, res) => {
  try {
    const { name, phone, email, course, city, type, dateTime } = req.body;
    const updatedFreeTrial = await FreeTrial.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, course, city, type, dateTime },
      { new: true }
    );
    if (!updatedFreeTrial) return res.status(404).json({ message: 'Free trial not found' });
    res.status(200).json(updatedFreeTrial);
  } catch (error) {
    res.status(400).json({ message: 'Error updating free trial', error });
  }
};

// Delete a free trial
export const deleteFreeTrial = async (req, res) => {
  try {
    const deletedFreeTrial = await FreeTrial.findByIdAndDelete(req.params.id);
    if (!deletedFreeTrial) return res.status(404).json({ message: 'Free trial not found' });
    res.status(200).json({ message: 'Free trial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting free trial', error });
  }
};
