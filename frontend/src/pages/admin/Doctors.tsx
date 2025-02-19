import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../components/layouts/AdminDashboardLayout';
import { toast } from 'react-hot-toast';

interface Doctor {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  isAvailable: boolean;
  appointments: number;
  createdAt: string;
}

const AdminDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(10);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }

      const data = await response.json();
      if (data.success) {
        setDoctors(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch doctors');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white mb-4">Doctors</h1>
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg w-64"
          />
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
                    <th className="px-6 py-3 text-white">Specialization</th>
                    <th className="px-6 py-3 text-white">Status</th>
                    <th className="px-6 py-3 text-white">Appointments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentDoctors.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 text-white">{doctor.name}</td>
                      <td className="px-6 py-4 text-gray-300">{doctor.email}</td>
                      <td className="px-6 py-4 text-gray-300">{doctor.specialization}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          doctor.isAvailable ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                          {doctor.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{doctor.appointments}</td>
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

export default AdminDoctors; 