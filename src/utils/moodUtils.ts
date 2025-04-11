
// Utility functions for working with moods

/**
 * Gets the appropriate color for a given mood string
 */
export const getMoodColor = (mood: string): string => {
  const moodColors: Record<string, string> = {
    'Happy': '#2AC20E',
    'Loved': '#FC68B3',
    'Excited': '#F5DF4D',
    'Good': '#3DFDFF',
    'Okay': '#D5D5F1',
    'Sad': '#5081D1',
    'Awful': '#FF8A48',
    'Overwhelmed': '#8E6E95',
    'Angry': '#D64550',
    'Anxious': '#6C7A89',
    'Calm': '#A8E6CF',
    // Add default color for unknown moods
    'default': '#D5D5F1'
  };
  
  // Convert to title case to ensure consistent matching regardless of input casing
  const normalizedMood = typeof mood === 'string' 
    ? mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase() 
    : 'default';
  
  return moodColors[normalizedMood] || moodColors['default'];
};
