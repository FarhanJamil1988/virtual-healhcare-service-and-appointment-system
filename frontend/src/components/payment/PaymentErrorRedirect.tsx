import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PaymentErrorRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.error('There was an error processing your payment.');
    navigate('/patient/appointments');
  }, [navigate]);

  return null;
};

export default PaymentErrorRedirect; 