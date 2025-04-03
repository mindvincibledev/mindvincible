
-- Create tables

-- Create mood_entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  value INTEGER NOT NULL,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Row Level Security policies
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select their own mood entries
CREATE POLICY select_own_mood_entries
  ON mood_entries
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own mood entries
CREATE POLICY insert_own_mood_entries
  ON mood_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own mood entries
CREATE POLICY update_own_mood_entries
  ON mood_entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own mood entries
CREATE POLICY delete_own_mood_entries
  ON mood_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS mood_entries_user_id_idx ON mood_entries (user_id);
CREATE INDEX IF NOT EXISTS mood_entries_created_at_idx ON mood_entries (created_at);
