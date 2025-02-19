import React from 'react';
import { DashboardStats as Stats } from '../../types/dashboard';

interface DashboardStatsProps {
  stats: Stats | undefined;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      icon: '👥',
      change: stats?.patientGrowth || 0,
      bgColor: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Doctors',
      value: stats?.totalDoctors || 0,
      icon: '👨‍⚕️',
      change: stats?.doctorGrowth || 0,
      bgColor: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Total Appointments',
      value: stats?.totalAppointments || 0,
      icon: '📅',
      change: stats?.appointmentGrowth || 0,
      bgColor: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Revenue',
      value: `$${stats?.revenue || 0}`,
      icon: '💰',
      change: stats?.revenueGrowth || 0,
      bgColor: 'from-yellow-500 to-yellow-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`bg-gradient-to-r ${stat.bgColor} rounded-lg p-6 text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-75">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className="text-3xl">{stat.icon}</div>
          </div>
          <div className="mt-4 text-sm">
            <span
              className={`${
                stat.change >= 0 ? 'text-green-300' : 'text-red-300'
              }`}
            >
              {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
            </span>
            <span className="opacity-75 ml-2">vs last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats; 