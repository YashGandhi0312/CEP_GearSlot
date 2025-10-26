export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0 for Sunday, 1 for Monday, etc.
  trainees: Trainee[];
  maxTrainees: number;
  createdAt: Date;
}

export interface Trainee {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  assignedAt: Date;
}

export interface BatchFilter {
  availability: 'all' | 'available' | 'full';
  day?: number;
}

export interface User {
  email: string;
  password: string;
}