
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
