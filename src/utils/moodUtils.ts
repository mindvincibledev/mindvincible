
// Helper function to get color based on mood
export const getMoodColor = (mood: string): string => {
  const moodColors: Record<string, string> = {
    'Happy': '#F5DF4D',     // Bright yellow (unchanged)
    'Excited': '#0EA5E9',   // Changed to Ocean Blue from FF8A48
    'Calm': '#3DFDFF',      // Bright cyan (unchanged)
    'Sad': '#7B84DB',       // Blue-purple (unchanged)
    'Angry': '#F97316',     // Bright orange-red (unchanged)
    'Anxious': '#D946EF',   // Vibrant magenta (unchanged)
    'Overwhelmed': '#8B5CF6', // Changed to Vivid Purple from F5DF4D
    'Fearful': '#8B5CF6',    // Vibrant purple (unchanged)
    'Disgusted': '#0EA5E9',  // Ocean blue (unchanged)
    'Love': '#FC68B3',       // Bright pink (unchanged)
    'neutral': '#D5D5F1'    // Default lavender (unchanged)
  };
  return moodColors[mood] || moodColors.neutral;
};

// Sample mood data for demonstration
export const moodData = [
  { date: 'Mon', mood: 'Happy', value: 8 },
  { date: 'Tue', mood: 'Calm', value: 6 },
  { date: 'Wed', mood: 'Anxious', value: 3 },
  { date: 'Thu', mood: 'Excited', value: 9 },
  { date: 'Fri', mood: 'Sad', value: 2 },
  { date: 'Sat', mood: 'Calm', value: 7 },
  { date: 'Sun', mood: 'Happy', value: 8 },
];

// Mood distribution data
export const moodDistribution = [
  { name: 'Happy', value: 35 },
  { name: 'Calm', value: 25 },
  { name: 'Anxious', value: 15 },
  { name: 'Sad', value: 10 },
  { name: 'Excited', value: 10 },
  { name: 'Angry', value: 5 },
];

// Weekly mood trend data
export const weeklyTrend = [
  { week: 'Week 1', average: 5 },
  { week: 'Week 2', average: 6 },
  { week: 'Week 3', average: 4 },
  { week: 'Week 4', average: 7 },
];
