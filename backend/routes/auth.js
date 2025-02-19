const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  doctorLogin, 
  doctorRegister,
  adminLogin,
  adminRegister 
} = require('../controllers/authController');
const { check } = require('express-validator');

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

const doctorRegisterValidation = [
  ...registerValidation,
  check('specialization', 'Specialization is required').not().isEmpty(),
  check('phoneNumber', 'Phone number is required').not().isEmpty(),
  check('address', 'Address is required').not().isEmpty()
];

// Add admin validation
const adminRegisterValidation = [
  ...registerValidation,
  check('phoneNumber', 'Phone number is required').not().isEmpty(),
  check('address', 'Address is required').not().isEmpty()
];

// Patient routes
router.post('/patient/register', registerValidation, register);
router.post('/patient/login', loginValidation, login);

// Doctor routes
router.post('/doctor/register', doctorRegisterValidation, doctorRegister);
router.post('/doctor/login', loginValidation, doctorLogin);

// Admin routes
router.post('/admin/register', adminRegisterValidation, adminRegister);
router.post('/admin/login', loginValidation, adminLogin);

module.exports = router;