import React from 'react';
import { format } from 'date-fns';

interface TimeSlotsProps {
  date: Date;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
  date,
  selectedTime,
  onTimeSelect,
}) => {
  // Generate time slots from 9 AM to 5 PM
  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Available Times for {format(date, 'MMMM d, yyyy')}
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className={`p-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              selectedTime === time
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlots; 