
// Helper function to get color based on mood
export const getMoodColor = (mood: string): string => {
  const moodColors: Record<string, string> = {
    'Happy': '#FFD36B',     // Brighter yellow
    'Excited': '#FC68B3',   // Vibrant pink
    'Calm': '#3DFDFF',      // Bright cyan
    'Sad': '#7B84DB',       // Deeper lavender
    'Angry': '#FF5757',     // Bright red
    'Anxious': '#BDC0FF',   // Soft lavender
    'Overwhelmed': '#F5DF4D', // Rich yellow
    'neutral': '#D5D5F1'    // Default lavender
  };
  return moodColors[mood] || moodColors.neutral;
};
