import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientDashboardLayout from '../../components/layouts/PatientDashboardLayout';
import { Appointment } from '../../types/dashboard';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const PaymentStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PatientAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const { data, success } = await response.json();
        if (success && Array.isArray(data)) {
          setAppointments(data);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
        toast.error('Failed to fetch appointments');
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments?.filter(appointment => {
    if (statusFilter === 'all') return true;
    return appointment.status === statusFilter;
  }) || [];

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400">Loading appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white mb-6">My Appointments</h1>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-700 text-white rounded-lg px-4 py-2"
          >
            <option value="all">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <button
            onClick={() => navigate('/patient/book-appointment')}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Book New Appointment
          </button>
        </div>

        {/* Appointments Grid */}
        {filteredAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredAppointments.map((appointment) => (
              <div 
                key={appointment._id} 
                className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700"
              >
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">
                        {appointment.doctor?.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {appointment.doctor?.specialization}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {format(new Date(appointment.date), 'PPP')} at {appointment.time}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      appointment.status === 'scheduled' ? 'bg-blue-500/10 text-blue-500' :
                      appointment.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                  
                  {appointment.notes && (
                    <p className="text-gray-400 text-sm border-t border-gray-700 pt-3">
                      Notes: {appointment.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-800/50 rounded-lg">
            <p className="text-gray-400">
              {statusFilter === 'all' 
                ? 'No appointments found' 
                : `No ${statusFilter} appointments found`}
            </p>
          </div>
        )}
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientAppointments; 