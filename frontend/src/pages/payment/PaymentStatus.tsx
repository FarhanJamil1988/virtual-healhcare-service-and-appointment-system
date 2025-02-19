import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface AppointmentDetails {
  doctor: {
    name: string;
  };
  scheduledAt: string;
  service: {
    name: string;
  };
}

const PaymentStatus: React.FC = () => {
  const { status, transactionId } = useParams();
  const navigate = useNavigate();
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails | null>(null);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (status === 'success' && transactionId) {
        try {
          const response = await fetch(`http://localhost:5000/api/appointments/by-transaction/${transactionId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          if (data.success) {
            setAppointmentDetails(data.appointment);
          }
        } catch (error) {
          console.error('Error fetching appointment details:', error);
        }
      }
    };

    fetchAppointmentDetails();
  }, [status, transactionId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/patient/appointments');
    }, 5000);

    // Log the transaction for debugging
    console.log('Transaction ID:', transactionId);
    console.log('Payment Status:', status);

    if (status === 'success') {
      toast.success('Payment successful! Your appointment has been scheduled.');
    } else if (status === 'failed') {
      toast.error('Payment failed. Please try again.');
    } else if (status === 'cancelled') {
      toast.error('Payment was cancelled.');
    }

    return () => clearTimeout(timer);
  }, [status, transactionId, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          {status === 'success' && (
            <div className="text-emerald-500 text-5xl mb-4">✓</div>
          )}
          {status === 'failed' && (
            <div className="text-red-500 text-5xl mb-4">✕</div>
          )}
          {status === 'cancelled' && (
            <div className="text-yellow-500 text-5xl mb-4">!</div>
          )}
        </div>

        <h2 className="text-2xl font-semibold text-white mb-4">
          {status === 'success' && 'Payment Successful'}
          {status === 'failed' && 'Payment Failed'}
          {status === 'cancelled' && 'Payment Cancelled'}
        </h2>

        {status === 'success' && appointmentDetails && (
          <div className="text-gray-300 mb-6">
            <p>Your appointment has been scheduled with:</p>
            <p className="font-semibold">{appointmentDetails.doctor.name}</p>
            <p>Service: {appointmentDetails.service.name}</p>
            <p>Date & Time: {new Date(appointmentDetails.scheduledAt).toLocaleString()}</p>
          </div>
        )}

        <p className="text-gray-400 mb-6">
          Redirecting to appointments page...
        </p>

        <button
          onClick={() => navigate('/patient/appointments')}
          className="text-emerald-400 hover:text-emerald-300"
        >
          Go to Appointments
        </button>
      </div>
    </div>
  );
};

export default PaymentStatus; 