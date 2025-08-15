// backend/routes/newsRoutes.js
import express from 'express';
import { createNews, getAllNews, getNewsById, updateNews, deleteNews } from '../controllers/newsController.js';
import { verifyToken } from '../middlewar/verifyToken.js';
import { allowRoles } from '../middlewar/checkRole.js';

const router = express.Router();

router.get('/', getAllNews);
router.get('/:id', getNewsById);


router.post('/', verifyToken, allowRoles("admin" , 'modifier' , "superadmin") , createNews);
router.put('/:id', verifyToken, allowRoles('modifier' , "superadmin") , updateNews);
router.delete('/:id', verifyToken, allowRoles('modifier' , "superadmin") , deleteNews);

export default router;