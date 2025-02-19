import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../components/layouts/AdminDashboardLayout';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  createdAt: string;
  appointments: number;
  lastAppointment?: string;
}

const AdminPatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/patients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      const data = await response.json();
      
      if (data.success) {
        setPatients(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch patients');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch patients');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm)
  );

  // Pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white mb-4">Patients</h1>
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg w-64"
            />
            <div className="text-gray-400">
              Total Patients: {patients.length}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-white">Loading...</div>
        ) : (
          <>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-white">Name</th>
                    <th className="px-6 py-3 text-white">Email</th>
                    <th className="px-6 py-3 text-white">Phone</th>
                    <th className="px-6 py-3 text-white">Gender</th>
                    <th className="px-6 py-3 text-white">Joined Date</th>
                    <th className="px-6 py-3 text-white">Total Appointments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentPatients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 text-white">{patient.name}</td>
                      <td className="px-6 py-4 text-gray-300">{patient.email}</td>
                      <td className="px-6 py-4 text-gray-300">{patient.phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {format(new Date(patient.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {patient.appointments || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminPatients; 