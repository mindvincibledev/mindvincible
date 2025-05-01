
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { MoodEntry } from "./types.ts";

// Create Supabase client
const supabaseUrl = "https://mbuegumluulltutadsyr.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
export const supabase = createClient(supabaseUrl, supabaseKey);

// Save check-in request to database
export async function saveCheckInRequest(userId: string, currentMood?: string) {
  const { error } = await supabase
    .from("check_in_requests")
    .insert({
      user_id: userId,
      notes: `Requested via mood entry page. Current mood: ${currentMood || "Not specified"}`,
      alert_sent: false
    });

  if (error) {
    console.error("Error inserting check-in request:", error);
    throw new Error(`Database error: ${error.message}`);
  }

  return true;
}

// Get user data from database
export async function getUserData(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("name, email")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user data:", error);
    throw new Error(`User data error: ${error.message}`);
  }

  return data;
}

// Get mood entries for user
export async function getUserMoodEntries(userId: string, limit = 3): Promise<MoodEntry[]> {
  const { data, error } = await supabase
    .from("mood_data")
    .select("id, mood, notes, tags, created_at, time_of_day")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching mood entries:", error);
    throw new Error(`Mood data error: ${error.message}`);
  }

  return data || [];
}

// Update check-in request status
export async function updateCheckInRequestStatus(userId: string, alertSent: boolean) {
  const { error } = await supabase
    .from("check_in_requests")
    .update({ alert_sent: alertSent })
    .eq("user_id", userId)
    .is("resolved", false)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error updating check-in request status:", error);
  }

  return !error;
}
