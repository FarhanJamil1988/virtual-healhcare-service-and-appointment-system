import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Appointment } from '../../types';

const PatientAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of your component code...
};

export default PatientAppointments; 