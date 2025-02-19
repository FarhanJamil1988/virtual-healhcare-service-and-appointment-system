const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus
} = require('../controllers/appointmentController');
const { check } = require('express-validator');

// Validation middleware
const appointmentValidation = [
  check('doctor', 'Doctor is required').not().isEmpty(),
  check('service', 'Service type is required').isIn(['Medical Consultation', 'Dental Checkup', 'Therapy Session']),
  check('date', 'Valid date is required').isISO8601(),
  check('time', 'Valid time is required').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
];

router.use(protect);

router.route('/')
  .post(appointmentValidation, createAppointment)
  .get(getAppointments);

router.route('/:id')
  .put(updateAppointmentStatus);

module.exports = router; 