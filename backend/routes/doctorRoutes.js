import express from 'express';
import { check } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import {
  updatePrescription,
  getAvailableDoctors,
  getDoctorSchedule,
  getDoctorPatients,
  getDoctorAppointments,
  updateAppointment,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorById,
  getDoctorDashboard,
  getPatientHistory,
  updateAppointmentMedical,
  createPrescription
} from '../controllers/doctorController.js';

const router = express.Router();

// Validation middleware
const profileValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('specialization', 'Specialization is required').not().isEmpty()
];

// Public routes
router.get('/dashboard/:id', getDoctorDashboard);
router.get('/', getAvailableDoctors);
router.get('/profile/:id', getDoctorProfile); 
router.get('/:id', getDoctorById);

// Protected routes
router.use(protect);
router.use(authorize('doctor'));

// Protected doctor routes

router.get('/patients/list', getDoctorPatients);
router.get('/appointments/list', getDoctorAppointments);
router.get('/schedule', getDoctorSchedule);
router.put('/appointments/:id', updateAppointment);

router.put('/profile/:id', profileValidation, updateDoctorProfile);
router.get('/patients/:id/history', getPatientHistory);
router.put('/appointments/:id/update-medical', updateAppointmentMedical);
router.post('/appointments/:id/prescription', createPrescription);
router.put('/appointments/:id/prescription', updatePrescription);
export default router; 