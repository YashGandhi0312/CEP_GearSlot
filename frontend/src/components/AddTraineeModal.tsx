import { useState, useMemo, useEffect } from 'react';
import { Trainee, TimeSlot } from '../types';

interface AddTraineeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrainee: (traineeId: string) => void;
  slot: TimeSlot | null; // The slot we're adding to
  allTrainees: Trainee[]; // The master list of all trainees
}

export default function AddTraineeModal({ isOpen, onClose, onAddTrainee, slot, allTrainees }: AddTraineeModalProps) {
  const [selectedTraineeId, setSelectedTraineeId] = useState('');

  // This filters the dropdown to only show trainees
  // who are NOT already in this specific slot.
  const availableTrainees = useMemo(() => {
    if (!slot) return [];

    // Get a list of IDs of trainees already in the slot
    const traineeIdsInSlot = new Set(slot.trainees.map(t => t.id));

    // Filter the master list
    return allTrainees.filter(trainee => !traineeIdsInSlot.has(trainee.id));
  }, [slot, allTrainees]);

  // This automatically selects the first trainee in the list
  // when the modal opens.
  useEffect(() => {
    if (availableTrainees.length > 0) {
      setSelectedTraineeId(availableTrainees[0].id);
    } else {
      setSelectedTraineeId('');
    }
  }, [availableTrainees, isOpen]); // Re-run when modal opens


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTraineeId) {
      alert('Please select a trainee.');
      return;
    }
    onAddTrainee(selectedTraineeId);
  };

  if (!isOpen || !slot) return null;

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal Content */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Trainee to Slot</h2>
        <p className="mb-1 text-sm">
          {/* This is a small trick to get the day name */}
          Slot: {new Date(0, 0, slot.dayOfWeek).toLocaleDateString('en-US', { weekday: 'long' })}
          , {slot.startTime} - {slot.endTime}
        </p>
        <p className="mb-4 text-sm text-gray-600">
          Spots filled: {slot.trainees.length} / {slot.maxTrainees}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="trainee" className="block text-sm font-medium text-gray-700">
                Select Trainee
              </label>
              {availableTrainees.length > 0 ? (
                <select
                  id="trainee"
                  value={selectedTraineeId}
                  onChange={(e) => setSelectedTraineeId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                >
                  {availableTrainees.map(trainee => (
                    <option key={trainee.id} value={trainee.id}>
                      {trainee.name} ({trainee.phone})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  All available trainees are already in this slot.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={availableTrainees.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Confirm Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}