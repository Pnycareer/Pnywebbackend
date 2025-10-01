import { Application } from "../models/Application.js";

function isEmail(x) {
  return typeof x === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
}

export async function createApplication(req, res) {
  try {
    const {
      name,
      email,
      contact,
      courseId,
      course_Name,
      url_Slug,
      discountPercent
    } = req.body || {};

    // validation
    if (!name || name.trim().length < 2) return res.status(400).json({ message: "Name is required." });
    if (!email || !isEmail(email)) return res.status(400).json({ message: "Valid email is required." });
    if (!contact) return res.status(400).json({ message: "Contact is required." });
    if (!courseId || !course_Name) return res.status(400).json({ message: "Course selection is required." });

    const pct = Number(discountPercent);
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
      return res.status(400).json({ message: "discountPercent must be 0–100." });
    }

    const emailNorm = email.trim().toLowerCase();
    const courseIdNorm = String(courseId);

    // 🔍 Soft guard before writing
    const exists = await Application.findOne({ email: emailNorm, courseId: courseIdNorm }).lean();
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "You already availed a discount on this course",
      });
    }

    // Create
    const doc = await Application.create({
      name: name.trim(),
      email: emailNorm,
      contact: String(contact).trim(),
      courseId: courseIdNorm,
      course_Name: String(course_Name),
      url_Slug: url_Slug ? String(url_Slug) : "",
      discountPercent: pct
    });

    return res.status(201).json({
      success: true,
      data: {
        _id: doc._id,
        name: doc.name,
        email: doc.email,
        contact: doc.contact,
        courseId: doc.courseId,
        course_Name: doc.course_Name,
        url_Slug: doc.url_Slug,
        discountPercent: doc.discountPercent,
        status: doc.status,
        createdAt: doc.createdAt
      }
    });
  } catch (err) {
    // 🧱 Hard guard: unique index dup
    if (err && err.code === 11000 && err.keyPattern?.email && err.keyPattern?.courseId) {
      return res.status(409).json({
        success: false,
        message: "You already availed a discount on this course with this email.",
      });
    }

    console.error("createApplication error:", err);
    return res.status(500).json({ message: "Server error creating application." });
  }
}
