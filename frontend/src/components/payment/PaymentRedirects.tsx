import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const PaymentSuccessRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success('Appointment scheduled successfully!');
    navigate('/patient/appointments');
  }, [navigate]);

  return null;
};

export const PaymentFailedRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error('Payment failed. Please try booking again.');
    navigate('/patient/appointments');
  }, [navigate]);

  return null;
};

export const PaymentCancelledRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error('Payment was cancelled.');
    navigate('/patient/appointments');
  }, [navigate]);

  return null;
};

export const PaymentErrorRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error('There was an error processing your payment.');
    navigate('/patient/appointments');
  }, [navigate]);

  return null;
}; 