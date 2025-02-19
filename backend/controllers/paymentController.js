import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { initializePayment } from '../utils/sslcommerz.js';
import dotenv from 'dotenv';

dotenv.config();

export const initiatePayment = async (req, res) => {
  
  console.log("initiatePayment");
  console.log(req.body);
  try {

    const { appointmentId, amount } = req.body;
    
    // Get appointment and verify it requires payment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.paymentStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }

    // Get patient details
    const patient = await User.findById(req.user._id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const tran_id = `APPOINTMENT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save transaction ID to appointment
    appointment.transactionId = tran_id;
    await appointment.save();

    // Prepare payment data
    const paymentData = {
      total_amount: amount,
      currency: 'BDT',
      tran_id: tran_id,
      success_url: `${process.env.BACKEND_URL}/api/payments/success/${tran_id}`,
      fail_url: `${process.env.BACKEND_URL}/api/payments/fail/${tran_id}`,
      cancel_url: `${process.env.BACKEND_URL}/api/payments/cancel/${tran_id}`,
      ipn_url: `${process.env.BACKEND_URL}/api/payments/ipn`,
      product_name: 'Doctor Appointment',
      cus_name: patient.name,
      cus_email: patient.email,
      cus_add1: patient.address || 'Dhaka',
      cus_city: 'Dhaka',
      cus_phone: patient.phone || '01700000000'
    };

    // Initialize SSL Commerz payment
    const response = await initializePayment(paymentData);

    res.json({
      success: true,
      url: response.GatewayPageURL
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    
    // If there's an appointment ID, delete the appointment
    if (req.body.appointmentId) {
      try {
        await Appointment.findByIdAndDelete(req.body.appointmentId);
      } catch (deleteError) {
        console.error('Error deleting appointment:', deleteError);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.message
    });
  }
};

export const paymentSuccess = async (req, res) => {
  try {
    const { tran_id } = req.params;
    
    // Find and update the appointment
    const appointment = await Appointment.findOne({ transactionId: tran_id });
    
    if (appointment) {
      appointment.status = 'scheduled';
      appointment.paymentStatus = 'completed';
      await appointment.save();
    }

    res.redirect(`${process.env.FRONTEND_URL}/patient/appointments/payment-success`);
  } catch (error) {
    console.error('Payment success error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/patient/appointments/payment-error`);
  }
};

export const paymentFail = async (req, res) => {
  try {
    const { tran_id } = req.params;
    
    const appointment = await Appointment.findOne({
      transactionId: tran_id
    });

    if (appointment) {
      // Delete the appointment since payment failed
      await Appointment.findByIdAndDelete(appointment._id);
    }

    res.redirect(`${process.env.FRONTEND_URL}/patient/appointments/payment-failed`);
  } catch (error) {
    console.error('Payment fail error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/patient/appointments/payment-error`);
  }
};

export const paymentCancel = async (req, res) => {
  try {
    const { tran_id } = req.params;
    
    // Find and delete the appointment since payment was cancelled
    const appointment = await Appointment.findOne({
      transactionId: tran_id
    });

    if (appointment) {
      await Appointment.findByIdAndDelete(appointment._id);
    }

    res.redirect(`${process.env.FRONTEND_URL}/patient/appointments/payment-cancelled`);
  } catch (error) {
    console.error('Payment cancel error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/patient/appointments/payment-error`);
  }
};

export const paymentIPN = async (req, res) => {
  try {
    const { tran_id, status } = req.body;
    
    const appointment = await Appointment.findOne({
      transactionId: tran_id
    });

    if (appointment) {
      if (status === 'VALID' || status === 'VALIDATED') {
        appointment.isPaid = true;
        appointment.paymentStatus = 'completed';
      } else {
        appointment.paymentStatus = 'failed';
      }
      await appointment.save();
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('IPN error:', error);
    res.status(500).json({ error: 'IPN processing failed' });
  }
}; 