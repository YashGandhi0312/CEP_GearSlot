// import React, { useState, useEffect, useMemo } from 'react';
// import { Plus, Car } from 'lucide-react';
// import { TimeSlot, Trainee, BatchFilter } from './types';
// import { saveSlots, loadSlots, generateId } from './utils/storage';
// import SlotCard from './components/SlotCard';
// import CreateSlotModal from './components/CreateSlotModal';
// import FilterBar from './components/FilterBar';
// import StatsCard from './components/StatsCard';

// function App() {
//   const [slots, setSlots] = useState<TimeSlot[]>([]);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [filter, setFilter] = useState<BatchFilter>({ availability: 'all' });
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const loadedSlots = loadSlots();
//     setSlots(loadedSlots);
//   }, []);

//   useEffect(() => {
//     saveSlots(slots);
//   }, [slots]);

//   const handleCreateSlot = (startTime: string, endTime: string, dayOfWeek: number) => {
//     const newSlot: TimeSlot = {
//       id: generateId(),
//       startTime,
//       endTime,
//       dayOfWeek,
//       trainees: [],
//       maxTrainees: 2,
//       createdAt: new Date()
//     };
    
//     setSlots(prev => [...prev, newSlot].sort((a, b) => {
//       if (a.dayOfWeek !== b.dayOfWeek) {
//         return a.dayOfWeek - b.dayOfWeek;
//       }
//       return a.startTime.localeCompare(b.startTime);
//     }));
//   };

//   const handleAddTrainee = (slotId: string, traineeData: Omit<Trainee, 'id' | 'assignedAt'>) => {
//     setSlots(prev => prev.map(slot => {
//       if (slot.id === slotId && slot.trainees.length < slot.maxTrainees) {
//         const newTrainee: Trainee = {
//           ...traineeData,
//           id: generateId(),
//           assignedAt: new Date()
//         };
//         return { ...slot, trainees: [...slot.trainees, newTrainee] };
//       }
//       return slot;
//     }));
//   };

//   const handleRemoveTrainee = (slotId: string, traineeId: string) => {
//     setSlots(prev => prev.map(slot => {
//       if (slot.id === slotId) {
//         return {
//           ...slot,
//           trainees: slot.trainees.filter(trainee => trainee.id !== traineeId)
//         };
//       }
//       return slot;
//     }));
//   };

//   const handleDeleteSlot = (slotId: string) => {
//     if (confirm('Are you sure you want to delete this slot? This action cannot be undone.')) {
//       setSlots(prev => prev.filter(slot => slot.id !== slotId));
//     }
//   };

//   const filteredSlots = useMemo(() => {
//     return slots.filter(slot => {
//       if (filter.day !== undefined && slot.dayOfWeek !== filter.day) {
//         return false;
//       }

//       const availableSpots = slot.maxTrainees - slot.trainees.length;
//       if (filter.availability === 'available' && availableSpots === 0) {
//         return false;
//       }
//       if (filter.availability === 'full' && availableSpots > 0) {
//         return false;
//       }

//       if (searchTerm) {
//         const searchLower = searchTerm.toLowerCase();
//         const hasMatchingTrainee = slot.trainees.some(trainee =>
//           trainee.name.toLowerCase().includes(searchLower) ||
//           trainee.phone.includes(searchTerm) ||
//           (trainee.email && trainee.email.toLowerCase().includes(searchLower))
//         );
//         if (!hasMatchingTrainee) {
//           return false;
//         }
//       }

//       return true;
//     });
//   }, [slots, filter, searchTerm]);

//   const stats = useMemo(() => {
//     const totalSlots = slots.length;
//     const totalTrainees = slots.reduce((sum, slot) => sum + slot.trainees.length, 0);
//     const availableSlots = slots.filter(slot => slot.trainees.length < slot.maxTrainees).length;
//     const fullSlots = slots.filter(slot => slot.trainees.length >= slot.maxTrainees).length;
    
//     return { totalSlots, totalTrainees, availableSlots, fullSlots };
//   }, [slots]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-black shadow-sm border-b border-gray-200">
//         <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="p-2 bg-blue-600 rounded-lg">
//                 <Car className="w-8 h-8 text-blue-100" />
//               </div>
//               <div className="ml-4">
//                 <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-300 bg-clip-text text-transparent">
//   GearSlot
// </h1>

//                 <p className="text-sm text-white">Slot Management System</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowCreateModal(true)}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Create New Slot
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-f mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <StatsCard {...stats} />
        
//         <FilterBar
//           filter={filter}
//           onFilterChange={setFilter}
//           searchTerm={searchTerm}
//           onSearchChange={setSearchTerm}
//         />

//         {filteredSlots.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
//               <Car className="w-12 h-12 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               {slots.length === 0 ? 'No time slots created yet' : 'No slots match your filters'}
//             </h3>
//             <p className="text-gray-600 mb-6">
//               {slots.length === 0 
//                 ? 'Get started by creating your first training time slot.' 
//                 : 'Try adjusting your search or filter criteria.'}
//             </p>
//             {slots.length === 0 && (
//               <button
//                 onClick={() => setShowCreateModal(true)}
//                 className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//               >
//                 <Plus className="w-5 h-5 mr-2" />
//                 Create First Slot
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredSlots.map(slot => (
//               <SlotCard
//                 key={slot.id}
//                 slot={slot}
//                 onAddTrainee={handleAddTrainee}
//                 onRemoveTrainee={handleRemoveTrainee}
//                 onDeleteSlot={handleDeleteSlot}
//               />
//             ))}
//           </div>
//         )}
//       </main>

//       <CreateSlotModal
//         isOpen={showCreateModal}
//         onClose={() => setShowCreateModal(false)}
//         onCreateSlot={handleCreateSlot}
//       />
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Car, LogOut } from 'lucide-react';
import { TimeSlot, Trainee, BatchFilter } from './types';
import { saveSlots, loadSlots, generateId } from './utils/storage';
import SlotCard from './components/SlotCard';
import CreateSlotModal from './components/CreateSlotModal';
import FilterBar from './components/FilterBar';
import StatsCard from './components/StatsCard';
import HomePage from './components/HomePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<BatchFilter>({ availability: 'all' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadedSlots = loadSlots();
    setSlots(loadedSlots);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      saveSlots(slots);
    }
  }, [slots, isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleCreateSlot = (startTime: string, endTime: string, dayOfWeek: number) => {
    const newSlot: TimeSlot = {
      id: generateId(),
      startTime,
      endTime,
      dayOfWeek,
      trainees: [],
      maxTrainees: 2,
      createdAt: new Date()
    };
    
    setSlots(prev => [...prev, newSlot].sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) {
        return a.dayOfWeek - b.dayOfWeek;
      }
      return a.startTime.localeCompare(b.startTime);
    }));
  };

  const handleAddTrainee = (slotId: string, traineeData: Omit<Trainee, 'id' | 'assignedAt'>) => {
    setSlots(prev => prev.map(slot => {
      if (slot.id === slotId && slot.trainees.length < slot.maxTrainees) {
        const newTrainee: Trainee = {
          ...traineeData,
          id: generateId(),
          assignedAt: new Date()
        };
        return { ...slot, trainees: [...slot.trainees, newTrainee] };
      }
      return slot;
    }));
  };

  const handleRemoveTrainee = (slotId: string, traineeId: string) => {
    setSlots(prev => prev.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          trainees: slot.trainees.filter(trainee => trainee.id !== traineeId)
        };
      }
      return slot;
    }));
  };

  const handleDeleteSlot = (slotId: string) => {
    if (confirm('Are you sure you want to delete this slot? This action cannot be undone.')) {
      setSlots(prev => prev.filter(slot => slot.id !== slotId));
    }
  };

  const filteredSlots = useMemo(() => {
    return slots.filter(slot => {
      if (filter.day !== undefined && slot.dayOfWeek !== filter.day) {
        return false;
      }

      const availableSpots = slot.maxTrainees - slot.trainees.length;
      if (filter.availability === 'available' && availableSpots === 0) {
        return false;
      }
      if (filter.availability === 'full' && availableSpots > 0) {
        return false;
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const hasMatchingTrainee = slot.trainees.some(trainee =>
          trainee.name.toLowerCase().includes(searchLower) ||
          trainee.phone.includes(searchTerm) ||
          (trainee.email && trainee.email.toLowerCase().includes(searchLower))
        );
        if (!hasMatchingTrainee) {
          return false;
        }
      }

      return true;
    });
  }, [slots, filter, searchTerm]);

  const stats = useMemo(() => {
    const totalSlots = slots.length;
    const totalTrainees = slots.reduce((sum, slot) => sum + slot.trainees.length, 0);
    const availableSlots = slots.filter(slot => slot.trainees.length < slot.maxTrainees).length;
    const fullSlots = slots.filter(slot => slot.trainees.length >= slot.maxTrainees).length;
    
    return { totalSlots, totalTrainees, availableSlots, fullSlots };
  }, [slots]);

  if (!isLoggedIn) {
    return <HomePage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Car className="w-8 h-8 text-blue-100" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-300 bg-clip-text text-transparent">
                  GearSlot
                </h1>
                <p className="text-sm text-white">Slot Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Slot
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-f mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCard {...stats} />
        
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {filteredSlots.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
              <Car className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {slots.length === 0 ? 'No time slots created yet' : 'No slots match your filters'}
            </h3>
            <p className="text-gray-600 mb-6">
              {slots.length === 0 
                ? 'Get started by creating your first training time slot.' 
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {slots.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create First Slot
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSlots.map(slot => (
              <SlotCard
                key={slot.id}
                slot={slot}
                onAddTrainee={handleAddTrainee}
                onRemoveTrainee={handleRemoveTrainee}
                onDeleteSlot={handleDeleteSlot}
              />
            ))}
          </div>
        )}
      </main>

      <CreateSlotModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateSlot={handleCreateSlot}
      />
    </div>
  );
}

export default App;