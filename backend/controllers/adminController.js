import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (SuperAdmin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private (SuperAdmin only)
export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('name email phone specialization status');
    
    res.status(StatusCodes.OK).json(doctors);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching doctors'
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (SuperAdmin only)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (SuperAdmin only)
export const deleteUser = async (req, res) => {
  
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user's appointments
    await Appointment.deleteMany({
      $or: [{ patient: user._id }, { doctor: user._id }]
    });

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private (SuperAdmin only)
export const getSystemStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments();
    
    // Get monthly growth stats
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const prevMonthAppointments = await Appointment.countDocuments({
      createdAt: { $lt: lastMonth }
    });
    
    const appointmentGrowth = prevMonthAppointments ? 
      ((totalAppointments - prevMonthAppointments) / prevMonthAppointments) * 100 : 0;

    // Get recent appointments
    const recentAppointments = await Appointment.find()
      .sort({ date: -1 })
      .limit(5)
      .populate('patient', 'name')
      .populate('doctor', 'name');

    res.status(StatusCodes.OK).json({
      stats: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        patientGrowth: 0, // Calculate if needed
        doctorGrowth: 0, // Calculate if needed
        appointmentGrowth
      },
      recentAppointments: recentAppointments.map(apt => ({
        id: apt._id,
        patientName: apt.patient.name,
        doctorName: apt.doctor.name,
        date: apt.date,
        status: apt.status
      }))
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching dashboard statistics'
    });
  }
};

// @desc    Get all patients with appointment counts
// @route   GET /api/admin/patients
// @access  Private (Admin only)
export const getAllPatients = async (req, res) => {
  try {
    // Use aggregation to get patient details with appointment counts
    const patients = await User.aggregate([
      {
        $match: { role: 'patient' }
      },
      {
        $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'patient',
          as: 'appointmentsList'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: 1,
          gender: 1,
          dateOfBirth: 1,
          address: 1,
          createdAt: 1,
          appointments: { $size: '$appointmentsList' },
          lastAppointment: { 
            $max: '$appointmentsList.date' 
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patients',
      error: error.message
    });
  }
};

// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private (Admin only)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .populate('service', 'name price duration')
      .sort({ date: -1, time: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments();
    
    const appointmentsByStatus = {
      pending: await Appointment.countDocuments({ status: 'pending' }),
      scheduled: await Appointment.countDocuments({ status: 'scheduled' }),
      completed: await Appointment.countDocuments({ status: 'completed' }),
      cancelled: await Appointment.countDocuments({ status: 'cancelled' })
    };

    const recentAppointments = await Appointment.find()
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        appointmentsByStatus,
        recentAppointments
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get all doctors with appointment counts
// @route   GET /api/admin/doctors
// @access  Private (Admin only)
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.aggregate([
      {
        $match: { role: 'doctor' }
      },
      {
        $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'doctor',
          as: 'appointmentsList'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          specialization: 1,
          isAvailable: 1,
          createdAt: 1,
          appointments: { $size: '$appointmentsList' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message
    });
  }
}; 