import React from 'react';
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';

interface StatsCardProps {
  totalSlots: number;
  totalTrainees: number;
  availableSlots: number;
  fullSlots: number;
}

export default function StatsCard({ totalSlots, totalTrainees, availableSlots, fullSlots }: StatsCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">Total Slots</p>
            <p className="text-xl font-semibold text-gray-900">{totalSlots}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">Total Trainees</p>
            <p className="text-xl font-semibold text-gray-900">{totalTrainees}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">Available Slots</p>
            <p className="text-xl font-semibold text-gray-900">{availableSlots}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
          <div className="p-2 bg-red-100 rounded-lg">
            <CheckCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">Full Slots</p>
            <p className="text-xl font-semibold text-gray-900">{fullSlots}</p>
          </div>
        </div>
      </div>
    </div>
  );
}