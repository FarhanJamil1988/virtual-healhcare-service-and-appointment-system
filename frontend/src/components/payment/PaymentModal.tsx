import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface PaymentModalProps {
  appointmentData: {
    doctorId: string;
    serviceId: string;
    date: string;
    time: string;
    patientNotes?: string;
    price?: number;
  };
  amount: number;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ appointmentData, amount, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      // Create appointment with payment required flag
      const createAppointmentResponse = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...appointmentData,
          requiresPayment: true
        })
      });

      if (!createAppointmentResponse.ok) {
        const error = await createAppointmentResponse.json();
        throw new Error(error.message || 'Failed to create appointment');
      }

      const appointmentResult = await createAppointmentResponse.json();

      // Initiate payment
      const paymentResponse = await fetch('http://localhost:5000/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          appointmentId: appointmentResult.appointment._id,
          amount: amount
        })
      });

      if (!paymentResponse.ok) {
        // Delete the appointment if payment fails
        await fetch(`http://localhost:5000/api/appointments/${appointmentResult.appointment._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const error = await paymentResponse.json();
        throw new Error(error.message || 'Failed to initiate payment');
      }

      const paymentData = await paymentResponse.json();
      
      if (paymentData.url) {
        window.location.href = paymentData.url;
      } else {
        throw new Error('Payment URL not received');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Payment process failed';
      toast.error(message);
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold text-white mb-4">Payment Required</h2>
        <p className="text-gray-300 mb-6">
          You have used all your free appointments. Please pay ৳{amount} to book this appointment.
        </p>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 