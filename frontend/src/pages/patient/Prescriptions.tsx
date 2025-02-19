import React, { useState, useEffect } from 'react';
import PatientDashboardLayout from '../../components/layouts/PatientDashboardLayout';

import ViewPrescriptionModal from '../../components/modals/ViewPrescriptionModal';

interface Medicine {
  _id: string;
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
}

interface Appointment {
  _id: string;
  date: string;
  doctor: {
    name: string;
    specialization: string;
  };
  prescription?: {
    medicines: Medicine[];
    notes: string;
    prescribedDate: string;
  };
}

const PatientPrescriptions: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<{
    prescription: any;
    doctorName: string;
    appointmentDate: string;
  } | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }

        const data = await response.json();
        // Filter appointments to only show those with prescriptions
        const appointmentsWithPrescriptions = data.data.filter(
          (appointment: Appointment) => appointment.prescription && 
          appointment.prescription.medicines && 
          appointment.prescription.medicines.length > 0
        );
        setAppointments(appointmentsWithPrescriptions);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  console.log(appointments);
  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white">My Prescriptions</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-medium">Dr. {appointment.doctor.name}</h3>
                    <span className="text-gray-400 text-sm">
                      {appointment.doctor.specialization}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedPrescription({
                      prescription: appointment.prescription,
                      doctorName: appointment.doctor.name,
                      appointmentDate: appointment.date
                    })}
                    className="px-4 py-2 text-sm bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-colors"
                  >
                    View Full Prescription
                  </button>
                </div>

                {appointment.prescription && (
                  <>
                    <div className="grid gap-3 md:grid-cols-2">
                      {appointment.prescription.medicines.slice(0, 2).map((medicine) => (
                        <div key={medicine._id} className="bg-gray-700/30 p-3 rounded-lg">
                          <p className="text-white font-medium">{medicine.name}</p>
                          <p className="text-gray-400 text-sm mt-1">
                            {medicine.dosage} - {medicine.duration}
                          </p>
                          {medicine.instructions && (
                            <p className="text-gray-400 text-sm mt-1">
                              {medicine.instructions}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    {appointment.prescription.medicines.length > 2 && (
                      <p className="text-gray-400 text-sm mt-3">
                        +{appointment.prescription.medicines.length - 2} more medicines
                      </p>
                    )}
                    {appointment.prescription.notes && (
                      <p className="text-gray-400 text-sm mt-4 border-t border-gray-700 pt-4">
                        Notes: {appointment.prescription.notes}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Prescription Modal */}
        {selectedPrescription && (
          <ViewPrescriptionModal
            prescription={selectedPrescription.prescription}
            doctorName={selectedPrescription.doctorName}
            appointmentDate={selectedPrescription.appointmentDate}
            onClose={() => setSelectedPrescription(null)}
          />
        )}
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientPrescriptions; 