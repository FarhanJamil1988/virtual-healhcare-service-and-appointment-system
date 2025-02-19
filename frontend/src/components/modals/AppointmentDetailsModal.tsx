import React, { useState } from 'react';
import { Appointment } from '../../types/dashboard';
import { format } from 'date-fns';
import PrescriptionModal from './PrescriptionModal';

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  onClose: () => void;
  onUpdate: () => void;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({ 
  appointment, 
  onClose,
  onUpdate
}) => {
  const [showPrescription, setShowPrescription] = useState(false);

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

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-gray-400">Patient Name:</div>
            <div className="text-white">{appointment.patient.name}</div>
            
            <div className="text-gray-400">Date:</div>
            <div className="text-white">{format(new Date(appointment.date), 'PPP')}</div>
            
            <div className="text-gray-400">Time:</div>
            <div className="text-white">{appointment.time}</div>
            
            <div className="text-gray-400">Status:</div>
            <div className="text-white capitalize">{appointment.status}</div>
            
            <div className="text-gray-400">Contact:</div>
            <div className="text-white">{appointment.patient.email}</div>
            
            {appointment.patient.phoneNumber && (
              <>
                <div className="text-gray-400">Phone:</div>
                <div className="text-white">{appointment.patient.phoneNumber}</div>
              </>
            )}
          </div>

          {/* Show existing prescription if it exists */}
          {appointment.prescription && appointment.prescription.medicines && (
            <div className="mt-4 border-t border-gray-700 pt-4">
              <h4 className="text-lg font-medium text-white mb-3">Prescription</h4>
              <div className="space-y-4">
                {appointment.prescription.medicines.map((medicine, index) => (
                  <div key={index} className="bg-gray-700/30 p-3 rounded-lg">
                    <p className="text-white font-medium">{medicine.name}</p>
                    <p className="text-gray-400 text-sm">Dosage: {medicine.dosage}</p>
                    <p className="text-gray-400 text-sm">Duration: {medicine.duration}</p>
                    <p className="text-gray-400 text-sm">Instructions: {medicine.instructions}</p>
                  </div>
                ))}
                {appointment.prescription.notes && (
                  <div className="mt-2">
                    <p className="text-gray-400">Additional Notes:</p>
                    <p className="text-white">{appointment.prescription.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Show Add/Edit Prescription button only for completed appointments */}
        {appointment.status === 'completed' && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowPrescription(true)}
              className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-500/20 transition-colors"
            >
              {appointment.prescription ? 'Edit Prescription' : 'Add Prescription'}
            </button>
          </div>
        )}

        {/* Prescription Modal */}
        {showPrescription && (
          <PrescriptionModal
            appointmentId={appointment._id}
            onClose={() => setShowPrescription(false)}
            onUpdate={onUpdate}
            existingPrescription={appointment.prescription}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailsModal; 