import Enrollment from "../models/LandingModel.js";

// POST /api/enrollments
export const createEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.create(req.body);
    res.status(201).json(enrollment);
  } catch (err) {
    console.error("Create enrollment error:", err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
};

// GET /api/enrollments
export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (err) {
    console.error("Get enrollments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/enrollments/:id
export const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.json(enrollment);
  } catch (err) {
    console.error("Get enrollment by id error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/enrollments/:id
export const updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json(enrollment);
  } catch (err) {
    console.error("Update enrollment error:", err);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
};

// DELETE /api/enrollments/:id
export const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json({ message: "Enrollment deleted successfully" });
  } catch (err) {
    console.error("Delete enrollment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
