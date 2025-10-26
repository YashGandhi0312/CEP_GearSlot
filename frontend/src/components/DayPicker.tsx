import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  getDay,
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface DayPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DayPicker({ selectedDate, onDateChange }: DayPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center py-2">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return (
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500">
        {days.map(day => (
          <div key={day} className="w-8 h-8 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayNumber = format(day, 'd');

        // Check if this day is the selected date
        const isSelected = isSameDay(day, selectedDate);
        // Check if this day is not in the current month
        const isGrayed = !isSameMonth(day, currentMonth);
        const highlightToday = isToday(day) && !isSelected;

        days.push(
          <div
            key={day.toString()}
            className="w-8 h-8 flex items-center justify-center"
            onClick={() => onDateChange(cloneDay)}
          >
            <button
              type="button"
              className={`
                w-full h-full rounded-full transition-colors
                ${isGrayed ? 'text-gray-300' : 'text-gray-700'}
                ${!isGrayed && 'hover:bg-gray-100'}
                ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                ${highlightToday ? 'border-2 border-green-500 font-bold' : ''} // <-- ADDED HIGHLIGHT STYLE
              `}
            >
              {dayNumber}
            </button>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}
    </div>
  );
}