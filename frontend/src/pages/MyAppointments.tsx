import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { RootState } from '../store';
import { updateAppointment, cancelAppointment } from '../store/slices/appointmentSlice';
import Navbar from '../components/Navbar';

const MyAppointments: React.FC = () => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state: RootState) => state.appointments);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  // Get the date of the most recent appointment, or today if no appointments
  const mostRecentAppointmentDate = appointments.length > 0
    ? new Date(appointments[0].date)
    : new Date();

  const [selectedDate, setSelectedDate] = useState(mostRecentAppointmentDate);

  // Filter appointments based on selected date
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = format(new Date(appointment.date), 'yyyy-MM-dd');
    const filterDate = format(selectedDate, 'yyyy-MM-dd');
    return appointmentDate === filterDate;
  });

  const handleCancel = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      dispatch(cancelAppointment(appointmentId));
    }
  };

  const handleReschedule = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    setIsRescheduleModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-white">My Appointments</h1>
            <div className="bg-gray-700 rounded-lg px-4 py-2">
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="bg-transparent text-gray-300 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No appointments scheduled for {format(selectedDate, 'MMMM dd, yyyy')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Name</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Service</th>
                    
                    {/* <th className="text-left py-4 px-4 text-gray-400 font-medium">Status</th>  */}
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Time</th>
                    <th className="text-right py-4 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-b border-gray-700/50 hover:bg-gray-700/20"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white font-medium">{appointment.name}</p>
                        
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white">{appointment.service}</p>
                         
                        </div>
                      </td>
                      <td>
                          <div>
                          <p className="text-sm text-gray-400">{appointment.time}</p>
                          </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                              appointment.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : appointment.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          `}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleReschedule(appointment.id)}
                          disabled={appointment.status === 'cancelled'}
                          className="text-emerald-400 hover:text-emerald-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          disabled={appointment.status === 'cancelled'}
                          className="ml-4 text-red-400 hover:text-red-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && selectedAppointment && (
        <RescheduleModal
          appointment={appointments.find(apt => apt.id === selectedAppointment)!}
          onClose={() => setIsRescheduleModalOpen(false)}
          onSave={(updatedAppointment) => {
            dispatch(updateAppointment(updatedAppointment));
            setIsRescheduleModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// Add this component at the bottom of the file
const RescheduleModal: React.FC<{
  appointment: any;
  onClose: () => void;
  onSave: (appointment: any) => void;
}> = ({ appointment, onClose, onSave }) => {
  const [newDate, setNewDate] = useState(appointment.date);
  const [newTime, setNewTime] = useState(appointment.time);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Reschedule Appointment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({
              ...appointment,
              date: newDate,
              time: newTime,
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300">New Date</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">New Time</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyAppointments; 