import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { DoctorDashboardLayout } from '../../layouts/DoctorDashboardLayout';

const DoctorDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [selectedStatus, appointments]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments/doctor', {
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

  const filterAppointments = () => {
    if (selectedStatus === 'all') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(appointments.filter(apt => apt.status === selectedStatus));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleAcceptAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Appointment accepted successfully');
        fetchAppointments(); // Refresh the appointments list
      }
    } catch (error) {
      toast.error('Failed to accept appointment');
    }
  };

  return (
    <DoctorDashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-white">My Appointments</h1>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-700 text-white rounded px-3 py-1"
          >
            <option value="all">All Appointments</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-center text-white">Loading...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-gray-800 rounded-lg p-4 shadow-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      Patient: {appointment.patient.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Email: {appointment.patient.email}
                    </p>
                    {appointment.patient.phoneNumber && (
                      <p className="text-gray-400 text-sm">
                        Phone: {appointment.patient.phoneNumber}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(appointment.status)}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 text-gray-300">
                  <p>
                    <span className="text-gray-400">Date: </span>
                    {format(new Date(appointment.date), 'MMMM d, yyyy')}
                  </p>
                  <p>
                    <span className="text-gray-400">Time: </span>
                    {appointment.time}
                  </p>
                  <p>
                    <span className="text-gray-400">Service: </span>
                    {appointment.service.name}
                  </p>
                  {appointment.patientNotes && (
                    <p>
                      <span className="text-gray-400">Notes: </span>
                      {appointment.patientNotes}
                    </p>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  {appointment.status === 'pending' && (
                    <button
                      onClick={() => handleAcceptAppointment(appointment._id)}
                      className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
                    >
                      Accept Appointment
                    </button>
                  )}
                  {appointment.status === 'scheduled' && (
                    <button
                      onClick={() => handleCompleteAppointment(appointment._id)}
                      className="w-full bg-emerald-600 text-white rounded py-2 hover:bg-emerald-700 transition"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DoctorDashboardLayout>
  );
};

export default DoctorDashboard; 