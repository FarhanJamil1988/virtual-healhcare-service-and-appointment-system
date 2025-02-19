import React from 'react';
import { useForm } from 'react-hook-form';
import { ServiceType, Doctor } from '../../types';
import { format } from 'date-fns';

interface BookingFormProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedService: ServiceType | null;
  selectedDoctor: Doctor | null;
  onSubmit: (data: { notes: string }) => void;
  isLoading: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  selectedDate,
  selectedTime,
  selectedService,
  selectedDoctor,
  onSubmit,
  isLoading
}) => {
  const { register, handleSubmit } = useForm<{ notes: string }>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-lg font-medium text-white">Appointment Details</h2>

      {/* Appointment Summary */}
      <div className="bg-gray-800 rounded-xl p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Service:</span>
          <span className="text-white">{selectedService?.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Doctor:</span>
          <span className="text-white">{selectedDoctor?.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Date:</span>
          <span className="text-white">
            {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : ''}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Time:</span>
          <span className="text-white">{selectedTime}</span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <textarea
          {...register('notes')}
          placeholder="Additional notes for the doctor (optional)"
          className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Booking...' : 'Confirm Booking'}
      </button>
    </form>
  );
};

export default BookingForm; 