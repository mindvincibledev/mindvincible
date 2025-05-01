
// Define shared types used in the check-in request function

export interface MoodEntry {
  id: string;
  mood: string;
  notes: string | null;
  tags: string[] | null;
  created_at: string;
  time_of_day: string;
}

export interface RequestData {
  userId: string;
  userName: string;
  userEmail: string;
  currentMood?: string;
}

export interface SMTPConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  fromEmail: string;
}
