import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import type { Appointment } from '../../types/appointment';
import AdminDashboardLayout from '../../components/layouts/AdminDashboardLayout';

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
        setFilteredAppointments(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = appointments.filter(appointment => {
      const matchesSearch = 
        appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.service.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, appointments]);

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-white">All Appointments</h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 text-white rounded px-4 py-2"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-700 text-white rounded px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-white">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{appointment.patient.name}</div>
                      <div className="text-gray-400 text-sm">{appointment.patient.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{appointment.doctor.name}</td>
                    <td className="px-6 py-4 text-gray-300">{appointment.service.name}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {format(new Date(appointment.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{appointment.time}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-500';
    case 'scheduled':
      return 'bg-blue-500/10 text-blue-500';
    case 'completed':
      return 'bg-green-500/10 text-green-500';
    case 'cancelled':
      return 'bg-red-500/10 text-red-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
};

export default Appointments; 