// controllers/authController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import Service from '../models/Service.js';

// Helper function to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { services, ...userData } = req.body;
    
    console.log('Registration data:', { userData, services }); // Debug log

    // Create the user
    const user = await User.create({
      ...userData,
      role: 'doctor',
      isAvailable: true // Ensure doctor is available by default
    });

    // If it's a doctor and services are provided
    if (userData.role === 'doctor' && services && services.length > 0) {
      // Update the doctor's services
      user.services = services;
      await user.save();

      // Add the doctor to each service's doctors array
      for (const serviceId of services) {
        await Service.findByIdAndUpdate(
          serviceId,
          { $addToSet: { doctors: user._id } },
          { new: true }
        );
      }

      console.log('Updated services for doctor:', services); // Debug log
    }

    // Fetch the updated user with populated services
    const updatedUser = await User.findById(user._id)
      .populate('services');

    const token = generateToken(user._id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          specialization: updatedUser.specialization,
          services: updatedUser.services
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Retrieve user with password field selected explicitly
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare entered password with hashed password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Doctor login
// @route   POST /api/auth/doctor/login
// @access  Public
export const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for doctor
    const doctor = await User.findOne({ email, role: 'doctor' }).select('+password');
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await doctor.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(doctor._id);

    res.json({
      success: true,
      data: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
        specialization: doctor.specialization,
        token
      }
    });
  } catch (error) {
    console.error('Doctor login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Register doctor
// @route   POST /api/auth/doctor/register
// @access  Public
export const doctorRegister = async (req, res) => {
  try {
    const { specialization, ...userData } = req.body;
    
    // Find the service by specialization name
    const service = await Service.findOne({ 
      name: specialization,
      isActive: true 
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or inactive'
      });
    }

    // Create the doctor with isAvailable true by default
    const doctor = await User.create({
      ...userData,
      specialization,
      isAvailable: true,
      services: [service._id] // Add service to doctor's services
    });

    // Add doctor to service's doctors array
    service.doctors.push(doctor._id);
    await service.save();

    // Fetch the updated doctor with populated services
    const updatedDoctor = await User.findById(doctor._id)
      .populate('services');

    console.log('Created doctor:', updatedDoctor);
    console.log('Updated service:', service);

    const token = generateToken(doctor._id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        user: {
          id: updatedDoctor._id,
          name: updatedDoctor.name,
          email: updatedDoctor.email,
          role: updatedDoctor.role,
          specialization: updatedDoctor.specialization,
          services: updatedDoctor.services
        },
        token
      }
    });
  } catch (error) {
    console.error('Doctor registration error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error registering doctor',
      error: error.message
    });
  }
};

export const patientLogin = async (req, res) => {
  console.log("patientLogin");
  try {
    const { email, password } = req.body;

    const patient = await User.findOne({ email, role: 'patient' }).select('+password');
    if (!patient || !(await patient.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(patient._id);

    res.json({
      success: true,
      data: {
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        role: patient.role,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const patientRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const patient = await User.create({
      name,
      email,
      password,
      role: 'patient'
    });

    const token = generateToken(patient._id);

    res.status(201).json({
      success: true,
      data: {
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        role: patient.role,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const admin = await User.findOne({ email, role: 'admin' }).select('+password');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    const token = generateToken(admin._id);

    res.json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const adminRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
