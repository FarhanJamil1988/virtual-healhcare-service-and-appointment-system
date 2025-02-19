export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  address?: string;
  specialization?: string; // For doctors
  duration?: number; // For doctors
} 