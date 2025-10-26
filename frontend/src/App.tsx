import { useState, useEffect, useMemo } from 'react';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import { TimeSlot, Trainee, BatchFilter, User } from './types';
import SlotCard from './components/SlotCard';
import CreateSlotModal from './components/CreateSlotModal';
import FilterBar from './components/FilterBar';
import StatsCard from './components/StatsCard';
import { Plus, Car, LogOut } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState('home'); // 'home', 'login', 'register'
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<BatchFilter>({ availability: 'all' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
// Add this new useEffect

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        // Get error message from backend
        const data = await response.json();
        alert(data.msg || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Is the backend server running?');
    }
  };
  
  
// --- REPLACE OLD handleLogout WITH THIS ---
  const handleLogout = async () => {
    try {
      // Tell the backend to clear the cookie
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Always log out the frontend regardless of backend success
      setIsLoggedIn(false);
      setPage('home');
    }
  };
  // --- END OF REPLACEMENT ---
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false); // Done checking, show the app
      }
    };
    checkAuth();
  }, []); // The empty array [] means it runs only once

useEffect(() => {
  if (isLoggedIn) {
    const fetchSlots = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/slots');
        if (response.ok) {
          const data = await response.json();
          // --- FIX: Add this ---
          const formattedSlots = data.map((slot: any) => ({
            ...slot,
            id: slot._id // Create the 'id' prop the frontend expects
          }));
          setSlots(formattedSlots);
          // --- End of Fix ---
        } else {
          console.error('Failed to fetch slots');
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    };

    fetchSlots();
  }
}, [isLoggedIn]); // It runs when isLoggedIn changes to true
  
  const handleCreateSlot = async (startTime: string, endTime: string, dayOfWeek: number) => {
  try {
    const response = await fetch('http://localhost:5000/api/slots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dayOfWeek,
        startTime,
        endTime,
        maxTrainees: 2 // Or whatever default you want
      }),
    });

    if (response.status === 201) {
      const newSlotData = await response.json();
      const newSlot = { ...newSlotData, id: newSlotData._id };
      // Add the new slot to our local state so the UI updates instantly
      setSlots(prev => [...prev, newSlot].sort((a, b) => {
        if (a.dayOfWeek !== b.dayOfWeek) {
          return a.dayOfWeek - b.dayOfWeek;
        }
        return a.startTime.localeCompare(b.startTime);
      }));
    } else {
      console.error('Failed to create slot');
      alert('Failed to create slot');
    }
  } catch (error) {
    console.error('Error creating slot:', error);
  }
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

  // --- NEW DELETE FUNCTION ---
  const handleDeleteSlot = async (slotId: string) => {
    // This is the popup you asked for (using window.confirm)
    if (window.confirm('Are you sure you want to remove this slot?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/slots/${slotId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Because we fixed the 'id' prop, this filter now works
          setSlots(prev => prev.filter(slot => slot.id !== slotId));
        } else {
          alert('Failed to delete slot.');
        }
      } catch (error) {
        console.error('Error deleting slot:', error);
      }
    }
  };
  // --- End of new function ---
  
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
        const hasMatchingTrainee = slot.trainees.some((trainee: any) =>
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

  // Show a blank loading screen while we check auth
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50" />;
  }


  if (!isLoggedIn) {
    if (page === 'login') {
      return <LoginPage onLogin={handleLogin} />;
    }
    return <HomePage onShowLogin={() => setPage('login')}/>;
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
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Slot
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCard {...stats} />
        <FilterBar filter={filter} onFilterChange={setFilter} searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="space-y-4 mt-6">
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