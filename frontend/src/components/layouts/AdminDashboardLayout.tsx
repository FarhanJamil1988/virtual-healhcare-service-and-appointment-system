import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Doctors', href: '/admin/doctors', icon: '👨‍⚕️' },
    { name: 'Patients', href: '/admin/patients', icon: '🏥' },
    { name: 'Appointments', href: '/admin/appointments', icon: '📅' },
    { name: 'Services', href: '/admin/services', icon: '🔧' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-800">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 bg-gray-900">
            <span className="text-white text-lg font-semibold">Admin Panel</span>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  isActive(item.href)
                    ? 'bg-gray-900 text-emerald-400'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4">
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-400 hover:bg-gray-700 rounded-lg"
            >
              <span className="mr-3">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout; 