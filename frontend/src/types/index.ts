export interface Trainee {
  id: string;
  name: string;
  phone: string;
  email?: string;
  assignedAt: Date;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  trainees: Trainee[];
  maxTrainees: number;
  createdAt: Date;
}

export interface BatchFilter {
  day?: number;
  availability?: 'all' | 'available' | 'full';
}