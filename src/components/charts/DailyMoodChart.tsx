
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
import { format } from 'date-fns';

type DailyMoodChartProps = {
  moodData: Array<{
    id: string;
    mood_type: string;
    mood_value: number;
    created_at: string;
  }>;
};

const DailyMoodChart = ({ moodData }: DailyMoodChartProps) => {
  // Process the data to show the last 7 days
  const last7DaysData = moodData
    .slice(0, 7) // Get most recent 7 entries
    .map(entry => ({
      date: format(new Date(entry.created_at), 'EEE'),
      mood: entry.mood_type,
      value: entry.mood_value
    }))
    .reverse(); // To show oldest to newest

  return (
    <Card className="col-span-1 md:col-span-2 bg-black/40 backdrop-blur-lg border-purple-500/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white">Daily Mood</CardTitle>
        <CardDescription className="text-white/60">Your recent mood entries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {last7DaysData.length > 0 ? (
              <RechartsBarChart
                data={last7DaysData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" domain={[0, 10]} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black/80 backdrop-blur-md p-3 rounded-lg border border-purple-500/30">
                          <p className="text-white font-semibold">{label}</p>
                          <p className="text-[#FF8A48]">
                            Mood: {payload[0].payload.mood}
                          </p>
                          <p className="text-white">
                            Value: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  name="Mood Level" 
                  radius={[4, 4, 0, 0]}
                >
                  {last7DaysData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getMoodColor(entry.mood)} />
                  ))}
                </Bar>
              </RechartsBarChart>
            ) : (
              <div className="h-full flex items-center justify-center text-white/70">
                <p>No recent mood data to display</p>
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyMoodChart;
