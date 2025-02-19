import React, { useState, useEffect } from 'react';
import { getServices } from '../../services/api';

const Register = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    if (role === 'doctor') {
      fetchServices();
    }
  }, [role]);

  return (
    <div>
      {role === 'doctor' && (
        <div className="space-y-2">
          <label className="block text-white">Services Offered</label>
          <div className="grid grid-cols-2 gap-2">
            {services.map((service) => (
              <label key={service._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={service._id}
                  checked={selectedServices.includes(service._id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedServices([...selectedServices, service._id]);
                    } else {
                      setSelectedServices(selectedServices.filter(id => id !== service._id));
                    }
                  }}
                  className="text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-white">{service.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register; 