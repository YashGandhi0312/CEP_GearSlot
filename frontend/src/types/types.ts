export interface Trainee {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  trainees: Trainee[];
  maxTrainees: number;
  createdAt: Date;
}

export interface BatchFilter {
  day?: number;
  availability?: 'all' | 'available' | 'full';
}