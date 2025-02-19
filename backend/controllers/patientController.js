import User from '../models/User.js';
import Appointment from '../models/Appointment.js';

// @desc    Get patient profile
// @route   GET /api/patients/profile
// @access  Private (Patient only)
export const getPatientProfile = async (req, res) => {
  
  try {
    const patient = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      data: patient
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/profile
// @access  Private (Patient only)
export const updatePatientProfile = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    const patient = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phoneNumber },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get patient appointments
// @route   GET /api/patients/appointments
// @access  Private (Patient only)
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialization')
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 