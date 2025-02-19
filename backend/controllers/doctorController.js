import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import { format } from 'date-fns';

// @desc    Get available doctors
// @route   GET /api/doctors
// @access  Public
export const getAvailableDoctors = async (req, res) => {
  
  
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('name email specialization workingHours');
    res.json({
      success: true,
      data: doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get doctor's schedule
// @route   GET /api/doctors/:id/schedule
// @access  Private
export const getDoctorSchedule = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.params.id,
      date: { $gte: new Date() }
    }).sort({ date: 1, time: 1 });
    
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

// @desc    Get doctor's patients
// @route   GET /api/doctors/patients
// @access  Private (Doctor only)
export const getDoctorPatients = async (req, res) => {

  try {
    const appointments = await Appointment.find({ 
      doctor: req.user._id 
    }).populate('patient', 'name email phoneNumber');
    
  
    
    // Get unique patients with additional details
    const patientsMap = new Map();
    
    for (const apt of appointments) {
      if (!patientsMap.has(apt.patient._id.toString())) {
        const patientStats = await Appointment.aggregate([
          {
            $match: {
              doctor: req.user._id,
              patient: apt.patient._id,
              status: 'completed'
            }
          },
          {
            $group: {
              _id: null,
              lastVisit: { $max: '$date' },
              totalVisits: { $sum: 1 }
            }
          }
        ]);

        patientsMap.set(apt.patient._id.toString(), {
          _id: apt.patient._id,
          name: apt.patient.name,
          email: apt.patient.email,
          phoneNumber: apt.patient.phoneNumber,
          lastVisit: patientStats[0]?.lastVisit || null,
          totalVisits: patientStats[0]?.totalVisits || 0
        });
      }
    }

    const patients = Array.from(patientsMap.values());
   
    res.json({ success: true, data: patients });
  } catch (error) {
    console.error('Error in getDoctorPatients:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get doctor's appointments
// @route   GET /api/doctors/appointments
// @access  Private (Doctor only)

export const getDoctorAppointments = async (req, res) => {
  
  try {
    const appointments = await Appointment.find({ 
      doctor: req.user._id 
    })
    .populate('patient', 'name email phoneNumber')
    .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error in getDoctorAppointments:', error); // Debug log
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
    
    // Find appointment and populate service
    const appointment = await Appointment.findById(req.params.id)
      .populate('service')
      .populate('patient')
      .populate('doctor');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Ensure the doctor can only update their own appointments
    if (appointment.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
    }

    // Only update the status field while maintaining other fields
    appointment.status = status;
    
    // Ensure service field is maintained
    if (!appointment.service) {
      // If service is missing, try to get it from doctor's services
      const doctor = await User.findById(appointment.doctor._id).populate('services');
      if (doctor && doctor.services && doctor.services.length > 0) {
        appointment.service = doctor.services[0]._id;
      } else {
        return res.status(400).json({
          success: false,
          message: 'No service found for this appointment'
        });
      }
    }

    const updatedAppointment = await appointment.save();

    res.json({
      success: true,
      data: updatedAppointment
    });
   
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
      error: error.message
    });
  }
};

export const getDoctorProfile = async (req, res) => {

  const doctorId = req.params.id;
  try {
    const doctor = await User.findById(doctorId).select('-password');
    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      specialization,
      duration,
      email,
      workingHours
    } = req.body;

    // Validate duration if it's being updated
    if (duration && ![15, 30, 45, 60].includes(Number(duration))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid consultation duration'
      });
    }

    const updatedDoctor = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phoneNumber,
        specialization,
        duration: duration ? Number(duration) : undefined,
        email,
        workingHours
      },
      { new: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: updatedDoctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Private
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findOne({ 
      _id: req.params.id,
      role: 'doctor'
    }).select('name email specialization workingHours duration isAvailable');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    
    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get doctor dashboard data
// @route   GET /api/doctors/dashboard/:id
// @access  Private (Doctor only)
export const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Get total patients (unique patients from appointments)
    const uniquePatients = await Appointment.distinct('patient', {
      doctor: doctorId
    });
    const totalPatients = uniquePatients.length;

    // Get total appointments
    const totalAppointments = await Appointment.countDocuments({ 
      doctor: doctorId 
    });

    // Get completed appointments
    const completedAppointments = await Appointment.countDocuments({
      doctor: doctorId,
      status: 'completed'
    });

    // Get today's appointments
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    const todayAppointments = await Appointment.find({
      doctor: doctorId,
      date: todayStr,
      status: { $ne: 'cancelled' }
    })
    .populate('patient', 'name')
    .sort({ time: 1 });

    // Get upcoming appointments
    const upcomingAppointments = await Appointment.find({
      doctor: doctorId,
      date: { $gt: todayStr },
      status: 'scheduled'
    })
    .populate('patient', 'name')
    .sort({ date: 1, time: 1 })
    .limit(5);

    // Format the response
    const dashboardData = {
      totalPatients,
      totalAppointments,
      completedAppointments,
      upcomingAppointments: upcomingAppointments.length,
      todayAppointments: todayAppointments.map(apt => ({
        _id: apt._id,
        patientName: apt.patient.name,
        time: apt.time,
        status: apt.status,
        date: apt.date
      })),
      recentAppointments: upcomingAppointments.map(apt => ({
        _id: apt._id,
        patientName: apt.patient.name,
        time: apt.time,
        status: apt.status,
        date: apt.date
      }))
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get patient appointment history
// @route   GET /api/doctors/patients/:id/history
// @access  Private (Doctor only)
export const getPatientHistory = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.params.id,
      doctor: req.user._id
    }).sort({ date: -1, time: -1 }); // Most recent first

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

// @desc    Update appointment medical details
// @route   PUT /api/doctors/appointments/:id/update-medical
// @access  Private (Doctor only)
export const updateAppointmentMedical = async (req, res) => {
  try {
    const { diagnosis, prescription } = req.body;
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

    // Only allow updates for confirmed or completed appointments
    if (appointment.status !== 'confirmed' && appointment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only update confirmed or completed appointments'
      });
    }

    appointment.diagnosis = diagnosis;
    appointment.prescription = prescription;
    await appointment.save();

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

// @desc    Add prescription
// @route   POST /api/doctors/appointments/:id/prescription
// @access  Private (Doctor only)
export const createPrescription = async (req, res) => {
  try {
    const { medicines, notes } = req.body;
    
    // Validate the input
    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one medicine'
      });
    }

    // Find the appointment
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor')
      .populate('patient')
      .populate('service');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Verify doctor authorization
    if (appointment.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add prescription to this appointment'
      });
    }

    // Only allow prescriptions for completed appointments
    if (appointment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only add prescriptions to completed appointments'
      });
    }

    // Add the prescription
    appointment.prescription = {
      medicines: medicines.map(med => ({
        name: med.name,
        dosage: med.dosage,
        duration: med.duration,
        instructions: med.instructions
      })),
      notes: notes || '',
      prescribedDate: new Date()
    };

    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment,
      message: 'Prescription added successfully'
    });
  } catch (error) {
    console.error('Prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding prescription',
      error: error.message
    });
  }
};

// @desc    Update prescription
// @route   PUT /api/doctors/appointments/:id/prescription
// @access  Private (Doctor only)
export const updatePrescription = async (req, res) => {
  try {
    const { medicines, notes } = req.body;
    
    // Validate the input
    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one medicine'
      });
    }

    // Find the appointment
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor')
      .populate('patient')
      .populate('service');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Verify doctor authorization
    if (appointment.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this prescription'
      });
    }

    // Check if prescription exists
    if (!appointment.prescription) {
      return res.status(404).json({
        success: false,
        message: 'No prescription found to update'
      });
    }

    // Update the prescription
    appointment.prescription = {
      medicines: medicines.map(med => ({
        name: med.name,
        dosage: med.dosage,
        duration: med.duration,
        instructions: med.instructions
      })),
      notes: notes || '',
      prescribedDate: appointment.prescription.prescribedDate, // Keep original date
      updatedDate: new Date() // Add update date
    };

    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment,
      message: 'Prescription updated successfully'
    });
  } catch (error) {
    console.error('Prescription update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating prescription',
      error: error.message
    });
  }
};

// Make sure all functions are properly exported
export default {
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
  createPrescription,
  updatePrescription
}; 