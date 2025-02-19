import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getPatientProfile,
  updatePatientProfile,
  getPatientAppointments
} from '../controllers/patientController.js';
import { check } from 'express-validator';
import validate from '../middleware/validate.js';

const router = express.Router();

// Validation middleware
const profileValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('phoneNumber', 'Phone number is required').not().isEmpty()
];

// All routes are protected and for patients only
router.use(protect);
router.use(authorize('patient'));

router.route('/profile')
  .get(getPatientProfile)
  .put(profileValidation, validate, updatePatientProfile);

router.get('/appointments', getPatientAppointments);

export default router; 