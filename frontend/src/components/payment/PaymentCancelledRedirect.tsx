import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PaymentCancelledRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error('Payment was cancelled.');
    navigate('/patient/appointments');
  }, [navigate]);

  return null;
};

export default PaymentCancelledRedirect; 