import React, { useState, useEffect } from 'react';
import DoctorDashboardLayout from '../../components/layouts/DoctorDashboardLayout';
import { format } from 'date-fns';
import ViewPrescriptionModal from '../../components/modals/ViewPrescriptionModal';
import { toast } from 'react-hot-toast';
import PrescriptionModal from '../../components/modals/PrescriptionModal';

interface Appointment {
  _id: string;
  patientName: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
  prescription?: {
    medicines: Array<{
      name: string;
      dosage: string;
      duration: string;
      instructions: string;
    }>;
    notes: string;
    prescribedDate: string;
  };
}

interface Medicine {
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
}

interface PrescriptionFormProps {
  appointment: Appointment;
  onClose: () => void;
  onSubmit: () => void;
  isEdit?: boolean;
}

const DoctorAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPrescription, setSelectedPrescription] = useState<{
    prescription: any;
    patientName: string;
    appointmentDate: string;
  } | null>(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [prescriptionData, setPrescriptionData] = useState({
    medicines: [{ name: '', dosage: '', duration: '', instructions: '' }],
    notes: ''
  });
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
  
      const response = await fetch(`http://localhost:5000/api/doctors/appointments/list`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      if (data.success) {
        // Sort appointments by date and time (most recent first)
        const sortedAppointments = data.data.sort((a: Appointment, b: Appointment) => {
          return new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime();
        });
        setAppointments(sortedAppointments);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/doctors/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update appointment status');
      }

      if (data.success) {
        toast.success('Appointment status updated successfully');
        fetchAppointments(); // Refresh the appointments list
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update appointment status';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddMedicine = () => {
    setPrescriptionData(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', duration: '', instructions: '' }]
    }));
  };

  const handleRemoveMedicine = (index: number) => {
    setPrescriptionData(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  const handlePrescriptionSubmit = async () => {
    try {
      if (!selectedAppointment) return;

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/doctors/appointments/${selectedAppointment._id}/prescription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          medicines: prescriptionData.medicines,
          notes: prescriptionData.notes
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add prescription');
      }

      if (data.success) {
        toast.success('Prescription added successfully');
        fetchAppointments();
        setShowPrescriptionForm(false);
        setSelectedAppointment(null);
        setPrescriptionData({
          medicines: [{ name: '', dosage: '', duration: '', instructions: '' }],
          notes: ''
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add prescription';
      toast.error(errorMessage);
      console.error('Prescription error:', err);
    }
  };

  const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
    appointment,
    onClose,
    onSubmit,
    isEdit = false
  }) => {
    const [medicines, setMedicines] = useState<Medicine[]>(
      isEdit && appointment.prescription 
        ? appointment.prescription.medicines 
        : [{ name: '', dosage: '', duration: '', instructions: '' }]
    );
    const [notes, setNotes] = useState(
      isEdit && appointment.prescription ? appointment.prescription.notes : ''
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        
        // Determine if the appointment already has a prescription
        const hasPrescription = appointment.prescription && 
                              appointment.prescription.medicines && 
                              appointment.prescription.medicines.length > 0;

        // Use POST for new prescriptions, PUT for updates
        const method = hasPrescription ? 'PUT' : 'POST';
        
        const response = await fetch(
          `http://localhost:5000/api/doctors/appointments/${appointment._id}/prescription`, 
          {
            method,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ medicines, notes })
          }
        );

        if (!response.ok) {
          throw new Error('Failed to save prescription');
        }

        onSubmit();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {isEdit ? 'Update Prescription' : 'Write Prescription'}
                </h2>
                <p className="text-gray-400">Patient: {appointment.patientName}</p>
                <p className="text-gray-400">
                  Date: {format(new Date(appointment.date), 'PPP')}
                </p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {medicines.map((medicine, index) => (
                <div key={index} className="space-y-4 p-4 bg-gray-700/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-medium">Medicine {index + 1}</h3>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => setMedicines(medicines.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-400"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={medicine.name}
                      onChange={(e) => {
                        const newMedicines = [...medicines];
                        newMedicines[index].name = e.target.value;
                        setMedicines(newMedicines);
                      }}
                      placeholder="Medicine Name"
                      className="bg-gray-700 text-white rounded-lg px-4 py-2"
                      required
                    />
                    <input
                      type="text"
                      value={medicine.dosage}
                      onChange={(e) => {
                        const newMedicines = [...medicines];
                        newMedicines[index].dosage = e.target.value;
                        setMedicines(newMedicines);
                      }}
                      placeholder="Dosage"
                      className="bg-gray-700 text-white rounded-lg px-4 py-2"
                      required
                    />
                    <input
                      type="text"
                      value={medicine.duration}
                      onChange={(e) => {
                        const newMedicines = [...medicines];
                        newMedicines[index].duration = e.target.value;
                        setMedicines(newMedicines);
                      }}
                      placeholder="Duration"
                      className="bg-gray-700 text-white rounded-lg px-4 py-2"
                      required
                    />
                    <input
                      type="text"
                      value={medicine.instructions}
                      onChange={(e) => {
                        const newMedicines = [...medicines];
                        newMedicines[index].instructions = e.target.value;
                        setMedicines(newMedicines);
                      }}
                      placeholder="Instructions"
                      className="bg-gray-700 text-white rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setMedicines([...medicines, { name: '', dosage: '', duration: '', instructions: '' }])}
                className="text-emerald-500 hover:text-emerald-400"
              >
                + Add Medicine
              </button>

              <div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional Notes"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 h-32"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-500/10 text-blue-500';
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const sortedAppointments = appointments
    .filter(appointment => appointment.status !== 'cancelled')
    .sort((a, b) => {
      // First, sort by status (scheduled first)
      if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
      if (a.status !== 'scheduled' && b.status === 'scheduled') return 1;

      // Then sort by date (most recent first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const handlePrescriptionClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionForm(true);
  };

  return (
    <DoctorDashboardLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-white">Appointments</h1>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-gray-400">Loading appointments...</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {sortedAppointments.map((appointment) => (
                <div 
                  key={appointment._id}
                  className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700"
                >
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-white font-medium">{appointment.patientName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      <p>Date: {format(new Date(appointment.date), 'PPP')}</p>
                      <p>Time: {appointment.time}</p>
                    </div>

                    <div className="mt-2 space-y-1">
                      {appointment.notes && (
                        <p className="text-gray-400 text-sm">
                          Notes: {appointment.notes}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 space-y-2">
                      {appointment.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(appointment._id, 'scheduled')}
                          className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
                        >
                          Accept Appointment
                        </button>
                      )}
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => handleStatusChange(appointment._id, 'completed')}
                          className="w-full bg-emerald-600 text-white rounded py-2 hover:bg-emerald-700 transition"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>

                    {appointment.status === 'completed' && (
                      <button
                        onClick={() => handlePrescriptionClick(appointment)}
                        className="mt-4 w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
                      >
                        {appointment.prescription ? 'Update Prescription' : 'Add Prescription'}
                      </button>
                    )}

                    {appointment.prescription && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-white font-medium">Prescription</h4>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setShowPrescriptionForm(true);
                              }}
                              className="text-emerald-500 hover:text-emerald-400 text-sm"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                        {appointment.prescription && (
                          <div className="grid gap-3 md:grid-cols-2">
                            {appointment.prescription.medicines.slice(0, 2).map((medicine, index) => (
                              <div key={index} className="bg-gray-700/30 p-3 rounded-lg">
                                <p className="text-white font-medium">{medicine.name}</p>
                                <p className="text-gray-400 text-sm mt-1">
                                  {medicine.dosage} - {medicine.duration}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showPrescriptionForm && selectedAppointment && (
          <PrescriptionModal
            appointmentId={selectedAppointment._id}
            existingPrescription={selectedAppointment.prescription}
            onClose={() => {
              setShowPrescriptionForm(false);
              setSelectedAppointment(null);
            }}
            onUpdate={fetchAppointments}
          />
        )}

        {/* View Prescription Modal */}
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

export default DoctorAppointments; 