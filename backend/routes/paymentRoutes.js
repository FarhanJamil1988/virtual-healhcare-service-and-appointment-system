import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN
} from '../controllers/paymentController.js';

const router = express.Router();

// Protected routes
router.post('/initiate', protect, initiatePayment);

// SSLCommerz callback URLs - handle both GET and POST
router.get('/success/:tran_id', paymentSuccess);
router.post('/success/:tran_id', paymentSuccess);
router.get('/success', paymentSuccess); // Add this for demo success
router.post('/success', paymentSuccess); // Add this for demo success

router.get('/fail/:tran_id', paymentFail);
router.post('/fail/:tran_id', paymentFail);
router.get('/fail', paymentFail);
router.post('/fail', paymentFail);

router.get('/cancel/:tran_id', paymentCancel);
router.post('/cancel/:tran_id', paymentCancel);
router.get('/cancel', paymentCancel);
router.post('/cancel', paymentCancel);

// IPN (Instant Payment Notification)
router.post('/ipn', paymentIPN);

export default router; 