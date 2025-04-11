
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMoodColor } from '@/utils/moodUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { addDays, format, isSameDay, subDays } from 'date-fns';

type DailyMoodChartProps = {
  moodData: Array<{
    date: string;
    mood: string;
    time: string;
    created_at?: string; // Added to handle actual dates
  }>;
};

const DailyMoodChart = ({ moodData }: DailyMoodChartProps) => {
  const isMobile = useIsMobile();
  const [tabHeight, setTabHeight] = useState<number>(12); // Default height
  const [mostFrequentMood, setMostFrequentMood] = useState<string | null>(null);
  
  // Generate the last 7 days (including today)
  const getLast7Days = () => {
    const today = new Date();
    const days = [];
    
    // Start from 6 days ago (7 days including today)
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      days.push({
        date,
        dayName: format(date, 'EEE'), // Short day name (Mon, Tue, etc.)
        fullDate: format(date, 'yyyy-MM-dd'),
      });
    }
    
    return days;
  };
  
  const last7Days = getLast7Days();
  
  // Process mood data to match our 7-day format
  const processedData = last7Days.map(day => {
    // Filter mood entries for this specific day
    const dayEntries = moodData.filter(entry => {
      // Check if entry has created_at field (from database)
      if (entry.created_at) {
        return isSameDay(new Date(entry.created_at), day.date);
      }
      // Fallback to date string if created_at is not available
      return entry.date === day.dayName;
    });
    
    return {
      day: day.dayName,
      fullDate: day.fullDate,
      entries: dayEntries.map(entry => ({
        mood: entry.mood,
        time: entry.time
      }))
    };
  });
  
  // Calculate most frequent mood for today
  useEffect(() => {
    const todayEntries = processedData[processedData.length - 1]?.entries || [];
    
    if (todayEntries.length > 0) {
      // Count occurrences of each mood
      const moodCounts: Record<string, number> = {};
      todayEntries.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      });
      
      // Find the mood with the highest count
      let maxCount = 0;
      let maxMood = null;
      
      Object.entries(moodCounts).forEach(([mood, count]) => {
        if (count > maxCount) {
          maxCount = count;
          maxMood = mood;
        }
      });
      
      setMostFrequentMood(maxMood);
    } else {
      setMostFrequentMood(null);
    }
  }, [moodData, processedData]);
  
  // Calculate dynamic tab height based on number of entries
  useEffect(() => {
    const maxEntriesPerDay = Math.max(
      ...processedData.map(day => day.entries.length),
      1 // Ensure we have at least 1 as a default
    );
    
    // Calculate the available height and adjust tab height
    // Base height of container is around 320px (h-80 = 20rem = 320px)
    const availableHeight = 280 - 40; // Subtract header space and leave room for legend
    
    // Calculate tab height (with a minimum of 8px and a maximum of 48px)
    let calculatedHeight = Math.min(
      Math.max(Math.floor(availableHeight / (maxEntriesPerDay + 1)), 8),
      48
    );
    
    // Reduce size further on mobile
    if (isMobile && calculatedHeight > 10) {
      calculatedHeight = Math.max(calculatedHeight * 0.8, 10);
    }
    
    setTabHeight(calculatedHeight);
  }, [moodData, processedData, isMobile]);
  
  // Get all unique moods for the legend
  const uniqueMoods = Array.from(
    new Set(
      moodData.map(entry => entry.mood)
    )
  ).filter(mood => mood); // Filter out any undefined/empty moods

  return (
    <Card className="col-span-1 md:col-span-2 bg-white/95 backdrop-blur-lg border-gray-200 shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-800">Daily Mood</CardTitle>
        <CardDescription className="text-gray-600">Your Vibe Check for the Week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex flex-col">
          <div className="flex-1 grid grid-cols-7 gap-2">
            {processedData.map((dayData) => (
              <div key={dayData.day} className="flex flex-col h-full relative">
                <div className="text-gray-800 text-xs mb-2 text-center font-medium">
                  {dayData.day}
                </div>
                <div className="flex-1 flex flex-col-reverse">
                  {dayData.entries.length > 0 ? (
                    dayData.entries.map((item, index) => (
                      <div 
                        key={`${dayData.day}-${index}`}
                        className={`w-full rounded-md mb-1 relative group hover:opacity-90 transition-opacity`}
                        style={{ 
                          backgroundColor: getMoodColor(item.mood),
                          height: `${tabHeight}px`
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-md">
                          <div className={`text-white ${tabHeight < 20 ? 'text-[0.6rem]' : 'text-xs'} font-medium truncate px-1`}>
                            {item.time}
                          </div>
                        </div>
                        {tabHeight >= 16 && (
                          <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20 rounded-b-md"></div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No data</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Color legend */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {uniqueMoods.length > 0 ? (
              uniqueMoods.map((mood) => (
                <div key={mood} className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getMoodColor(mood) }}
                  ></div>
                  <span className="text-xs text-gray-600">{mood}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-400">No mood data available</div>
            )}
          </div>
          
          {/* Most frequent mood of today */}
          {mostFrequentMood && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Today's most frequent mood:</span>
            <div className="flex items-center gap-2 font-medium">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: getMoodColor(mostFrequentMood) }}
              ></div>
              <span>{mostFrequentMood}</span>
            </div>
          </div>
          
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyMoodChart;
