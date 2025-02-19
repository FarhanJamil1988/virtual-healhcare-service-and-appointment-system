export interface ServiceType {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  isActive: boolean;
  doctors: Array<{ _id: string }>;
  specialization: string;
}

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  isAvailable: boolean;
  workingHours: {
    start: string;
    end: string;
  };
  duration?: number;
}

export interface TimeSlotProps {
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  doctorId: string;
  date: Date | null;
}

interface Medicine {
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
}

interface Prescription {
  medicines: Medicine[];
  notes: string;
  prescribedDate?: Date;
}

export interface Appointment {
  _id: string;
  patient: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
  doctor: {
    _id: string;
    name: string;
    specialization: string;
    duration: number;
  };
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  prescription?: Prescription;
}

export interface PrescriptionModalProps {
  appointmentId: string;
  existingPrescription?: Prescription;
  onClose: () => void;
  onUpdate: () => void;
} 