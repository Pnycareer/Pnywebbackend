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
      canonical,
      inviewweb,
    } = req.body;

    const blogImage = req.files?.blogImage ? req.files.blogImage[0].path : null;
    const authorProfileImage = req.files?.authorProfileImage
      ? req.files.authorProfileImage[0].path
      : null;

    const newBlog = {
      blogName,
      url_slug,
      shortDescription,
      blogDescription,
      publishDate,
      blogImage,
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
      canonical: canonical || "",
      inviewweb: inviewweb !== undefined ? inviewweb : true,
      showtoc: req.body.showtoc !== undefined ? req.body.showtoc : true, // ✅ Add this line
    };

    // Find or Create Category
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
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogCategory.find();
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch blogs", error: error.message });
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
      showtoc, // ✅ Add this
      newCategory, // ✅ Pass this in req.body
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

      return res
        .status(200)
        .json({
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
