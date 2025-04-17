
export interface SimpleHiChallenge {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  challenge_level: string;
  goal: string;
  who?: string | null;
  feeling?: string | null;
  how_it_went?: string | null;
  what_felt_easy?: string | null;
  what_felt_hard?: string | null;
  other_people_responses?: string | null;
  try_next_time?: string | null;
  who_path?: string | null;
  feeling_path?: string | null;
  how_it_went_path?: string | null;
  who_difficulty?: number | null;
  how_it_went_rating?: number | null;
  what_felt_easy_rating?: number | null;
  what_felt_hard_rating?: number | null;
  other_people_rating?: number | null;
  try_next_time_confidence?: number | null;
}

export interface SimpleHiInteraction {
  id: string;
  user_id: string;
  challenge_id: string;
  completed_at: string;
  who?: string | null;
  feeling?: string | null;
  how_it_went?: string | null;
  who_path?: string | null;
  feeling_path?: string | null;
  how_it_went_path?: string | null;
}
