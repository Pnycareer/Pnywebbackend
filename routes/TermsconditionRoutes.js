// routes/pageRoutes.js
import express from 'express';
import {
  createPage,
  getAllPages,
  getPageById,
  updatePage,
  deletePage
} from '../controllers/TermsconditionController.js';

const router = express.Router();

router.post('/', createPage);
router.get('/', getAllPages);
router.get('/:id', getPageById);
router.put('/:id', updatePage);
router.delete('/:id', deletePage);

export default router;
