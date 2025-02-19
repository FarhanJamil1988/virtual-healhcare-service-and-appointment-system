import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PaymentSuccessRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success('Appointment scheduled successfully!');
    navigate('/patient/appointments');
  }, [navigate]);

  return null;
};

export default PaymentSuccessRedirect; 