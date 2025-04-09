
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

type DailyMoodChartProps = {
  moodData: Array<{
    date: string;
    mood: string;
    time: string;
  }>;
};

const DailyMoodChart = ({ moodData }: DailyMoodChartProps) => {
  // Group the data by date to organize for our custom layout
  const groupedData: Record<string, Array<{mood: string, time: string}>> = {};
  const isMobile = useIsMobile();
  const [tabHeight, setTabHeight] = useState<number>(12); // Default height
  
  moodData.forEach(entry => {
    if (!groupedData[entry.date]) {
      groupedData[entry.date] = [];
    }
    
    groupedData[entry.date].push({
      mood: entry.mood,
      time: entry.time
    });
  });
  
  // Convert to array format for rendering
  const dates = Object.keys(groupedData);
  const sortedDates = [...dates].sort((a, b) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.indexOf(a) - days.indexOf(b);
  });

  // Calculate dynamic tab height based on number of entries
  useEffect(() => {
    const maxEntriesPerDay = Math.max(
      ...Object.values(groupedData).map(entries => entries.length),
      1 // Ensure we have at least 1 as a default
    );
    
    // Calculate the available height and adjust tab height
    // Base height of container is around 320px (h-80 = 20rem = 320px)
    const availableHeight = 320 - 40; // Subtract header space
    
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
  }, [moodData, groupedData, isMobile]);
  
  return (
    <Card className="col-span-1 md:col-span-2 bg-white/95 backdrop-blur-lg border-gray-200 shadow-xl">
      <CardHeader>
        <CardTitle className="text-gray-800">Daily Mood</CardTitle>
        <CardDescription className="text-gray-600">Your moods stacked by time of day</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <div className="flex h-full">
            <div className="flex-1 grid grid-cols-7 gap-2 h-full">
              {sortedDates.map(date => (
                <div key={date} className="flex flex-col h-full relative">
                  <div className="text-gray-800 text-xs mb-2 text-center">{date}</div>
                  <div className="flex-1 flex flex-col-reverse">
                    {groupedData[date]?.map((item, index) => (
                      <div 
                        key={`${date}-${index}`}
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
                    ))}
                    {groupedData[date]?.length === 0 && (
                      <div className="flex-1 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No data</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyMoodChart;
