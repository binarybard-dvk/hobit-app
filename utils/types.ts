export interface User {
  email: string;
  password?: string;
  name?: string;
}

export interface Habit {
  id?: any;
  name: string;
  description: string;
  planned_time_minutes: string;
  frequency: string;
  notify?: boolean;
  notify_time?: string;
}

export interface HabitEntry {
  id?: any;
  habit_id?: any;
  entry_date?: string;
  status?: string;
  actual_time_minutes?: string;
}
