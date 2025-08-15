import SBlogPost from "../models/sblogPostModel.js";
import { uploadFiles } from "../multer/multerConfig.js";

export const createBlogPost = async (req, res) => {
    uploadFiles(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      try {
        // Get file paths if files were uploaded
        const blogImage = req.files['postThumbnailImage'] ? req.files['postThumbnailImage'][0].path : null;
        const blogData = {
          ...req.body,
          postThumbnailImage: blogImage,
          
        };
        const special = new SBlogPost(blogData);
        await special.save();
        res.status(201).json({ message: 'special page created successfully', special });
      } catch (error) {
        res.status(400).json({ message: 'Internal server errror' + error.message });
      }
    });
  };

  

// Get all Blog Posts
export const getAllBlogPosts = async (req, res) => {
    try {
        const posts = await SBlogPost.find().populate('postCategory');  // Populates City Category
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve posts', error: error.message });
    }
};

// Get Blog Post by ID

export const getBlogPostById = async (req, res) => {
    try {
        const post = await SBlogPost.findById(req.params.id).populate('postCategory');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve post', error: error.message });
    }
};

// Update a Blog Post

export const updateBlogPost = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedPost = await SBlogPost.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post updated successfully', updatedPost });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update post', error: error.message });
    }
};

// Delete a Blog Post

export const deleteBlogPost = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPost = await SBlogPost.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete post', error: error.message });
    }
};