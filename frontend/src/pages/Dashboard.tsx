// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { format } from 'date-fns';
// import { RootState } from '../store';
// import Navbar from '../components/Navbar';
// import { Appointment } from '../types';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import RescheduleModal from '../components/appointments/RescheduleModal';

// const Dashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'profile'>('upcoming');
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
//   const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/appointments', {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`
//           }
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch appointments');
//         }

//         const data = await response.json();
//         setAppointments(data.data);
//         setIsLoading(false);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
//         setIsLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, []);

//   const upcomingAppointments = appointments.filter(
//     apt => apt.status === 'scheduled' && new Date(apt.date) >= new Date()
//   );

//   const pastAppointments = appointments.filter(
//     apt => apt.status === 'completed' || new Date(apt.date) < new Date()
//   );

//   const stats = {
//     total: appointments.length,
//     upcoming: upcomingAppointments.length,
//     completed: appointments.filter(apt => apt.status === 'completed').length,
//     cancelled: appointments.filter(apt => apt.status === 'cancelled').length
//   };

//   const handleReschedule = (appointment: Appointment) => {
//     setSelectedAppointment(appointment);
//     setIsRescheduleModalOpen(true);
//   };

//   const handleCancel = async (appointmentId: string) => {
//     if (!window.confirm('Are you sure you want to cancel this appointment?')) {
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to cancel appointment');
//       }

//       setAppointments(prevAppointments => 
//         prevAppointments.map(apt => 
//           apt._id === appointmentId 
//             ? { ...apt, status: 'cancelled' }
//             : apt
//         )
//       );

//       toast.success('Appointment cancelled successfully');
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : 'Failed to cancel appointment');
//     }
//   };

//   const handleRescheduleSubmit = async (appointmentId: string, newDate: string, newTime: string) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ 
//           date: newDate,
//           time: newTime
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Failed to reschedule appointment');
//       }

//       const updatedAppointment = await response.json();

//       setAppointments(prevAppointments =>
//         prevAppointments.map(apt =>
//           apt._id === appointmentId
//             ? { ...apt, date: newDate, time: newTime }
//             : apt
//         )
//       );

//       setIsRescheduleModalOpen(false);
//       setSelectedAppointment(null);
//       toast.success('Appointment rescheduled successfully');
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : 'Failed to reschedule appointment');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
//       <Navbar />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
//         {/* Dashboard Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Patient Dashboard</h1>
//             <p className="mt-2 text-gray-400">Manage your appointments and profile</p>
//           </div>
//           <div className="mt-4 md:mt-0">
//             <button
//               onClick={() => navigate('/appointment')}
//               className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
//             >
//               New Appointment
//             </button>
//           </div>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <StatCard title="Total Appointments" value={stats.total} icon="📅" />
//           <StatCard title="Upcoming" value={stats.upcoming} icon="⏳" color="emerald" />
//           <StatCard title="Completed" value={stats.completed} icon="✅" color="blue" />
//           <StatCard title="Cancelled" value={stats.cancelled} icon="❌" color="red" />
//         </div>

//         {/* Appointments List */}
//         {isLoading ? (
//           <div className="text-center text-gray-400">Loading appointments...</div>
//         ) : error ? (
//           <div className="text-center text-red-500">{error}</div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//               {activeTab === 'upcoming' && (
//                 <AppointmentList
//                   title="Upcoming Appointments"
//                   appointments={upcomingAppointments}
//                   type="upcoming"
//                   onReschedule={handleReschedule}
//                   onCancel={handleCancel}
//                 />
//               )}
//               {activeTab === 'past' && (
//                 <AppointmentList
//                   title="Past Appointments"
//                   appointments={pastAppointments}
//                   type="past"
//                 />
//               )}
//               {activeTab === 'profile' && <ProfileSection />}
//             </div>

//             {/* Recent Activity */}
//             <div className="lg:col-span-1">
//               <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
//                 <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
//                 <div className="space-y-4">
//                   {appointments.slice(0, 5).map((appointment) => (
//                     <div
//                       key={appointment._id}
//                       className="p-4 bg-gray-700/30 rounded-xl"
//                     >
//                       <h3 className="text-white font-medium">
//                         Dr. {appointment.doctor.name}
//                       </h3>
//                       <p className="text-gray-400 text-sm mt-1">
//                         {format(new Date(appointment.date), 'PPP')} at {appointment.time}
//                       </p>
//                       <span className={`
//                         inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium
//                         ${appointment.status === 'scheduled' ? 'bg-emerald-500/10 text-emerald-500' : ''}
//                         ${appointment.status === 'completed' ? 'bg-blue-500/10 text-blue-500' : ''}
//                         ${appointment.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : ''}
//                       `}>
//                         {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//       {isRescheduleModalOpen && selectedAppointment && (
//         <RescheduleModal
//           appointment={selectedAppointment}
//           onClose={() => {
//             setIsRescheduleModalOpen(false);
//             setSelectedAppointment(null);
//           }}
//           onSubmit={handleRescheduleSubmit}
//         />
//       )}
//     </div>
//   );
// };

// interface AppointmentListProps {
//   title: string;
//   appointments: Appointment[];
//   type: 'upcoming' | 'past';
//   onReschedule?: (appointment: Appointment) => void;
//   onCancel?: (appointmentId: string) => void;
// }

// const AppointmentList: React.FC<AppointmentListProps> = ({ title, appointments, type, onReschedule, onCancel }) => {
//   return (
//     <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
//       <h2 className="text-xl font-semibold text-white mb-6">{title}</h2>
//       {appointments.length === 0 ? (
//         <p className="text-gray-400 text-center py-8">No appointments found</p>
//       ) : (
//         <div className="space-y-4">
//           {appointments.map((appointment) => (
//             <div
//               key={appointment._id}
//               className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-emerald-500/50 transition-all duration-300"
//             >
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-lg font-medium text-white">
//                     {appointment.service}
//                   </h3>
//                   <p className="text-gray-400 mt-1">
//                     {appointment.date} at {appointment.time}
//                   </p>
//                   <div className="mt-2">
//                     <span
//                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
//                         ${
//                           appointment.status === 'confirmed'
//                             ? 'bg-green-100 text-green-800'
//                             : appointment.status === 'cancelled'
//                             ? 'bg-red-100 text-red-800'
//                             : 'bg-yellow-100 text-yellow-800'
//                         }
//                       `}
//                     >
//                       {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
//                     </span>
//                   </div>
//                 </div>
//                 {type === 'upcoming' && appointment.status === 'scheduled' && (
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => onReschedule?.(appointment)}
//                       className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
//                     >
//                       Reschedule
//                     </button>
//                     <button
//                       onClick={() => onCancel?.(appointment._id)}
//                       className="text-red-400 hover:text-red-300 text-sm font-medium"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const ProfileSection: React.FC = () => {
//   return (
//     <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
//       <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
//       <div className="space-y-6">
//         <div className="flex items-center">
//           <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
//             JD
//           </div>
//           <div className="ml-6">
//             <h3 className="text-lg font-medium text-white">John Doe</h3>
//             <p className="text-gray-400">Patient ID: #12345</p>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <ProfileField label="Email" value="john.doe@example.com" />
//           <ProfileField label="Phone" value="+1 234 567 890" />
//           <ProfileField label="Date of Birth" value="January 1, 1990" />
//           <ProfileField label="Address" value="123 Main St, City, Country" />
//         </div>
//         <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors w-full">
//           Edit Profile
//         </button>
//       </div>
//     </div>
//   );
// };

// interface StatCardProps {
//   title: string;
//   value: number;
//   icon: string;
//   color?: 'emerald' | 'blue' | 'red';
// }

// const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
//   const textColor = color ? `text-${color}-500` : 'text-white';
  
//   return (
//     <div className="bg-gray-800/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-700">
//       <div className="flex items-center justify-between">
//         <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
//         <span className="text-2xl">{icon}</span>
//       </div>
//       <p className={`text-2xl font-semibold mt-2 ${textColor}`}>{value}</p>
//     </div>
//   );
// };

// interface ProfileFieldProps {
//   label: string;
//   value: string;
// }

// const ProfileField: React.FC<ProfileFieldProps> = ({ label, value }) => {
//   return (
//     <div className="bg-gray-800 rounded-lg p-4">
//       <p className="text-gray-400 text-sm mb-1">{label}</p>
//       <p className="text-white">{value}</p>
//     </div>
//   );
// };

// export default Dashboard; 