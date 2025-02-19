import React, { useState } from 'react';
import { format } from 'date-fns';
import { Appointment } from '../../types';

interface RescheduleModalProps {
  appointment: Appointment;
  onClose: () => void;
  onSubmit: (appointmentId: string, newDate: string, newTime: string) => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  appointment,
  onClose,
  onSubmit
}) => {
  const [date, setDate] = useState(appointment.date);
  const [time, setTime] = useState(appointment.time);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(appointment._id, date, time);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">
          Reschedule Appointment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full bg-gray-700 text-white rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg p-2"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal; 