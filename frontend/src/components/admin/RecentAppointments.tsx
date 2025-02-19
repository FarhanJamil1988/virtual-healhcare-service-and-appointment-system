import React from 'react';
import { Appointment } from '../../types/dashboard';
import { format } from 'date-fns';

interface RecentAppointmentsProps {
  appointments: Appointment[] | undefined;
}

const RecentAppointments: React.FC<RecentAppointmentsProps> = ({ appointments = [] }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Recent Appointments</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="pb-3 text-gray-400">Patient</th>
              <th className="pb-3 text-gray-400">Doctor</th>
              <th className="pb-3 text-gray-400">Date</th>
              <th className="pb-3 text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-b border-gray-700">
                <td className="py-3 text-white">{appointment.patientName}</td>
                <td className="py-3 text-white">{appointment.doctorName}</td>
                <td className="py-3 text-white">
                  {format(new Date(appointment.date), 'MMM dd, yyyy')}
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      appointment.status === 'completed'
                        ? 'bg-green-500/20 text-green-500'
                        : appointment.status === 'scheduled'
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
  );
};

export default RecentAppointments; 