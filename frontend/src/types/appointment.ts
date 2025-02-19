export interface Appointment {
  _id: string;
  patient: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  doctor: {
    _id: string;
    name: string;
    specialization?: string;
  };
  service: {
    _id: string;
    name: string;
    price?: number;
  };
  date: string;
  time: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  patientNotes?: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'not_required';
} 