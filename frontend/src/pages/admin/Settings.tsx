import React, { useState } from 'react';
import AdminDashboardLayout from '../../components/layouts/AdminDashboardLayout';

const AdminSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white">Settings</h1>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Email Notifications</h3>
                <p className="text-gray-400 text-sm">Receive email notifications for new appointments</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">SMS Notifications</h3>
                <p className="text-gray-400 text-sm">Receive SMS alerts for urgent updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">System Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">
                Appointment Duration (minutes)
              </label>
              <input
                type="number"
                className="bg-gray-700 text-white px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                defaultValue={30}
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2">
                Working Hours
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  defaultValue="09:00"
                />
                <input
                  type="time"
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  defaultValue="17:00"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600">
            Save Changes
          </button>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminSettings; 