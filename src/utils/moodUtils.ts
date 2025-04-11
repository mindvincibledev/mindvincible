
/**
 * Gets the color corresponding to a specific mood
 */
export const getMoodColor = (mood: string | null): string => {
  if (!mood) return '#D5D5F1'; // Default color if no mood is provided
  
  // Normalize mood string to handle case variations - convert to Title Case
  const normalizedMood = mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase();
  
  // Define mood colors
  const moodColors: Record<string, string> = {
    'Happy': '#2AC20E',
    'Loved': '#FC68B3',
    'Excited': '#F5DF4D',
    'Good': '#3DFDFF',
    'Okay': '#D5D5F1',
    'Sad': '#5081D1',
    'Awful': '#FF8A48',
    'Angry': '#FF4747',
    'Anxious': '#9370DB',
    'Calm': '#6BB9E8',
    'Overwhelmed': '#E67E22',
    'Neutral': '#D5D5F1'
  };
  
  // Return the color for the normalized mood, or a default color if not found
  return moodColors[normalizedMood] || '#D5D5F1';
};

/**
 * Maps widget mood to valid enum values in the mood_data table
 * The mood_data table only accepts specific enum values: "Happy", "Excited", "Sad", "Angry", "Anxious", "Calm", "Overwhelmed"
 */
export const mapWidgetMoodToEnum = (widgetMood: string): "Happy" | "Excited" | "Sad" | "Angry" | "Anxious" | "Calm" | "Overwhelmed" => {
  // Map widget moods to mood_data enum values
  const moodMap: Record<string, "Happy" | "Excited" | "Sad" | "Angry" | "Anxious" | "Calm" | "Overwhelmed"> = {
    'Happy': 'Happy',
    'Loved': 'Happy',  // Map to closest enum value
    'Excited': 'Excited',
    'Good': 'Happy',   // Map to closest enum value
    'Okay': 'Calm',    // Map to closest enum value
    'Sad': 'Sad',
    'Awful': 'Angry',  // Map to closest enum value
    'Angry': 'Angry',
    'Anxious': 'Anxious',
    'Calm': 'Calm',
    'Overwhelmed': 'Overwhelmed'
  };
  
  return moodMap[widgetMood] || 'Happy'; // Default to 'Happy' if no match
};
