import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import slugify from "slugify";
import AcademiaCourse from "../models/AcademiaCourse.js";

// helpers
const isObjectId = (v) => mongoose.isValidObjectId(v);
const cleanSlug = (s) =>
  slugify(String(s || ""), { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });

const pickUp = (req) => {
  const imagePath = req.files?.course_Image?.[0]?.path || null;
  const brochurePath = req.files?.Brochure?.[0]?.path || null;
  return { imagePath, brochurePath };
};

const maybeUnlink = (filepath) => {
  if (!filepath) return;
  fs.promises
    .stat(filepath)
    .then(() => fs.promises.unlink(filepath))
    .catch(() => {}); // swallow if file missing
};

/** ---- NEW: parsing utils for flexible inbound payloads ---- */
const ensureArray = (val) => {
  if (val == null) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    // try JSON first
    const s = val.trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try { return JSON.parse(s); } catch (_) {}
    }
    // fallback: CSV
    return s.split(",").map((x) => x.trim()).filter(Boolean);
  }
  return [val];
};

const parseSubjects = (raw) => {
  const arr = ensureArray(raw)
    .map((x) => String(x).trim().toLowerCase())
    .filter(Boolean);
  // de-dup
  return Array.from(new Set(arr));
};

const parseFaqs = (raw) => {
  const arr = ensureArray(raw).map((item) => {
    if (typeof item === "string") {
      try { item = JSON.parse(item); } catch (_) {}
    }
    return {
      question: String(item?.question || "").trim(),
      answer: String(item?.answer || "").trim(),
    };
  }).filter((f) => f.question && f.answer);

  // de-dup by question (case-insensitive)
  const seen = new Set();
  const out = [];
  for (const f of arr) {
    const key = f.question.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(f);
    }
  }
  return out;
};
/** ---- /parsers ---- */

// CREATE
export const createCourse = async (req, res) => {
  try {
    const body = req.body || {};
    const { imagePath, brochurePath } = pickUp(req);

    const slug = body.slug ? cleanSlug(body.slug) : cleanSlug(body.coursename);
    if (!slug) return res.status(400).json({ message: "slug or coursename required" });

    const exists = await AcademiaCourse.findOne({ slug });
    if (exists) return res.status(409).json({ message: "Slug already exists" });

    // NEW: parse subjects + faqs (optional)
    const subjects = parseSubjects(body.subjects);
    const faqs = parseFaqs(body.faqs ?? body["faqs[]"]); // handle `faqs[]` from form-data

    const doc = await AcademiaCourse.create({
      coursename: body.coursename,
      slug,
      coursecategory: body.coursecategory,
      Course_Description: body.Course_Description,
      Instructor: body.Instructor,
      Brochure: brochurePath || body.Brochure || undefined,
      status: body.status || undefined,
      viewOnWeb: body.viewOnWeb !== undefined ? body.viewOnWeb === "true" || body.viewOnWeb === true : undefined,
      priority: body.priority !== undefined ? Number(body.priority) : undefined,
      In_Sitemap: body.In_Sitemap !== undefined ? body.In_Sitemap === "true" || body.In_Sitemap === true : undefined,
      Page_Index: body.Page_Index !== undefined ? body.Page_Index === "true" || body.Page_Index === true : undefined,
      course_Image: imagePath || body.course_Image || undefined,
      course_Image_Alt: body.course_Image_Alt,
      Short_Description: body.Short_Description,
      Meta_Title: body.Meta_Title,
      Meta_Description: body.Meta_Description,

      // NEW fields
      subjects: subjects.length ? subjects : undefined,
      faqs: faqs.length ? faqs : undefined,
    });

    return res.status(201).json({ message: "Created", data: doc });
  } catch (err) {
    return res.status(500).json({ message: "Create failed", error: err.message });
  }
};

// LIST (with filters + pagination + search)
export const getCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      subject,   // NEW: optional filter ?subject=physics
      q,
      onweb, // ?onweb=true
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.coursecategory = category;
    if (subject) filter.subjects = String(subject).toLowerCase().trim(); // exact match in array
    if (onweb !== undefined) filter.viewOnWeb = onweb === "true";
    if (q) {
      const re = new RegExp(q, "i");
      filter.$or = [
        { coursename: re },
        { slug: re },
        { Short_Description: re },
        { Course_Description: re },
        { Meta_Title: re },
        { Meta_Description: re },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      AcademiaCourse.find(filter)
        .populate("Instructor")
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      AcademiaCourse.countDocuments(filter),
    ]);

    return res.json({
      data: items,
      meta: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit) || 1),
        limit: Number(limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

// READ by id or slug
export const getCourse = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const query = isObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
    const doc = await AcademiaCourse.findOne(query).populate("Instructor");
    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json({ data: doc });
  } catch (err) {
    return res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

// UPDATE (replaces files if new ones uploaded)
export const updateCourse = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const query = isObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
    const doc = await AcademiaCourse.findOne(query);
    if (!doc) return res.status(404).json({ message: "Not found" });

    const body = req.body || {};
    const { imagePath, brochurePath } = pickUp(req);

    // if slug is provided or coursename changes, re-slugify (and ensure uniqueness)
    if (body.slug || body.coursename) {
      const nextSlug = cleanSlug(body.slug || body.coursename || doc.coursename);
      if (nextSlug !== doc.slug) {
        const exists = await AcademiaCourse.findOne({ slug: nextSlug, _id: { $ne: doc._id } });
        if (exists) return res.status(409).json({ message: "Slug already exists" });
        doc.slug = nextSlug;
      }
    }

    // overwrite scalars
    [
      "coursename",
      "coursecategory",
      "Course_Description",
      "Instructor",
      "status",
      "course_Image_Alt",
      "Short_Description",
      "Meta_Title",
      "Meta_Description",
    ].forEach((k) => {
      if (body[k] !== undefined) doc[k] = body[k];
    });

    if (body.viewOnWeb !== undefined) doc.viewOnWeb = body.viewOnWeb === "true" || body.viewOnWeb === true;
    if (body.In_Sitemap !== undefined) doc.In_Sitemap = body.In_Sitemap === "true" || body.In_Sitemap === true;
    if (body.Page_Index !== undefined) doc.Page_Index = body.Page_Index === "true" || body.Page_Index === true;
    if (body.priority !== undefined) doc.priority = Number(body.priority);

    // NEW: subjects/faqs updates (full replace if provided)
    if (body.subjects !== undefined) {
      const subjects = parseSubjects(body.subjects);
      doc.subjects = subjects;
    }
    if (body.faqs !== undefined || body["faqs[]"] !== undefined) {
      const faqs = parseFaqs(body.faqs ?? body["faqs[]"]);
      doc.faqs = faqs;
    }

    // file replacements
    if (imagePath) {
      maybeUnlink(doc.course_Image);
      doc.course_Image = imagePath;
    }
    if (brochurePath) {
      maybeUnlink(doc.Brochure);
      doc.Brochure = brochurePath;
    }

    await doc.save();
    return res.json({ message: "Updated", data: doc });
  } catch (err) {
    return res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// DELETE (hard delete)
export const deleteCourse = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const query = isObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
    const doc = await AcademiaCourse.findOne(query);
    if (!doc) return res.status(404).json({ message: "Not found" });

    // remove files if present
    maybeUnlink(doc.course_Image);
    maybeUnlink(doc.Brochure);

    await doc.deleteOne();
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
