import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import { calculateAppointmentCost, updateAppointmentCount } from '../utils/appointmentHelpers.js';
import Service from '../models/Service.js';

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private (Patient only)
export const createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      serviceId,
      date,
      time,
      patientNotes,
      requiresPayment
    } = req.body;

    // Check if the time slot is available
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: date,
      time: time,
      status: { $in: ['pending', 'scheduled'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked. Please select a different time.'
      });
    }

    // Only check appointment count for non-payment appointments
    if (!requiresPayment) {
      const appointmentCount = await Appointment.countDocuments({
        patient: req.user._id,
        status: { $in: ['completed', 'scheduled'] }
      });

      if (appointmentCount >= 3) {
        return res.status(400).json({
          success: false,
          message: 'No free appointments remaining'
        });
      }
    }

    // Get service for price
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Create appointment
    const appointment = new Appointment({
      doctor: doctorId,
      patient: req.user._id,
      service: serviceId,
      date,
      time,
      patientNotes,
      status: 'pending',
      paymentStatus: requiresPayment ? 'pending' : 'not_required',
      price: requiresPayment ? service.price : 0
    });

    await appointment.save();
    await appointment.populate(['doctor', 'service']);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: error.code === 11000 ? 'This time slot is already booked' : 'Failed to create appointment',
      error: error.message
    });
  }
};

export const getAppointments = async (req, res) => {
  try {
    let query = {};
    
    // Filter appointments based on role
    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }
    
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phoneNumber')
      .populate('doctor', 'name specialization')
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      count: appointments.length,
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

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phoneNumber')
      .populate('doctor', 'name specialization');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has permission to view this appointment
    if (
      req.user.role !== 'admin' &&
      appointment.patient._id.toString() !== req.user._id.toString() &&
      appointment.doctor._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this appointment'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update appointment status
// @route   PUT /api/doctors/appointments/:id
// @access  Private (Doctor only)
export const updateAppointment = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Ensure the doctor can only update their own appointments
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    // Only update the status field
    appointment.status = status;
    const updatedAppointment = await appointment.save();

    // Populate the necessary fields before sending response
    await updatedAppointment.populate([
      { path: 'patient', select: 'name email phoneNumber' },
      { path: 'doctor', select: 'name specialization' },
      { path: 'service', select: 'name description price duration' }
    ]);

    res.json({
      success: true,
      data: updatedAppointment
    });
   
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get appointments by date
// @route   GET /api/appointments/date/:date
// @access  Private
export const getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    let query = { date };

    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phoneNumber')
      .populate('doctor', 'name specialization')
      .sort({ time: 1 });

    res.json({
      success: true,
      count: appointments.length,
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

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Update status to cancelled instead of deleting
    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
};

// @desc    Schedule appointment
// @route   PUT /api/doctors/appointments/:id/schedule
// @access  Private (Doctor only)
export const scheduleAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Verify the doctor is the one assigned to this appointment
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to schedule this appointment'
      });
    }

    // Update appointment status to scheduled
    appointment.status = 'scheduled';
    await appointment.save();

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Schedule appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule appointment',
      error: error.message
    });
  }
};

// @desc    Check if payment is required for appointment
// @route   POST /api/appointments/check-payment
// @access  Private (Patient only)
export const checkPaymentRequired = async (req, res) => {
  try {
    const patient = await User.findById(req.user._id);
    const service = await Service.findById(req.body.serviceId);

    if (!patient || !service) {
      return res.status(404).json({
        success: false,
        message: 'Patient or service not found'
      });
    }

    // Get count of ONLY completed and scheduled appointments
    const appointmentCount = await Appointment.countDocuments({
      patient: req.user._id,
      status: { $in: ['completed', 'scheduled'] }
    });

    // First 3 appointments are free
    const requiresPayment = appointmentCount >= 3;
    
    res.json({
      success: true,
      requiresPayment,
      amount: requiresPayment ? service.price : 0,
      remainingFreeAppointments: Math.max(0, 3 - appointmentCount)
    });

  } catch (error) {
    console.error('Check payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check payment requirement'
    });
  }
};

export const checkPaymentRequirement = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Check number of existing appointments
    const appointmentCount = await Appointment.countDocuments({
      patient: userId,
      status: { $in: ['pending', 'scheduled'] }
    });

    const requiresPayment = appointmentCount >= 3;

    res.json({
      success: true,
      requiresPayment,
      tempId: requiresPayment ? Date.now().toString() : null // Optional: generate a temporary ID if needed
    });
  } catch (error) {
    console.error('Check payment requirement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check payment requirement'
    });
  }
}; 