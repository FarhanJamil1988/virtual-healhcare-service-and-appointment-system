import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Medicine {
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
}

interface PrescriptionModalProps {
  appointmentId: string;
  existingPrescription?: {
    medicines: Medicine[];
    notes: string;
  };
  onClose: () => void;
  onUpdate: () => void;
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  appointmentId,
  existingPrescription,
  onClose,
  onUpdate
}) => {
  const [medicines, setMedicines] = useState<Medicine[]>(
    existingPrescription?.medicines || [{
      name: '',
      dosage: '',
      duration: '',
      instructions: ''
    }]
  );
  const [notes, setNotes] = useState(existingPrescription?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', duration: '', instructions: '' }]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: keyof Medicine, value: string) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const method = existingPrescription ? 'PUT' : 'POST';
      
      // Update the endpoints to match the backend routes
      const endpoint = existingPrescription 
        ? `/api/doctors/appointments/${appointmentId}/prescription`  // Changed endpoint for PUT
        : `/api/doctors/appointments/${appointmentId}/prescription`; // Same endpoint for POST

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          medicines: medicines.map(med => ({
            name: med.name,
            dosage: med.dosage,
            duration: med.duration,
            instructions: med.instructions
          })),
          notes
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to handle prescription');
      }

      const data = await response.json();
      
      toast.success(existingPrescription ? 'Prescription updated successfully' : 'Prescription added successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Prescription error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to handle prescription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Add Prescription</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto max-h-[80vh]">
          {medicines.map((medicine, index) => (
            <div key={index} className="space-y-4 p-4 bg-gray-700/30 rounded-xl">
              <div className="flex justify-between items-center">
                <h4 className="text-white font-medium">Medicine {index + 1}</h4>
                {medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicine(index)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Medicine Name</label>
                  <input
                    type="text"
                    value={medicine.name}
                    onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                    className="mt-1 w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Dosage</label>
                  <input
                    type="text"
                    value={medicine.dosage}
                    onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                    className="mt-1 w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Duration</label>
                  <input
                    type="text"
                    value={medicine.duration}
                    onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                    className="mt-1 w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Instructions</label>
                  <input
                    type="text"
                    value={medicine.instructions}
                    onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                    className="mt-1 w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddMedicine}
            className="text-emerald-500 hover:text-emerald-400"
          >
            + Add Another Medicine
          </button>

          <div>
            <label className="block text-sm font-medium text-gray-300">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white min-h-[100px]"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal; 