import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DoctorDashboardLayout from '../../components/layouts/DoctorDashboardLayout';
import { format } from 'date-fns';
import ViewPrescriptionModal from '../../components/modals/ViewPrescriptionModal';

interface Appointment {
  _id: string;
  patientName: string;
  date: string;
  time: string;
  status: string;
}

interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  upcomingAppointments: number;
}

const DoctorDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<{
    prescription: any;
    patientName: string;
    appointmentDate: string;
  } | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const response = await fetch(`http://localhost:5000/api/doctors/dashboard/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      console.log('Dashboard data:', data);
      
      if (data.success) {
        setStats({
          totalPatients: data.data.totalPatients,
          totalAppointments: data.data.totalAppointments,
          completedAppointments: data.data.completedAppointments,
          upcomingAppointments: data.data.upcomingAppointments
        });
        setTodayAppointments(data.data.todayAppointments || []);
        setRecentAppointments(data.data.recentAppointments || []);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Dashboard error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DoctorDashboardLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>

        {isLoading ? (
          <div className="text-gray-400">Loading dashboard...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-gray-400 text-sm">Total Patients</h3>
                <p className="text-2xl font-semibold text-white mt-2">{stats?.totalPatients}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-gray-400 text-sm">Total Appointments</h3>
                <p className="text-2xl font-semibold text-white mt-2">{stats?.totalAppointments}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-gray-400 text-sm">Completed Appointments</h3>
                <p className="text-2xl font-semibold text-green-500 mt-2">{stats?.completedAppointments}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-gray-400 text-sm">Upcoming Appointments</h3>
                <p className="text-2xl font-semibold text-yellow-500 mt-2">{stats?.upcomingAppointments}</p>
              </div>
            </div>

            {/* Today's Appointments */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-medium text-white mb-4">Today's Appointments</h2>
              <div className="space-y-4">
                {todayAppointments && todayAppointments.length > 0 ? (
                  todayAppointments.map((appointment) => (
                    <div 
                      key={appointment._id} 
                      className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg"
                    >
                      <div>
                        <h3 className="text-white font-medium">{appointment.patientName}</h3>
                        <p className="text-gray-400 text-sm">
                          Time: {appointment.time}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        appointment.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                        appointment.status === 'scheduled' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center">No appointments for today</p>
                )}
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-lg font-medium text-white mb-4">Recent Appointments</h2>
              <div className="space-y-4">
                {recentAppointments?.length > 0 ? (
                  recentAppointments.map((appointment) => (
                    <div key={appointment._id} className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium">{appointment.patientName}</h3>
                        <p className="text-gray-400 text-sm">
                          {format(new Date(appointment.date), 'PPP')} at {appointment.time}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        appointment.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                        appointment.status === 'scheduled' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center">No recent appointments</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Prescription Modal */}
        {selectedPrescription && (
          <ViewPrescriptionModal
            prescription={selectedPrescription.prescription}
            doctorName={selectedPrescription.patientName}
            appointmentDate={selectedPrescription.appointmentDate}
            onClose={() => setSelectedPrescription(null)}
          />
        )}
      </div>
    </DoctorDashboardLayout>
  );
};

export default DoctorDashboard; 