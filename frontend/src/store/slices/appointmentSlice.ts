import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Appointment {
  id: string;
  name: string;
  service: string;
  date: string;
  time: string;
  email: string;
  phone: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(apt => apt.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    cancelAppointment: (state, action: PayloadAction<string>) => {
      const appointment = state.appointments.find(apt => apt.id === action.payload);
      if (appointment) {
        appointment.status = 'cancelled';
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addAppointment,
  updateAppointment,
  cancelAppointment,
  setLoading,
  setError,
} = appointmentSlice.actions;

export default appointmentSlice.reducer; 