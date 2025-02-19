import Service from '../models/Service.js';
import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';

// @desc    Get all services
// @route   GET /api/services
// @access  Private
export const getServices = async (req, res) => {
  try {
    // First, find all active services
    const services = await Service.find({ isActive: true });
    
    // Then, populate doctors for each service
    const populatedServices = await Promise.all(
      services.map(async (service) => {
        const populatedService = await Service.findById(service._id)
          .populate({
            path: 'doctors',
            select: 'name email specialization isAvailable',
            match: { role: 'doctor' }
          });
        return populatedService;
      })
    );

    console.log('Populated services:', JSON.stringify(populatedServices, null, 2));

    res.status(StatusCodes.OK).json(populatedServices);
  } catch (error) {
    console.error('Error in getServices:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Error fetching services',
      error: error.message
    });
  }
};

// @desc    Get services by specialization
// @route   GET /api/services/specialization/:specialization
// @access  Private
export const getServicesBySpecialization = async (req, res) => {
  try {
    const doctors = await User.find({ 
      role: 'doctor',
      isActive: true,
      specialization: req.params.specialization
    }).select('name specialization workingHours isAvailable');

    if (doctors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No doctors found for this specialization'
      });
    }

    const service = {
      name: `${req.params.specialization} Consultation`,
      description: `Medical consultation with ${req.params.specialization} specialist`,
      duration: 30,
      price: 100,
      specialization: req.params.specialization,
      doctors: doctors
    };

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get services by doctor ID
// @route   GET /api/services/doctor/:doctorId
// @access  Private
export const getServicesByDoctor = async (req, res) => {
  try {
    const doctor = await User.findOne({ 
      _id: req.params.doctorId,
      role: 'doctor',
      isActive: true 
    }).select('name specialization workingHours isAvailable');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const service = {
      name: `${doctor.specialization} Consultation`,
      description: `Medical consultation with Dr. ${doctor.name}`,
      duration: 30,
      price: 100,
      specialization: doctor.specialization,
      doctor: doctor
    };

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add service to doctor
// @route   POST /api/services/doctor/:doctorId
// @access  Private (Admin only)
export const addServiceToDoctor = async (req, res) => {
  try {
    const { serviceId } = req.body;
    const doctorId = req.params.doctorId;

    // Check if doctor exists and is active
    const doctor = await User.findOne({ 
      _id: doctorId, 
      role: 'doctor',
      isActive: true 
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Update service to include this doctor
    const service = await Service.findByIdAndUpdate(
      serviceId,
      { $addToSet: { doctors: doctorId } },
      { new: true }
    ).populate('doctors', 'name specialization');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create service
// @route   POST /api/services
// @access  Private (Admin only)
export const createService = async (req, res) => {
  try {
    const { name, description, duration, price } = req.body;
    
    const service = await Service.create({
      name,
      description,
      duration,
      price,
      doctors: [], // Initialize with empty doctors array
      isActive: true
    });

    const populatedService = await Service.findById(service._id)
      .populate({
        path: 'doctors',
        select: 'name email specialization isAvailable',
        match: { role: 'doctor' }
      });

    console.log('Created service:', populatedService);
    
    res.status(StatusCodes.CREATED).json(populatedService);
  } catch (error) {
    console.error('Error in createService:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Error creating service',
      error: error.message
    });
  }
};

// Delete service
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Service not found'
      });
    }
    
    // Soft delete by setting isActive to false
    service.isActive = false;
    await service.save();
    
    res.status(StatusCodes.OK).json({
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Error deleting service',
      error: error.message
    });
  }
}; 