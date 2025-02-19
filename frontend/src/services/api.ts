import { AdminDashboardData, DoctorDashboardData, PatientDashboardData } from '../types/dashboard';

const API_URL = 'http://localhost:5000/api';

export const fetchDashboardData = async (role: 'admin' | 'doctor' | 'patient') => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_URL}/${role}/dashboard`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch dashboard data');
  }

  const data = await response.json();
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

export const fetchServices = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_URL}/services`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch services');
  }

  const data = await response.json();

  return data;
};

export const getDoctors = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/admin/doctors`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) throw new Error('Failed to fetch doctors');
  return response.json();
};

export const getPatients = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/admin/patients`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) throw new Error('Failed to fetch patients');
  return response.json();
};

export const getAppointments = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/admin/appointments`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) throw new Error('Failed to fetch appointments');
  return response.json();
};

export const getDashboardStats = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/admin/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  console.log(response);
  if (!response.ok) throw new Error('Failed to fetch dashboard stats');
  return response.json();
};

export const deleteDoctor = async (id: string) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) throw new Error('Failed to delete doctor');
  return response.json();
};

export const createService = async (serviceData: {
  name: string;
  description: string;
  duration: number;
  price: number;
}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/services`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData)
  });
  if (!response.ok) throw new Error('Failed to create service');
  return response.json();
};

export const deleteService = async (id: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/services/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) throw new Error('Failed to delete service');
  return response.json();
};

export const getServices = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/services`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) throw new Error('Failed to fetch services');
  return response.json();
}; 