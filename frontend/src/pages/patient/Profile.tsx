import React, { useState, useEffect } from 'react';
import PatientDashboardLayout from '../../components/layouts/PatientDashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

const PatientProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/patients/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data.data); // Access the data property from the response
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white">My Profile</h1>
        
        {isLoading ? (
          <div className="text-gray-400">Loading profile...</div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium text-white mb-4">Personal Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400">Name</p>
                  <p className="text-white font-medium">{profile.name}</p>
                </div>
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="text-white font-medium">{profile.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="text-white font-medium">{profile.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400">Date of Birth</p>
                  <p className="text-white font-medium">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Gender</p>
                  <p className="text-white font-medium capitalize">{profile.gender}</p>
                </div>
                <div>
                  <p className="text-gray-400">Blood Group</p>
                  <p className="text-white font-medium">{profile.bloodGroup}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-medium text-white mb-4">Address</h2>
              <p className="text-white">{profile.address}</p>
            </div>

            {/* Emergency Contact */}
            {profile.emergencyContact && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-lg font-medium text-white mb-4">Emergency Contact</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400">Name</p>
                    <p className="text-white font-medium">{profile.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="text-white font-medium">{profile.emergencyContact.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Relationship</p>
                    <p className="text-white font-medium capitalize">{profile.emergencyContact.relationship}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-400">Failed to load profile</div>
        )}
      </div>
    </PatientDashboardLayout>
  );
};

export default PatientProfile; 