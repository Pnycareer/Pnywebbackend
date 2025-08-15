import express from 'express';
import { createBlogPost, deleteBlogPost, getAllBlogPosts, getBlogPostById, updateBlogPost } from '../controllers/special.blogPostController.js';


const specialBroutes = express.Router();

specialBroutes.post('/', createBlogPost);
specialBroutes.get('/', getAllBlogPosts);
specialBroutes.get('/:id', getBlogPostById);
specialBroutes.put('/:id', updateBlogPost);
specialBroutes.delete('/:id', deleteBlogPost);

export default specialBroutes;
