import React, { useState, useEffect } from 'react';
import DoctorDashboardLayout from '../../components/layouts/DoctorDashboardLayout';


interface DoctorProfile {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  address: string;
  duration: number;
  isAvailable: boolean;
  workingHours: {
    start: string;
    end: string;
  };
  role: string;
  createdAt: string;
  updatedAt: string;
}

const DoctorProfile: React.FC = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DoctorProfile>>({});
  // const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        
        const response = await fetch(`http://localhost:5000/api/doctors/profile/${user?.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });


        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data.data);
        setFormData(data.data);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('workingHours.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [field]: value
        }
      }));
    } else if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUpdateSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const response = await fetch(`http://localhost:5000/api/doctors/profile/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setProfile(data.data);
      setUpdateSuccess(true);
      setIsEditing(false);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update profile');
    }
  };

  return (
    <DoctorDashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">My Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="text-gray-400">Loading profile...</div>
        ) : profile ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-4 md:p-6 col-span-1 md:col-span-2">
                <h2 className="text-lg font-medium text-white mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-gray-400 mb-2">Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
                      />
                    ) : (
                      <p className="text-white font-medium">{profile.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Email</label>
                    <p className="text-white font-medium">{profile.email}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber || ''}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
                      />
                    ) : (
                      <p className="text-white font-medium">{profile.phoneNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Specialization</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization || ''}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
                      />
                    ) : (
                      <p className="text-white font-medium">{profile.specialization}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Appointment Duration (minutes)</label>
                    {isEditing ? (
                      <select
                        name="duration"
                        value={formData.duration || ''}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
                      >
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="45">45</option>
                        <option value="60">60</option>
                      </select>
                    ) : (
                      <p className="text-white font-medium">{profile.duration} minutes</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Availability Status</label>
                    {isEditing ? (
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="isAvailable"
                          checked={formData.isAvailable}
                          onChange={handleInputChange}
                          className="form-checkbox text-emerald-500"
                        />
                        <span className="text-white">Available</span>
                      </label>
                    ) : (
                      <p className={`font-medium ${profile.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                        {profile.isAvailable ? 'Available' : 'Not Available'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 md:p-6">
                <h2 className="text-lg font-medium text-white mb-4">Working Hours</h2>
                {isEditing ? (
                  <div className="flex flex-col md:flex-row gap-4">
                    <div>
                      <label className="block text-gray-400 mb-2">Start Time</label>
                      <input
                        type="time"
                        name="workingHours.start"
                        value={formData.workingHours?.start || ''}
                        onChange={handleInputChange}
                        className="bg-gray-700 text-white rounded-lg px-4 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">End Time</label>
                      <input
                        type="time"
                        name="workingHours.end"
                        value={formData.workingHours?.end || ''}
                        onChange={handleInputChange}
                        className="bg-gray-700 text-white rounded-lg px-4 py-2"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-white text-sm">
                      {profile.workingHours.start} - {profile.workingHours.end}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-gray-800 rounded-lg p-4 md:p-6">
                <h2 className="text-lg font-medium text-white mb-4">Address</h2>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
                  />
                ) : (
                  <p className="text-white">{profile.address}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(profile);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}

            {error && (
              <div className="text-red-500 mt-4">{error}</div>
            )}

            {updateSuccess && (
              <div className="text-emerald-500 mt-4">Profile updated successfully!</div>
            )}
          </form>
        ) : (
          <div className="text-gray-400">Failed to load profile</div>
        )}
      </div>
    </DoctorDashboardLayout>
  );
};

export default DoctorProfile; 