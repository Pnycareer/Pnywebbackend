import express from 'express';
import {
    createGallery,
    getAllGalleries,
    getGalleryById,
    updateGallery,
    deleteGallery,
    deleteGalleryImage
} from '../controllers/galleryController.js';
import { uploadFiles } from '../multer/multerConfig.js';
import { verifyToken } from '../middlewar/verifyToken.js';
import { allowRoles, checkPublicToken } from '../middlewar/checkRole.js';

const router = express.Router();



// GET /api/gallery --> Get all galleries
router.get('/', checkPublicToken , getAllGalleries);

// GET /api/gallery/:id --> Get a single gallery by ID
router.get('/:id', getGalleryById);

// POST /api/gallery --> Create new gallery
router.post('/', uploadFiles , verifyToken , allowRoles("admin" , 'modifier' , "superadmin") , createGallery);

// PUT /api/gallery/:id --> Update a gallery
router.put('/:id', uploadFiles , verifyToken , allowRoles('modifier' , "superadmin") ,updateGallery);

// DELETE /api/gallery/:id --> Delete a gallery
router.delete('/deletegallaery/:id', verifyToken , allowRoles('modifier' , "superadmin") ,deleteGallery);

router.delete('/:galleryId/image', verifyToken , allowRoles('modifier' , "superadmin") , deleteGalleryImage);

export default router;
