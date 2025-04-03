
export interface MoodEntry {
  id: string;
  user_id: string;
  mood: string;
  intensity: number;
  notes?: string;
  tags?: string[];
  created_at: string;
}

export interface MoodDistributionData {
  name: string;
  value: number;
}

export interface MoodTrendData {
  week: string;
  average: number;
}

export interface DailyMoodData {
  date: string;
  mood: string;
  value: number;
}
