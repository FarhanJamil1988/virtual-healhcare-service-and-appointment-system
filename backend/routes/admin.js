import express from 'express';
import { check } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllUsers,
  getDoctors,
  updateUser,
  deleteUser,
  getSystemStats
} from '../controllers/adminController.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// All routes in this file are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// User management routes
router.get('/users', getAllUsers);
router.get('/doctors', getDoctors);
router.get('/stats', getSystemStats);

// User update/delete routes with validation
router.put('/users/:id', [
  check('name', 'Name is required').optional().notEmpty(),
  check('email', 'Please include a valid email').optional().isEmail(),
  check('role').optional().isIn(['admin', 'doctor', 'patient'])
], validate, updateUser);

router.delete('/users/:id', deleteUser);

export default router; 