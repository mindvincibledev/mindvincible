
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMoodColor } from '@/utils/moodUtils';

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
  
  return (
    <Card className="col-span-1 md:col-span-2 bg-black/40 backdrop-blur-lg border-purple-500/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white">Daily Mood</CardTitle>
        <CardDescription className="text-white/60">Your moods stacked by time of day</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <div className="flex h-full">
            <div className="flex-1 grid grid-cols-7 gap-2 h-full">
              {sortedDates.map(date => (
                <div key={date} className="flex flex-col h-full relative">
                  <div className="text-white text-xs mb-2 text-center">{date}</div>
                  <div className="flex-1 flex flex-col-reverse">
                    {groupedData[date]?.map((item, index) => (
                      <div 
                        key={`${date}-${index}`}
                        className="w-full rounded-md mb-1 h-12 relative group hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: getMoodColor(item.mood) }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-md">
                          <div className="text-white text-xs font-medium">{item.time}</div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20 rounded-b-md"></div>
                      </div>
                    ))}
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
