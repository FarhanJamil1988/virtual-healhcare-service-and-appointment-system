import React from 'react';
import { Prescription } from '../../types/dashboard';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ViewPrescriptionModalProps {
  prescription: Prescription;
  doctorName: string;
  appointmentDate: string;
  onClose: () => void;
}

const ViewPrescriptionModal: React.FC<ViewPrescriptionModalProps> = ({
  prescription,
  doctorName,
  appointmentDate,
  onClose
}) => {
  const navigate = useNavigate();

  const handleBuyMedicine = () => {
    onClose(); // Close the modal first
    navigate('/patient/buy-medicine'); // Navigate to the work in progress page
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Prescription Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="border-b border-gray-700 pb-4">
            <p className="text-gray-400">Prescribed by: <span className="text-white">Dr. {doctorName}</span></p>
            <p className="text-gray-400">Appointment Date: <span className="text-white">{format(new Date(appointmentDate), 'PPP')}</span></p>
          </div>

          <div className="space-y-4">
            {prescription.medicines.map((medicine, index) => (
              <div key={index} className="bg-gray-700/30 p-4 rounded-xl">
                <h4 className="text-white font-medium text-lg mb-2">{medicine.name}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Dosage</p>
                    <p className="text-white">{medicine.dosage}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Duration</p>
                    <p className="text-white">{medicine.duration}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400 text-sm">Instructions</p>
                    <p className="text-white">{medicine.instructions}</p>
                  </div>
                </div>
              </div>
            ))}

            {prescription.notes && (
              <div className="mt-6">
                <h4 className="text-white font-medium mb-2">Additional Notes</h4>
                <p className="text-gray-300">{prescription.notes}</p>
              </div>
            )}
          </div>
        </div>
        <button 
          onClick={handleBuyMedicine}
          className='bg-blue-500 hover:bg-blue-600 transition-colors text-white px-4 mt-4 cursor-pointer py-2 rounded-md'
        >
          Buy The Medicine
        </button>
      </div>
    </div>
  );
};

export default ViewPrescriptionModal; 