import React from 'react';
import { Filter, Search } from 'lucide-react';
import { BatchFilter } from '../types';

interface FilterBarProps {
  filter: BatchFilter;
  onFilterChange: (filter: BatchFilter) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const DAYS = [
  { value: undefined, label: 'All Days' },
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

const AVAILABILITY_OPTIONS = [
  { value: 'all', label: 'All Slots' },
  { value: 'available', label: 'Available Only' },
  { value: 'full', label: 'Full Only' }
];

export default function FilterBar({ filter, onFilterChange, searchTerm, onSearchChange }: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
        </div>
        
        <div className="flex-1 flex items-center space-x-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search trainees..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <select
            value={filter.day ?? ''}
            onChange={(e) => onFilterChange({ 
              ...filter, 
              day: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {DAYS.map((day) => (
              <option key={day.label} value={day.value ?? ''}>
                {day.label}
              </option>
            ))}
          </select>

          <select
            value={filter.availability || 'all'}
            onChange={(e) => onFilterChange({ 
              ...filter, 
              availability: e.target.value as 'all' | 'available' | 'full' 
            })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}