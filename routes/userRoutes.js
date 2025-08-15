import express from 'express';
import { getAllUsers, updateUserById } from '../controllers/userController.js';
import { toggleBlockUser } from '../controllers/userController.js';
import { deleteUserById } from '../controllers/userController.js';

const router = express.Router();

// GET /api/users - Get all users
router.get('/', getAllUsers);

// PUT /api/users/:id - Update a user by ID
router.put('/:id', updateUserById);

// routes/userRoutes.js
router.put('/block/:id', toggleBlockUser);

// delete
router.delete('/:id', deleteUserById);


export default router;
