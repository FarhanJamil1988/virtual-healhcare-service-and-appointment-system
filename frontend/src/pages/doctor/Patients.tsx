import React, { useState, useEffect } from 'react';
import DoctorDashboardLayout from '../../components/layouts/DoctorDashboardLayout';
import { format } from 'date-fns';

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  lastVisit?: string;
  totalVisits: number;
}

const DoctorPatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/doctors/patients/list', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }

        const data = await response.json();
        setPatients(data.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <DoctorDashboardLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold text-white">My Patients</h1>

        {isLoading ? (
          <div className="text-gray-400">Loading patients...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {patients.map((patient) => (
              <div 
                key={patient._id}
                className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700"
              >
                <h3 className="text-white font-medium mb-3">{patient.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex flex-col space-y-1">
                    <p className="text-gray-400">
                      Email: {patient.email}
                    </p>
                    {patient.lastVisit && (
                      <p className="text-gray-400">
                        Last Visit: {format(new Date(patient.lastVisit), 'PPP')}
                      </p>
                    )}
                    <p className="text-gray-400">
                      Total Visits: {patient.totalVisits}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {patients.length === 0 && (
              <p className="text-gray-400 text-center py-4 col-span-full">No patients found</p>
            )}
          </div>
        )}
      </div>
    </DoctorDashboardLayout>
  );
};

export default DoctorPatients; 