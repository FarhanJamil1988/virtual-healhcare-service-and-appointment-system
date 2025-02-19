import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { RootState } from '../store';
import { updateAppointment, cancelAppointment } from '../store/slices/appointmentSlice';
import Navbar from '../components/Navbar';

const services = [
  { id: 1, name: 'Teeth Cleaning', duration: 60 },
  { id: 2, name: 'Dental Checkup', duration: 30 },
  { id: 3, name: 'Root Canal', duration: 90 },
  { id: 4, name: 'Teeth Whitening', duration: 45 },
  { id: 5, name: 'Dental Crown', duration: 120 },
];

const DoctorDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { appointments } = useSelector((state: RootState) => state.appointments);

  // Filter appointments based on search term and filters
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = 
      apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const aptDate = new Date(apt.date);
      const today = new Date();
      switch (dateFilter) {
        case 'today':
          return format(aptDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
        case 'upcoming':
          return aptDate > today;
        case 'past':
          return aptDate < today;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewDetails = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    setIsViewModalOpen(true);
  };

  const handleEdit = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    setIsEditModalOpen(true);
  };

  const handleCancel = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      dispatch(cancelAppointment(appointmentId));
    }
  };

  const handleStatusChange = (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'pending') => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      dispatch(updateAppointment({
        ...appointment,
        status: newStatus
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Doctor Dashboard</h1>
            <p className="mt-2 text-gray-400">Manage patient appointments and schedules</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
              Add Appointment
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search patients or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Patient</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Service</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Date & Time</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Status</th>
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
                        <p className="text-sm text-gray-400">{appointment.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white font-medium">{appointment.service}</p>
                        <p className="text-sm text-gray-400">
                          {services.find(s => s.name === appointment.service)?.duration || 30} mins
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white">{appointment.date}</p>
                        <p className="text-sm text-gray-400">{appointment.time}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment.id, e.target.value as any)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-emerald-500
                          ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : appointment.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        `}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleViewDetails(appointment.id)}
                          className="text-emerald-400 hover:text-emerald-300"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleEdit(appointment.id)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Details Modal */}
        {isViewModalOpen && selectedAppointment && (
          <ViewDetailsModal
            appointment={appointments.find(apt => apt.id === selectedAppointment)!}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}

        {/* Edit Modal */}
        {isEditModalOpen && selectedAppointment && (
          <EditAppointmentModal
            appointment={appointments.find(apt => apt.id === selectedAppointment)!}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(updatedAppointment) => {
              dispatch(updateAppointment(updatedAppointment));
              setIsEditModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Add these components at the bottom of the file
const ViewDetailsModal: React.FC<{
  appointment: any;
  onClose: () => void;
}> = ({ appointment, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Appointment Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          <DetailRow label="Patient Name" value={appointment.name} />
          <DetailRow label="Service" value={appointment.service} />
          <DetailRow label="Date" value={appointment.date} />
          <DetailRow label="Time" value={appointment.time} />
          <DetailRow label="Email" value={appointment.email} />
          <DetailRow label="Phone" value={appointment.phone} />
          <DetailRow label="Status" value={appointment.status} />
          {appointment.notes && (
            <DetailRow label="Notes" value={appointment.notes} />
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-white">{value}</p>
  </div>
);

const EditAppointmentModal: React.FC<{
  appointment: any;
  onClose: () => void;
  onSave: (appointment: any) => void;
}> = ({ appointment, onClose, onSave }) => {
  const [editedAppointment, setEditedAppointment] = useState(appointment);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Edit Appointment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(editedAppointment);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300">Date</label>
            <input
              type="date"
              value={editedAppointment.date}
              onChange={(e) => setEditedAppointment({ ...editedAppointment, date: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Time</label>
            <input
              type="time"
              value={editedAppointment.time}
              onChange={(e) => setEditedAppointment({ ...editedAppointment, time: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Notes</label>
            <textarea
              value={editedAppointment.notes || ''}
              onChange={(e) => setEditedAppointment({ ...editedAppointment, notes: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white min-h-[100px]"
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

export default DoctorDashboard; 