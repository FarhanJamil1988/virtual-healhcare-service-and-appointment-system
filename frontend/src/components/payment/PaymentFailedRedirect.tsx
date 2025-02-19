import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PaymentFailedRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error('Payment failed. Please try booking again.');
    navigate('/patient/appointments');
  }, [navigate]);

  return null;
};

export default PaymentFailedRedirect; 