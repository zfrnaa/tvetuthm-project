import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const ReactCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      setSelectedDate(value[0]); // Take the first date if a range is selected
    } else {
      setSelectedDate(null);
    }
  };

  return (
    <div style={{ borderRadius: 10, padding: 10}} className='bg-transparent'>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        locale="ms-MY"
        selectRange={false} // Change to true if range selection is needed
        className={'!bg-gray-200 dark:!bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg justify-self-center !border-none outline-none md:w-auto'}
      />
    </div>
  );
};

export default ReactCalendar;
