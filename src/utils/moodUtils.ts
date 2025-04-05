
// Helper function to get color based on mood
export const getMoodColor = (mood: string): string => {
  const moodColors: Record<string, string> = {
    'Happy': '#FFD70099',      // Softer gold
    'Excited': '#FF8A4899',    // Softer orange
    'Calm': '#3DFDFF99',       // Softer cyan
    'Sad': '#6A7FDB99',        // Softer blue-purple
    'Angry': '#FF575799',      // Softer red
    'Anxious': '#BDC0FF99',    // Softer lavender
    'Overwhelmed': '#F5DF4D99', // Softer yellow
    'neutral': '#D5D5F199'     // Softer default lavender
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
