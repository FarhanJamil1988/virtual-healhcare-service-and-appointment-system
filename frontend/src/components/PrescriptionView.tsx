import React from 'react';
import { Prescription } from '../types/dashboard';
import { format } from 'date-fns';

interface PrescriptionViewProps {
  prescription: Prescription;
}

const PrescriptionView: React.FC<PrescriptionViewProps> = ({ prescription }) => {
  return (
    <div className="space-y-4">
      <div className="border-t border-gray-700 pt-4">
        <h4 className="text-lg font-medium text-white mb-3">Prescription Details</h4>
        <div className="space-y-3">
          {prescription.medicines.map((medicine, index) => (
            <div key={index} className="bg-gray-700/30 p-3 rounded-lg">
              <p className="text-white font-medium">{medicine.name}</p>
              <div className="mt-1 space-y-1">
                <p className="text-gray-400 text-sm">Dosage: {medicine.dosage}</p>
                <p className="text-gray-400 text-sm">Duration: {medicine.duration}</p>
                <p className="text-gray-400 text-sm">Instructions: {medicine.instructions}</p>
              </div>
            </div>
          ))}
          
          {prescription.notes && (
            <div className="mt-3">
              <p className="text-gray-400 text-sm font-medium">Doctor's Notes:</p>
              <p className="text-white mt-1">{prescription.notes}</p>
            </div>
          )}
          
          {prescription.prescribedDate && (
            <p className="text-gray-400 text-sm mt-2">
              Prescribed on: {format(new Date(prescription.prescribedDate), 'PPP')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionView; 