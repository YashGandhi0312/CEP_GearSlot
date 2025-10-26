import React, { useState } from 'react';
import { Clock, Users, Plus, X, Phone, Mail } from 'lucide-react';
import { TimeSlot, Trainee } from '../types';

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

interface SlotCardProps {
  slot: TimeSlot;
  onAddTrainee: (slotId: string, trainee: Omit<Trainee, 'id' | 'assignedAt'>) => void;
  onRemoveTrainee: (slotId: string, traineeId: string) => void;
  onDeleteSlot: (slotId: string) => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SlotCard({ slot, onAddTrainee, onRemoveTrainee, onDeleteSlot }: SlotCardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTrainee, setNewTrainee] = useState({ name: '', phone: '', email: '' });

  const availableSpots = slot.maxTrainees - slot.trainees.length;
  const isAvailable = availableSpots > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTrainee.name.trim() && newTrainee.phone.trim()) {
      onAddTrainee(slot.id, {
        name: newTrainee.name.trim(),
        phone: newTrainee.phone.trim(),
        email: newTrainee.email.trim() //|| undefined
      });
      setNewTrainee({ name: '', phone: '', email: '' });
      setShowAddForm(false);
    }
  };

  const getStatusColor = () => {
    if (availableSpots === 0) return 'bg-red-100 text-red-800 border-red-200';
    if (availableSpots === 1) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 w-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{DAYS[slot.dayOfWeek]}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
              {slot.trainees.length}/{slot.maxTrainees} Filled
            </span>
            <button
              onClick={() => onDeleteSlot(slot.id)}
              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
              title="Delete slot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>Available spots: {availableSpots}</span>
          </div>

          {slot.trainees.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-700">Assigned Trainees:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {slot.trainees.map((trainee) => (
                  <div key={trainee.id} className="bg-gray-50 rounded-lg p-2 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{trainee.name}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {trainee.phone}
                        </span>
                        {trainee.email && (
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {trainee.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveTrainee(slot.id, trainee.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                      title="Remove trainee"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isAvailable && (
            <div className="mt-3">
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Trainee
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div>
                    <input
                      type="text"
                      placeholder="Trainee Name *"
                      value={newTrainee.name}
                      onChange={(e) => setNewTrainee({ ...newTrainee, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={newTrainee.phone}
                      onChange={(e) => setNewTrainee({ ...newTrainee, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email (Optional)"
                      value={newTrainee.email}
                      onChange={(e) => setNewTrainee({ ...newTrainee, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setNewTrainee({ name: '', phone: '', email: '' });
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-400 transition-colors font-medium text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}