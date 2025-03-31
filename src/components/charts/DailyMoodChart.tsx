
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
    value: number;
  }>;
};

const DailyMoodChart = ({ moodData }: DailyMoodChartProps) => {
  return (
    <Card className="col-span-1 md:col-span-2 bg-black/40 backdrop-blur-lg border-purple-500/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white">Daily Mood</CardTitle>
        <CardDescription className="text-white/60">Your mood over the past 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={moodData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#fff" />
              <YAxis stroke="#fff" />
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
                {moodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getMoodColor(entry.mood)} />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyMoodChart;
