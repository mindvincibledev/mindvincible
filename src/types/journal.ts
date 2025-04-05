
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
