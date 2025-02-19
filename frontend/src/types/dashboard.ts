export interface AdminDashboardData {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  recentAppointments: Array<{
    id: string;
    patientName: string;
    doctorName: string;
    date: string;
    status: 'pending' | 'confirmed' | 'cancelled';
  }>;
}

export interface Patient {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  lastVisit?: string;
  totalVisits?: number;
}

export interface DoctorDashboardData {
  totalPatients: number;
  totalAppointments: number;
  todayAppointments: Array<{
    id: string;
    patientName: string;
    time: string;
    status: string;
  }>;
  upcomingAppointments: Array<{
    id: string;
    patientName: string;
    date: string;
    time: string;
    status: string;
  }>;
}

export interface PatientDashboardData {
  upcomingAppointments: Array<{
    id: string;
    doctorName: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled';
  }>;
  pastAppointments: Array<{
    id: string;
    doctorName: string;
    date: string;
    time: string;
    status: 'completed' | 'cancelled';
  }>;
}

export interface Medicine {
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  medicines: Medicine[];
  notes?: string;
  prescribedDate?: Date;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  patientGrowth: number;
  doctorGrowth: number;
  appointmentGrowth: number;
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  type: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentAppointments: Appointment[];
} 