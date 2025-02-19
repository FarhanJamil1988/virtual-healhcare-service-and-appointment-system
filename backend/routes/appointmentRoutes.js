import express from 'express';
import { check } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  scheduleAppointment,
  checkPaymentRequirement
} from '../controllers/appointmentController.js';
import validate from '../middleware/validate.js';
import Appointment from '../models/Appointment.js';

const router = express.Router();

// Validation middleware
const appointmentValidation = [
  check('doctorId', 'Doctor ID is required').not().isEmpty(),
  check('date', 'Valid date is required').isISO8601(),
  check('time', 'Valid time is required').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
];

// All routes are protected
router.use(protect);

// Routes for all authenticated users
router.get('/', getAppointments);
router.get('/:id', getAppointmentById);

// Routes for patients only
router.post('/', authorize('patient'), appointmentValidation, validate, createAppointment);

// Routes for doctors only
router.put('/:id', authorize('doctor', 'patient'), updateAppointment);

// Routes for patients and doctors
router.delete('/:id', authorize('patient', 'doctor'), deleteAppointment);

// Add this route with your other appointment routes
router.put('/doctors/appointments/:id/schedule', protect, authorize('doctor'), scheduleAppointment);

router.post('/check-payment', protect, checkPaymentRequirement);

// Add this route
router.get('/by-transaction/:transactionId', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ 
      transactionId: req.params.transactionId 
    })
    .populate('doctor', 'name')
    .populate('service', 'name');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment details',
      error: error.message
    });
  }
});

export default router; 