
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
    // Add default color for unknown moods
    'default': '#D5D5F1'
  };
  
  return moodColors[mood] || moodColors['default'];
};
