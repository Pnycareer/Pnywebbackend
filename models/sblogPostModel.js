import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
    postTitle: { type: String, },
    urlSlug: { type: String, required: true},
    postCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'CityCategory', required: true },
    postThumbnailImage: { type: String,  },
    shortDescription: { type: String,  },
    postDescription: { type: String,  },  // CKEditor or TinyMCE content
    isPublish: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    metaTitle: { type: String },
    metaDescription: { type: String },
    inSitemap: { type: Boolean, default: false },
    pageIndex: { type: Boolean, default: false },
    customCanonicalUrl: { type: String },
    urlFullSlug: { type: String },  // Redirect URL
    createdAt: { type: Date, default: Date.now },
});

const SBlogPost = mongoose.model('sBlogPost', blogPostSchema);

export default SBlogPost;
