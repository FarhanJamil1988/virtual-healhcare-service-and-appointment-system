import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getAllPatients, getAllAppointments, getDashboardStats, getAllDoctors } from '../controllers/adminController.js';

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

// Patient routes
router.get('/patients', getAllPatients);
router.get('/appointments', getAllAppointments);

// New routes
router.get('/dashboard-stats', getDashboardStats);
router.get('/doctors', getAllDoctors);

export default router; 