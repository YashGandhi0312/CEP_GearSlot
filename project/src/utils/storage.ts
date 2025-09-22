import { TimeSlot } from '../types';

const STORAGE_KEY = 'driving_school_slots';

export const saveSlots = (slots: TimeSlot[]) => {
  try {
    const serializedState = JSON.stringify(slots);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

export const loadSlots = (): TimeSlot[] => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return [];
    }
    const slots = JSON.parse(serializedState);
    return slots.map((slot: any) => ({
      ...slot,
      createdAt: new Date(slot.createdAt),
      trainees: slot.trainees.map((trainee: any) => ({
        ...trainee,
        assignedAt: new Date(trainee.assignedAt)
      }))
    }));
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return [];
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};