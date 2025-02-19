import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboardData } from '../types/dashboard';
import { fetchDashboardData, logout } from '../services/api';

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardData('admin');
        setDashboardData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
        if (err.message.includes('authentication')) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Total Patients</h2>
            <p className="text-3xl text-emerald-500">{dashboardData?.totalPatients}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Total Doctors</h2>
            <p className="text-3xl text-emerald-500">{dashboardData?.totalDoctors}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Total Appointments</h2>
            <p className="text-3xl text-emerald-500">{dashboardData?.totalAppointments}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Appointments</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Doctor</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.recentAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-700">
                    <td className="py-3">{appointment.patientName}</td>
                    <td className="py-3">{appointment.doctorName}</td>
                    <td className="py-3">{appointment.date}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          appointment.status === 'confirmed'
                            ? 'bg-green-500/20 text-green-500'
                            : appointment.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-red-500/20 text-red-500'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 