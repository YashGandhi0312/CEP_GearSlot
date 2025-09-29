import { Car, LogIn } from 'lucide-react';

interface HomePageProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
}

export default function HomePage({ onShowLogin }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-black shadow-sm border-b border-gray-200">
        <div className="max-w-f mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Car className="w-8 h-8 text-blue-100" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-300 bg-clip-text text-transparent">
                  GearSlot
                </h1>
                <p className="text-sm text-white">Driving School Slot Management</p>
              </div>
            </div>
            <button
              onClick={onShowLogin}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to <span className="text-blue-600">GearSlot</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
            Your all-in-one solution for managing driving school time slots, trainees, and schedules with ease and efficiency.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                onClick={onShowLogin}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} GearSlot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}