import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Appointment } from '../../types/dashboard';
import PrescriptionView from '../PrescriptionView';

interface PatientHistoryModalProps {
  patientId: string;
  onClose: () => void;
}

const PatientHistoryModal: React.FC<PatientHistoryModalProps> = ({ patientId, onClose }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/doctors/patients/${patientId}/history`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch patient history');
        }

        const data = await response.json();
        setAppointments(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load patient history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientHistory();
  }, [patientId]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full border border-gray-700 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Patient History</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="text-gray-400 text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-gray-700/30 rounded-xl p-6 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">
                      {format(new Date(appointment.date), 'PPP')} at {appointment.time}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Status: <span className={`
                        capitalize px-2 py-0.5 rounded-full text-sm
                        ${appointment.status === 'scheduled' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                        ${appointment.status === 'completed' ? 'bg-blue-500/10 text-blue-500' : ''}
                        ${appointment.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : ''}
                        ${appointment.status === 'no-show' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                      `}>
                        {appointment.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Show prescription for completed appointments */}
                {appointment.status === 'completed' && appointment.prescription && (
                  <PrescriptionView prescription={appointment.prescription} />
                )}
              </div>
            ))}
            {appointments.length === 0 && (
              <p className="text-gray-400 text-center py-4">No appointment history found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHistoryModal; 