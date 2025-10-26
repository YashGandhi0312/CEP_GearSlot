import { useState } from 'react';
import { Trainee } from '../types';
import { UserPlus, Trash2, User } from 'lucide-react';

// Define the props this page will receive
interface TraineePageProps {
  trainees: Trainee[]; // The master list from App.tsx
  onAddTrainee: (newTrainee: Omit<Trainee, 'id' | 'createdAt'>) => void;
  onDeleteTrainee: (traineeId: string) => void;
}

export default function TraineePage({ trainees, onAddTrainee, onDeleteTrainee }: TraineePageProps) {
  // State for the "Add New Trainee" form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Name and Phone are required.');
      return;
    }
    // Call the function from App.tsx to handle the API logic
    onAddTrainee({ name, phone, email });

    // Clear the form
    setName('');
    setPhone('');
    setEmail('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* --- 1. Add Trainee Form --- */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Add New Trainee
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Trainee
            </button>
          </form>
        </div>
      </div>

      {/* --- 2. Trainee List --- */}
      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Current Trainees ({trainees.length})</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {trainees.length > 0 ? (
              trainees.map(trainee => (
                <div key={trainee.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{trainee.name}</p>
                      <p className="text-sm text-gray-500">{trainee.phone} {trainee.email && `| ${trainee.email}`}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${trainee.name}?`)) {
                        onDeleteTrainee(trainee.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete trainee"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No trainees created yet.</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}