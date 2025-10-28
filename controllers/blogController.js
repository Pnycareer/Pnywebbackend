import BlogCategory from "../models/Blogs.js";
import fs from "fs";
import path from "path";

// Safe file deletion function

export const deleteFile = (filePath) => {
  if (!filePath || typeof filePath !== "string") {
    console.warn("No valid file path provided, skipping delete:", filePath);
    return;
  }

  const resolvedPath = path.resolve(filePath); // << resolve here!

  fs.access(resolvedPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.warn("File not found, skipping delete:", resolvedPath);
    } else {
      fs.unlink(resolvedPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(
            "Failed to delete file:",
            resolvedPath,
            unlinkErr.message
          );
        } else {
          console.log("Deleted file:", resolvedPath);
        }
      });
    }
  });
};

// Create Blog
export const createBlog = async (req, res) => {
  try {
    const {
      blogName,
      shortDescription,
      blogCategory,
      blogDescription,
      publishDate,
      authorName,
      authorBio,
      tags,
      metaTitle,
      metaDescription,
      url_slug,
      pageindex,
      insitemap,
      inviewweb,
      blogImageAlt,
    } = req.body;

    const blogImage = req.files?.blogImage ? req.files.blogImage[0].path : null;
    const authorProfileImage = req.files?.authorProfileImage
      ? req.files.authorProfileImage[0].path
      : null;

    // 🔍 Check for duplicate slug across all categories
    const isDuplicate = await BlogCategory.findOne({
      "blogs.url_slug": url_slug,
    });

    if (isDuplicate) {
      return res.status(400).json({
        message: "A blog with this URL slug already exists.",
      });
    }

    const newBlog = {
      blogName,
      url_slug,
      shortDescription,
      blogDescription,
      publishDate,
      blogImage,
      blogImageAlt,
      metaTitle,
      metaDescription,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      author: {
        name: authorName,
        bio: authorBio,
        profileImage: authorProfileImage,
      },
      pageindex: pageindex || 0,
      insitemap: insitemap !== undefined ? insitemap : true,
      inviewweb: inviewweb !== undefined ? inviewweb : true,
      showtoc: req.body.showtoc !== undefined ? req.body.showtoc : true,
    };

    // 🏷️ Handle category
    let category = await BlogCategory.findOne({ blogCategory });

    if (category) {
      category.blogs.push(newBlog);
    } else {
      category = new BlogCategory({
        blogCategory,
        blogs: [newBlog],
      });
    }

    await category.save();
    res.status(201).json({ message: "Blog created successfully", category });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create blog", error: error.message });
  }
};

// Get All Blogs
// export const getAllBlogs = async (req, res) => {
//   try {
//     const blogs = await BlogCategory.find();
//     res.status(200).json(blogs);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ message: "Failed to fetch blogs", error: error.message });
//   }
// };

export const getAllBlogs = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "12", 10), 1), 60); // hard cap
    const category = req.query.category && req.query.category !== "all" ? req.query.category : null;
    const q = (req.query.q || "").trim();
    const onlyInView = req.query.inviewweb === "true";

    const match = {};
    if (category) match.blogCategory = category;

    // Unwind nested blogs inside BlogCategory
    const pipeline = [
      { $match: match },
      { $unwind: "$blogs" },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$blogs",
              { category: "$blogCategory" }
            ]
          }
        }
      },
    ];

    // Visibility filter
    if (onlyInView) pipeline.push({ $match: { inviewweb: true } });

    // Search by name/desc/slug (basic)
    if (q) {
      pipeline.push({
        $match: {
          $or: [
            { blogName: { $regex: q, $options: "i" } },
            { shortDescription: { $regex: q, $options: "i" } },
            { url_slug: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } },
          ],
        },
      });
    }

    // Sort newest first
    pipeline.push({ $sort: { publishDate: -1, _id: -1 } });

    // Count+paginate
    pipeline.push({
      $facet: {
        items: [
          { $project: {
              _id: 1,
              blogName: 1,
              shortDescription: 1,
              blogImage: 1,
              blogImageAlt: 1,
              publishDate: 1,
              url_slug: 1,
              inviewweb: 1,
              category: 1,
          }},
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ],
        total: [{ $count: "count" }],
      },
    });

    // Fetch list of categories separately (lightweight)
    const categoriesPromise = BlogCategory.find({}, { blogCategory: 1, _id: 0 }).lean();

    const [result] = await BlogCategory.aggregate(pipeline);
    const categoriesDocs = await categoriesPromise;

    const total = result?.total?.[0]?.count || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    res.set("Cache-Control", "public, max-age=30, s-maxage=60"); // let Next cache a bit
    return res.status(200).json({
      items: result.items,
      pagination: { page, limit, total, totalPages },
      categories: ["all", ...new Set(categoriesDocs.map(c => c.blogCategory))],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch blogs", error: error.message });
  }
};

// export const getBlogById = async (req, res) => {
//   try {
//     const categories = await BlogCategory.find();

//     let foundBlog = null;
//     let parentCategory = null;

//     // Loop to find blog + its parent category
//     for (const category of categories) {
//       const blog = category.blogs.id(req.params.id);
//       if (blog) {
//         foundBlog = blog;
//         parentCategory = category.blogCategory; // Grab the category name
//         break;
//       }
//     }

//     if (!foundBlog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     // Build full blog response with parent category injected
//     res.status(200).json({
//       _id: foundBlog._id,
//       blogName: foundBlog.blogName,
//       url_slug: foundBlog.url_slug,
//       shortDescription: foundBlog.shortDescription,
//       blogDescription: foundBlog.blogDescription,
//       publishDate: foundBlog.publishDate,
//       blogImage: foundBlog.blogImage,
//       author: foundBlog.author,
//       tags: foundBlog.tags,
//       metaTitle: foundBlog.metaTitle,
//       metaDescription: foundBlog.metaDescription,
//       pageindex: foundBlog.pageindex,
//       insitemap: foundBlog.insitemap,
//       canonical: foundBlog.canonical,
//       inviewweb: foundBlog.inviewweb,
//       socialLinks: foundBlog.socialLinks,
//       showtoc:foundBlog.showtoc,
//       blogCategory: parentCategory, // ✅ Injected so frontend can show the correct dropdown value
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Failed to fetch blog",
//       error: error.message,
//     });
//   }
// };

export const getBlogById = async (req, res) => {
  try {
    const categories = await BlogCategory.find();

    let foundBlog = null;
    let parentCategory = null;

    // Loop to find blog + its parent category
    for (const category of categories) {
      const blog = category.blogs.id(req.params.id);
      if (blog) {
        foundBlog = blog;
        parentCategory = category.blogCategory;
        break;
      }
    }

    if (!foundBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Convert subdocument to plain JS object so we can safely spread it
    const blogData = foundBlog.toObject();

    res.status(200).json({
      ...blogData,
      blogCategory: parentCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const categories = await BlogCategory.find();
    let blogToUpdate = null;
    let originalCategory = null;

    // 1. Find the blog and the category it's currently in
    for (const category of categories) {
      const blog = category.blogs.id(req.params.id);
      if (blog) {
        blogToUpdate = blog;
        originalCategory = category;
        break;
      }
    }

    if (!blogToUpdate || !originalCategory) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 2. Handle image replacements
    if (req.files?.blogImage?.[0]?.path) {
      if (blogToUpdate.blogImage) {
        deleteFile(path.resolve(blogToUpdate.blogImage));
      }
      blogToUpdate.blogImage = req.files.blogImage[0].path;
    }

    if (req.files?.authorProfileImage?.[0]?.path) {
      if (blogToUpdate.author?.profileImage) {
        deleteFile(path.resolve(blogToUpdate.author.profileImage));
      }
      blogToUpdate.author.profileImage = req.files.authorProfileImage[0].path;
    }

    // 3. Update fields
    const {
      blogName,
      shortDescription,
      blogDescription,
      publishDate,
      authorName,
      authorBio,
      tags,
      metaTitle,
      metaDescription,
      url_slug,
      pageindex,
      insitemap,
      canonical,
      inviewweb,
      showtoc, 
      newCategory, 
      blogImageAlt,
    } = req.body;

    blogToUpdate.blogName = blogName || blogToUpdate.blogName;
    blogToUpdate.url_slug = url_slug || blogToUpdate.url_slug;
    blogToUpdate.shortDescription =
      shortDescription || blogToUpdate.shortDescription;
    blogToUpdate.blogDescription =
      blogDescription || blogToUpdate.blogDescription;
    blogToUpdate.publishDate = publishDate || blogToUpdate.publishDate;
    blogToUpdate.metaTitle = metaTitle || blogToUpdate.metaTitle;
    blogToUpdate.metaDescription =
      metaDescription || blogToUpdate.metaDescription;
    blogToUpdate.author.name = authorName || blogToUpdate.author.name;
    blogToUpdate.author.bio = authorBio || blogToUpdate.author.bio;
    blogToUpdate.tags = tags
      ? tags.split(",").map((tag) => tag.trim())
      : blogToUpdate.tags;
    blogToUpdate.pageindex =
      pageindex !== undefined ? pageindex : blogToUpdate.pageindex;
    blogToUpdate.insitemap =
      insitemap !== undefined ? insitemap : blogToUpdate.insitemap;
    blogToUpdate.canonical = canonical || blogToUpdate.canonical;
    blogToUpdate.inviewweb =
      inviewweb !== undefined ? inviewweb : blogToUpdate.inviewweb;
    blogToUpdate.showtoc =
      showtoc !== undefined ? showtoc : blogToUpdate.showtoc;
 if (blogImageAlt !== undefined) {
  const trimmed = String(blogImageAlt).trim();
   blogToUpdate.blogImageAlt =
      trimmed || `${blogToUpdate.blogName || "Blog"} image`;}
    // 4. Handle category change
    if (newCategory && newCategory !== originalCategory.blogCategory) {
      // Remove blog from old category
      originalCategory.blogs.pull({ _id: req.params.id });
      await originalCategory.save();

      // Add blog to new category
      const targetCategory = await BlogCategory.findOne({
        blogCategory: newCategory,
      });
      if (!targetCategory) {
        return res.status(404).json({ message: "New blog category not found" });
      }

      targetCategory.blogs.push(blogToUpdate);
      await targetCategory.save();

      return res.status(200).json({
        message: "Blog updated and moved to new category successfully",
      });
    } else {
      // No category change
      await originalCategory.save();
      return res.status(200).json({ message: "Blog updated successfully" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update blog", error: error.message });
  }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const categories = await BlogCategory.find();
    let deleted = false;

    for (const category of categories) {
      const blog = category.blogs.id(req.params.id);
      if (blog) {
        // Delete associated files safely
        deleteFile(blog.blogImage);
        deleteFile(blog.author?.profileImage);

        blog.deleteOne();
        await category.save();
        deleted = true;
        break;
      }
    }

    if (!deleted) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete blog", error: error.message });
  }
};

// Get Single Blog by Slug
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const categories = await BlogCategory.find();

    let foundBlog = null;
    categories.forEach((category) => {
      const blog = category.blogs.find((b) => b.url_slug === slug);
      if (blog) foundBlog = blog;
    });

    if (!foundBlog) {
      return res
        .status(404)
        .json({ message: "Blog not found with the given slug" });
    }

    res.status(200).json(foundBlog);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch blog by slug", error: error.message });
  }
};

export const getBlogCategories = async (req, res) => {
  try {
    const cats = await BlogCategory
      .find({}, { blogCategory: 1 }) // projection: only what you need
      .sort({ blogCategory: 1 })
      .lean();

    // optional: normalize shape if you only want the string
    // const names = cats.map(c => c.blogCategory);

    return res.status(200).json(cats);
  } catch (err) {
    console.error("getBlogCategories error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog categories",
      error: err.message
    });
  }
};

export const getBlogsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const doc = await BlogCategory.findOne({ blogCategory: category }).lean();

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // you can project only the fields you need from each blog if you want
    return res.status(200).json(doc.blogs || []);
  } catch (err) {
    console.error("getBlogsByCategory error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs by category",
      error: err.message
    });
  }
};


// Blog Faq's Controller 

export const addFaqToBlog = async (req, res) => {
  const { blogId } = req.params;
  const faqs = req.body.faqs;

  if (!Array.isArray(faqs) || faqs.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide an array of FAQs."
    });
  }

  try {
    const catDoc = await BlogCategory.findOne({ "blogs._id": blogId });
    if (!catDoc) {
      return res.status(404).json({
        success: false,
        message: "Blog not found."
      });
    }

    const blog = catDoc.blogs.id(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found in category."
      });
    }

    if (!blog.faqs) blog.faqs = [];
    blog.faqs.push(...faqs);

    await catDoc.save();

    return res.status(200).json({
      success: true,
      message: "FAQs added successfully.",
      data: blog.faqs
    });
  } catch (err) {
    console.error("Error adding FAQs to blog:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

export const getAllFaqsInBlogs = async (req, res) => {
  try {
    const allCats = await BlogCategory.find().lean();

    const result = [];
    for (const cat of allCats) {
      for (const blog of cat.blogs || []) {
        if (blog.faqs && blog.faqs.length > 0) {
          result.push({
            _id: blog._id,
            blogName: blog.blogName,
            category: cat.blogCategory,
            faqs: blog.faqs
          });
        }
      }
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching blog FAQs",
      error: err.message || "Unknown error"
    });
  }
};

export const getBlogFaqs = async (req, res) => {
  const { blogId } = req.params;

  try {
    const catDoc = await BlogCategory.findOne({ "blogs._id": blogId });
    if (!catDoc) return res.status(404).json({ message: "Blog not found" });

    const blog = catDoc.blogs.id(blogId);
    return res.json(blog.faqs || []);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateBlogFaq = async (req, res) => {
  const { blogId, faqId } = req.params;
  const { question, answer } = req.body;

  try {
    const catDoc = await BlogCategory.findOne({ "blogs._id": blogId });
    if (!catDoc) return res.status(404).json({ message: "Blog not found" });

    const blog = catDoc.blogs.id(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const faq = blog.faqs.id(faqId);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    if (typeof question === "string") faq.question = question;
    if (typeof answer === "string") faq.answer = answer;

    await catDoc.save();

    return res.json({ success: true, faq });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteBlogFaq = async (req, res) => {
  const { blogId, faqId } = req.params;

  try {
    const catDoc = await BlogCategory.findOne({ "blogs._id": blogId });
    if (!catDoc) return res.status(404).json({ message: "Blog not found" });

    const blog = catDoc.blogs.id(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.faqs = (blog.faqs || []).filter(
      f => f._id.toString() !== faqId
    );

    await catDoc.save();

    return res.json({ success: true, message: "FAQ deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
