import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ViewMode = 'day' | 'month' | 'year';

interface DatePickerProps {
  value?: string; // DD/MM/YYYY format
  onChange: (date: string) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  
  // Parse the value
  const parseDate = (dateStr: string | undefined) => {
    if (!dateStr) return new Date();
    const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return new Date();
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    return new Date(year, month - 1, day);
  };

  const currentDate = parseDate(value);
  const [displayYear, setDisplayYear] = useState(currentDate.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(currentDate.getMonth());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthNamesShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (day: number, month: number, year: number) => {
    const d = String(day).padStart(2, '0');
    const m = String(month + 1).padStart(2, '0');
    const y = String(year);
    return `${d}/${m}/${y}`;
  };

  const handlePrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const handlePrevYear = () => {
    setDisplayYear(displayYear - 1);
  };

  const handleNextYear = () => {
    setDisplayYear(displayYear + 1);
  };

  const handlePrevYearRange = () => {
    setDisplayYear(displayYear - 12);
  };

  const handleNextYearRange = () => {
    setDisplayYear(displayYear + 12);
  };

  const handleDayClick = (day: number) => {
    onChange(formatDate(day, displayMonth, displayYear));
  };

  const handleMonthClick = (month: number) => {
    setDisplayMonth(month);
    setViewMode('day');
  };

  const handleYearClick = (year: number) => {
    setDisplayYear(year);
    setViewMode('month');
  };

  const handleHeaderClick = () => {
    if (viewMode === 'day') {
      setViewMode('month');
    } else if (viewMode === 'month') {
      setViewMode('year');
    }
  };

  const renderDayView = () => {
    const daysInMonth = getDaysInMonth(displayYear, displayMonth);
    const firstDay = getFirstDayOfMonth(displayYear, displayMonth);
    const days = [];

    // Previous month days
    const prevMonthDays = getDaysInMonth(
      displayMonth === 0 ? displayYear - 1 : displayYear,
      displayMonth === 0 ? 11 : displayMonth - 1
    );
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <button
          key={`prev-${i}`}
          className="w-[44px] h-[44px] text-[15px] text-gray-400 hover:bg-gray-100 rounded-md"
          onClick={() => {
            const prevMonth = displayMonth === 0 ? 11 : displayMonth - 1;
            const prevYear = displayMonth === 0 ? displayYear - 1 : displayYear;
            onChange(formatDate(prevMonthDays - i, prevMonth, prevYear));
          }}
        >
          {prevMonthDays - i}
        </button>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = value === formatDate(day, displayMonth, displayYear);
      const isToday = 
        day === new Date().getDate() &&
        displayMonth === new Date().getMonth() &&
        displayYear === new Date().getFullYear();

      days.push(
        <button
          key={day}
          className={`w-[44px] h-[44px] text-[15px] rounded-md font-['Inter'] ${
            isSelected
              ? 'bg-[#1977f3] text-white hover:bg-[#1567d3]'
              : isToday
              ? 'bg-blue-50 text-[#1977f3] hover:bg-blue-100'
              : 'text-gray-900 hover:bg-gray-100'
          }`}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </button>
      );
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push(
        <button
          key={`next-${day}`}
          className="w-[44px] h-[44px] text-[15px] text-gray-400 hover:bg-gray-100 rounded-md"
          onClick={() => {
            const nextMonth = displayMonth === 11 ? 0 : displayMonth + 1;
            const nextYear = displayMonth === 11 ? displayYear + 1 : displayYear;
            onChange(formatDate(day, nextMonth, nextYear));
          }}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="p-3">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="w-[44px] h-[44px] flex items-center justify-center text-[14px] text-gray-600 font-['Inter']"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  const renderMonthView = () => {
    const selectedMonth = value ? parseDate(value).getMonth() : -1;
    const selectedYear = value ? parseDate(value).getFullYear() : -1;

    return (
      <div className="p-3">
        <div className="grid grid-cols-4 gap-2">
          {monthNamesShort.map((month, index) => {
            const isSelected = index === selectedMonth && displayYear === selectedYear;
            return (
              <button
                key={month}
                className={`py-3.5 px-3 text-[15px] rounded-md font-['Inter'] font-medium ${
                  isSelected
                    ? 'bg-[#1977f3] text-white hover:bg-[#1567d3]'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => handleMonthClick(index)}
              >
                {month}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const startYear = Math.floor(displayYear / 12) * 12;
    const years = [];
    const selectedYear = value ? parseDate(value).getFullYear() : -1;

    for (let i = 0; i < 12; i++) {
      const year = startYear + i;
      const isSelected = year === selectedYear;
      years.push(
        <button
          key={year}
          className={`py-3.5 px-3 text-[15px] rounded-md font-['Inter'] font-medium ${
            isSelected
              ? 'bg-[#1977f3] text-white hover:bg-[#1567d3]'
              : 'text-gray-900 hover:bg-gray-100'
          }`}
          onClick={() => handleYearClick(year)}
        >
          {year}
        </button>
      );
    }

    return (
      <div className="p-3">
        <div className="grid grid-cols-4 gap-2">{years}</div>
      </div>
    );
  };

  const getHeaderText = () => {
    if (viewMode === 'day') {
      return `${monthNames[displayMonth]} ${displayYear}`;
    } else if (viewMode === 'month') {
      return `${displayYear}`;
    } else {
      const startYear = Math.floor(displayYear / 12) * 12;
      const endYear = startYear + 11;
      return `${startYear} - ${endYear}`;
    }
  };

  const handlePrev = () => {
    if (viewMode === 'day') {
      handlePrevMonth();
    } else if (viewMode === 'month') {
      handlePrevYear();
    } else {
      handlePrevYearRange();
    }
  };

  const handleNext = () => {
    if (viewMode === 'day') {
      handleNextMonth();
    } else if (viewMode === 'month') {
      handleNextYear();
    } else {
      handleNextYearRange();
    }
  };

  return (
    <div className="w-[330px] bg-white rounded-md shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200">
        <button
          onClick={handlePrev}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <button
          onClick={handleHeaderClick}
          className="px-3 py-1.5 hover:bg-gray-100 rounded-md transition-colors font-['Inter'] text-[15px] font-medium text-gray-900"
        >
          {getHeaderText()}
        </button>
        
        <button
          onClick={handleNext}
          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Content */}
      {viewMode === 'day' && renderDayView()}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'year' && renderYearView()}
    </div>
  );
}
