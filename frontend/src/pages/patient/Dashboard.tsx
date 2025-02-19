import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PatientDashboardLayout from '../../components/layouts/PatientDashboardLayout';
import { Appointment } from '../../types/dashboard';
import PrescriptionView from '../../components/PrescriptionView';
import ViewPrescriptionModal from '../../components/modals/ViewPrescriptionModal';
import { format } from 'date-fns';

const PatientDashboard: React.FC = () => {
  // Combined state from both files
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    'no-show': 0
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<{
    prescription: any;
    doctorName: string;
    appointmentDate: string;
  } | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
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

        const data = await response.json();
        const appointments: Appointment[] = data.data;

        // Calculate stats
        const stats = appointments.reduce((acc, appointment) => {
          acc.total++;
          acc[appointment.status]++;
          return acc;
        }, {
          total: 0,
          scheduled: 0,
          completed: 0,
          cancelled: 0,
          'no-show': 0
        });

        setStats(stats);
        
        // Get most recent appointments
        const recent = appointments
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
        setRecentAppointments(recent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <Link
            to="/patient/book-appointment"
            className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Book Appointment
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 md:p-6">
            <h3 className="text-gray-400 text-sm">Total Appointments</h3>
            <p className="text-2xl font-semibold text-white mt-2">{stats.total}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Scheduled</h3>
            <p className="text-emerald-500 text-2xl font-semibold mt-2">{stats.scheduled}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Completed</h3>
            <p className="text-blue-500 text-2xl font-semibold mt-2">{stats.completed}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium">Cancelled</h3>
            <p className="text-red-500 text-2xl font-semibold mt-2">{stats.cancelled}</p>
          </div>
        </div>

        {/* Appointments Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <div className="bg-gray-800 rounded-lg p-4 md:p-6">
            <h2 className="text-lg font-medium text-white mb-4">Upcoming Appointments</h2>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-gray-400">Loading...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                recentAppointments
                  .filter(apt => apt.status === 'scheduled')
                  .map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex flex-col p-4 bg-gray-700/30 rounded-xl space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-medium">
                            Dr. {appointment.doctor.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {appointment.doctor.specialization}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {format(new Date(appointment.date), 'PPP')} at {appointment.time}
                          </p>
                        </div>
                        <span className={`
                          px-3 py-1 rounded-full text-sm font-medium
                          ${appointment.status === 'scheduled' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                        `}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>

                      {/* Show prescription if it exists and appointment is completed */}
                      {appointment.status === 'completed' && appointment.prescription && (
                        <div>
                          <div className="flex justify-between items-center">
                            <h4 className="text-lg font-medium text-white">Prescription</h4>
                            <button
                              onClick={() => setSelectedPrescription({
                                prescription: appointment.prescription,
                                doctorName: appointment.doctor.name,
                                appointmentDate: appointment.date
                              })}
                              className="text-emerald-500 hover:text-emerald-400 text-sm"
                            >
                              View Full Prescription
                            </button>
                          </div>
                          <PrescriptionView prescription={appointment.prescription} />
                        </div>
                      )}
                    </div>
                  ))
              )}
              {recentAppointments.filter(apt => apt.status === 'scheduled').length === 0 && (
                <p className="text-gray-400 text-center py-4">No upcoming appointments</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-lg p-4 md:p-6">
            <h2 className="text-lg font-medium text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-gray-400">Loading...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                recentAppointments
                  .filter(apt => apt.status !== 'scheduled')
                  .map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex flex-col p-4 bg-gray-700/30 rounded-xl space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-medium">
                            Dr. {appointment.doctor.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {appointment.doctor.specialization}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {format(new Date(appointment.date), 'PPP')} at {appointment.time}
                          </p>
                        </div>
                        <span className={`
                          px-3 py-1 rounded-full text-sm font-medium
                          ${appointment.status === 'completed' ? 'bg-blue-500/10 text-blue-500' : ''}
                          ${appointment.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : ''}
                          ${appointment.status === 'no-show' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                        `}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>

                      {/* Show prescription if it exists and appointment is completed */}
                      {appointment.status === 'completed' && appointment.prescription && (
                        <div>
                          <div className="flex justify-between items-center">
                            <h4 className="text-lg font-medium text-white">Prescription</h4>
                            <button
                              onClick={() => setSelectedPrescription({
                                prescription: appointment.prescription,
                                doctorName: appointment.doctor.name,
                                appointmentDate: appointment.date
                              })}
                              className="text-emerald-500 hover:text-emerald-400 text-sm"
                            >
                              View Full Prescription
                            </button>
                          </div>
                          <PrescriptionView prescription={appointment.prescription} />
                        </div>
                      )}
                    </div>
                  ))
              )}
              {recentAppointments.filter(apt => apt.status !== 'scheduled').length === 0 && (
                <p className="text-gray-400 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Prescription Modal */}
        {selectedPrescription && (
          <ViewPrescriptionModal
            prescription={selectedPrescription.prescription}
            doctorName={selectedPrescription.doctorName}
            appointmentDate={selectedPrescription.appointmentDate}
            onClose={() => setSelectedPrescription(null)}
          />
        )}
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientDashboard; 