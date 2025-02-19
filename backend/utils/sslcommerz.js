import SSLCommerzPayment from 'sslcommerz-lts';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Appointment from '../models/Appointment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = false; // Set to true for production

// Export the SSLCommerzPayment class directly
export default SSLCommerzPayment;

// Export the initialization function
export const initializePayment = async (paymentData) => {
  try {
    const data = {
      store_id: store_id,
      store_passwd: store_passwd,
      total_amount: paymentData.total_amount,
      currency: paymentData.currency,
      tran_id: paymentData.tran_id,
      success_url: paymentData.success_url,
      fail_url: paymentData.fail_url,
      cancel_url: paymentData.cancel_url,
      ipn_url: paymentData.ipn_url,
      shipping_method: 'NO',
      product_name: paymentData.product_name,
      product_category: 'Healthcare',
      product_profile: 'general',
      cus_name: paymentData.cus_name,
      cus_email: paymentData.cus_email,
      cus_add1: paymentData.cus_add1,
      cus_city: paymentData.cus_city,
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: paymentData.cus_phone,
      cus_fax: '',
      ship_name: paymentData.cus_name,
      ship_add1: paymentData.cus_add1,
      ship_city: paymentData.cus_city,
      ship_state: 'Dhaka',
      ship_postcode: '1000',
      ship_country: 'Bangladesh',
      multi_card_name: 'mastercard,visacard,bkash',
      value_a: 'ref001',
      value_b: 'ref002',
      value_c: 'ref003',
      value_d: 'ref004'
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const response = await sslcz.init(data);
    
    if (!response?.GatewayPageURL) {
      throw new Error('Failed to get payment gateway URL');
    }
    
    return response;
  } catch (error) {
    console.error('SSL Commerz initialization error:', error);
    throw error;
  }
}; 