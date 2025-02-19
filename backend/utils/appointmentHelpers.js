import User from '../models/User.js';

export const calculateAppointmentCost = async (patientId, servicePrice) => {
  const patient = await User.findById(patientId);
  
  if (!patient) {
    throw new Error('Patient not found');
  }

  // Check if patient still has free appointments
  if (patient.freeAppointmentsUsed < 3) {
    return {
      isFree: true,
      price: 0,
      remainingFreeAppointments: 2 - patient.freeAppointmentsUsed
    };
  }

  return {
    isFree: false,
    price: servicePrice,
    remainingFreeAppointments: 0
  };
};

export const updateAppointmentCount = async (patientId) => {
  const patient = await User.findById(patientId);
  
  if (!patient) {
    throw new Error('Patient not found');
  }

  patient.appointmentCount += 1;
  if (patient.freeAppointmentsUsed < 3) {
    patient.freeAppointmentsUsed += 1;
  }

  await patient.save();
  return patient;
}; 