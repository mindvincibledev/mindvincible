
export interface JournalEntry {
  id: string;
  title: string;
  content: string | null;
  audio_path: string | null;
  drawing_path: string | null;
  entry_type: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  journal_area?: string | null;
}

export interface PowerOfHiChallenge {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  challenge_level: string;
  goal: string;
  who: string | null;
  who_path: string | null;
  who_stickers: string | null;
  who_difficulty: number | null;
  how_it_went: string | null;
  how_it_went_path: string | null;
  how_it_went_rating: number | null;
  how_it_went_stickers: string | null;
  feeling: string | null;
  feeling_path: string | null;
  feeling_stickers: string | null;
  what_felt_easy: string | null;
  what_felt_easy_rating: number | null;
  what_felt_hard: string | null;
  what_felt_hard_rating: number | null;
  other_people_responses: string | null;
  other_people_rating: number | null;
  try_next_time: string | null;
  try_next_time_confidence: number | null;
}
