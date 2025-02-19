import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../components/layouts/AdminDashboardLayout';
import { getServices, createService, deleteService } from '../../services/api';

interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0
  });
  const [showForm, setShowForm] = useState(false);

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      setError('Failed to fetch services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createService(newService);
      setShowForm(false);
      setNewService({ name: '', description: '', duration: 30, price: 0 });
      fetchServices();
    } catch (error) {
      setError('Failed to create service');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        fetchServices();
      } catch (error) {
        setError('Failed to delete service');
      }
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">Manage Services</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
          >
            Add New Service
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-gray-800 rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Service Name</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Description</label>
                <textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Price</label>
                  <input
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
                >
                  Create Service
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service._id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-400 mt-2">{service.description}</p>
                <div className="mt-4 flex justify-between text-sm text-gray-300">
                  <span>{service.duration} minutes</span>
                  <span>৳ {service.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminServices; 