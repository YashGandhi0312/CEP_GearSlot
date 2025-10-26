import { useState } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns'; // <-- Import date-fns format

interface CreateSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  // --- UPDATED PROPS ---
  onCreateSlot: (startTime: string, endTime: string, dayOfWeek: number) => void;
  selectedDate: Date; // <-- Pass the selected date in
  // --- END OF UPDATED PROPS ---
}

export default function CreateSlotModal({ isOpen, onClose, onCreateSlot, selectedDate }: CreateSlotModalProps) {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');

  // We are removing dayOfWeek from the form state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Input validation (optional, but good)
    if (startTime >= endTime) {
      alert('End time must be after start time.');
      return;
    }

    // --- NEW LOGIC ---
    // Extract the dayOfWeek (0-6) from the passed selectedDate
    const dayOfWeek = selectedDate.getDay(); 
    // The browser's Date object already has a getDay() method (0=Sunday, 6=Saturday)
    // which matches your backend API's requirement.
    // --- END OF NEW LOGIC ---

    onCreateSlot(startTime, endTime, dayOfWeek);

    // Close and reset form
    setStartTime('09:00');
    setEndTime('11:00');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create New Slot</h2>
        
        {/* --- DISPLAY SELECTED DATE (NEW) --- */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
          <div className="flex items-center text-blue-800 font-medium">
            <Calendar className="w-4 h-4 mr-2" />
            Creating slot for: 
            <span className="ml-2 font-bold">
              {format(selectedDate, 'EEEE, MMMM do yyyy')}
            </span>
          </div>
        </div>
        {/* --- END DISPLAY SELECTED DATE --- */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}