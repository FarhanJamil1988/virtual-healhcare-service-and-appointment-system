import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../components/layouts/AdminDashboardLayout';
import { toast } from 'react-hot-toast';

interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  recentAppointments: {
    _id: string;
    patient: { name: string };
    doctor: { name: string };
    date: string;
    status: string;
  }[];
  appointmentsByStatus: {
    pending: number;
    scheduled: number;
    completed: number;
    cancelled: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch dashboard statistics');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-white mb-6">Dashboard</h1>
        
        {isLoading ? (
          <div className="text-center text-white">Loading...</div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400">Total Patients</h3>
                <p className="text-2xl text-white">{stats.totalPatients}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400">Total Doctors</h3>
                <p className="text-2xl text-white">{stats.totalDoctors}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400">Total Appointments</h3>
                <p className="text-2xl text-white">{stats.totalAppointments}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-gray-400">Completed Appointments</h3>
                <p className="text-2xl text-white">{stats.appointmentsByStatus.completed}</p>
              </div>
            </div>

            {/* Appointment Status Breakdown */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl text-white mb-4">Appointment Status Breakdown</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="text-yellow-500">Pending</h4>
                  <p className="text-white">{stats.appointmentsByStatus.pending}</p>
                </div>
                <div>
                  <h4 className="text-blue-500">Scheduled</h4>
                  <p className="text-white">{stats.appointmentsByStatus.scheduled}</p>
                </div>
                <div>
                  <h4 className="text-green-500">Completed</h4>
                  <p className="text-white">{stats.appointmentsByStatus.completed}</p>
                </div>
                <div>
                  <h4 className="text-red-500">Cancelled</h4>
                  <p className="text-white">{stats.appointmentsByStatus.cancelled}</p>
                </div>
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl text-white mb-4">Recent Appointments</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-white">Patient</th>
                      <th className="px-4 py-2 text-white">Doctor</th>
                      <th className="px-4 py-2 text-white">Date</th>
                      <th className="px-4 py-2 text-white">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {stats.recentAppointments.map((appointment) => (
                      <tr key={appointment._id} className="text-gray-300">
                        <td className="px-4 py-2">{appointment.patient.name}</td>
                        <td className="px-4 py-2">{appointment.doctor.name}</td>
                        <td className="px-4 py-2">
                          {new Date(appointment.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`capitalize ${
                            appointment.status === 'completed' ? 'text-green-500' :
                            appointment.status === 'pending' ? 'text-yellow-500' :
                            appointment.status === 'scheduled' ? 'text-blue-500' :
                            'text-red-500'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500">Failed to load dashboard data</div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard; 