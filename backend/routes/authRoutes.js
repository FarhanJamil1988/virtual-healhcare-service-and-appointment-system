import express from 'express';
import { check } from 'express-validator';
import {
  register,
  login,
  doctorLogin,
  doctorRegister,
  patientLogin,
  patientRegister,
  adminLogin,
  adminRegister
} from '../controllers/authController.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// Validation middleware
const registerValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
];

const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

// Auth routes
// router.post('/register', registerValidation, validate, register);
// router.post('/login', loginValidation, validate, login);

// Doctor auth routes
router.post('/doctor/login', loginValidation, validate, doctorLogin);
router.post('/doctor/register', [
  ...registerValidation,
  check('specialization', 'Specialization is required').not().isEmpty()
], validate, doctorRegister);

// Patient auth routes
router.post('/patient/login', loginValidation, validate, patientLogin);
router.post('/patient/register', registerValidation, validate, patientRegister);

// Admin auth routes
router.post('/admin/login', loginValidation, validate, adminLogin);
router.post('/admin/register', registerValidation, validate, adminRegister);

export default router; 