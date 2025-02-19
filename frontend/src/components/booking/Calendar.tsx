import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  const disabledDays = [
    { before: new Date() },
  ];

  return (
    <div className="calendar-wrapper">
      <style jsx>{`
        .calendar-wrapper :global(.rdp) {
          --rdp-cell-size: 40px;
          --rdp-accent-color: #10b981;
          --rdp-background-color: #374151;
          margin: 0;
          width: 100%;
        }
        .calendar-wrapper :global(.rdp-months) {
          justify-content: center;
        }
        .calendar-wrapper :global(.rdp-month) {
          background-color: #1f2937;
          padding: 1rem;
          border-radius: 0.5rem;
        }
        .calendar-wrapper :global(.rdp-day_selected),
        .calendar-wrapper :global(.rdp-day_selected:hover) {
          background-color: var(--rdp-accent-color);
        }
        .calendar-wrapper :global(.rdp-day:hover:not(.rdp-day_selected)) {
          background-color: #4b5563;
        }
        .calendar-wrapper :global(.rdp-head_cell) {
          color: #9ca3af;
          font-weight: 600;
        }
        .calendar-wrapper :global(.rdp-day) {
          color: #e5e7eb;
          font-weight: 500;
        }
        .calendar-wrapper :global(.rdp-day_disabled) {
          color: #6b7280;
        }
        .calendar-wrapper :global(.rdp-nav_button) {
          color: #e5e7eb;
        }
        .calendar-wrapper :global(.rdp-caption_label) {
          color: #e5e7eb;
          font-weight: 600;
          font-size: 1rem;
        }
      `}</style>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={disabledDays}
        showOutsideDays
        className="bg-gray-700 rounded-lg p-4"
      />
    </div>
  );
};

export default Calendar; 