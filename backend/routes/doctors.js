const express = require('express');
const router = express.Router();
const {
  getAvailableDoctors,
  getDoctorSchedule
} = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');

router.get('/', getAvailableDoctors);
router.get('/:id/schedule', protect, getDoctorSchedule);

module.exports = router; 