
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ActivityStatsProps = {
  weeklyStats: {
    id: string;
    title: string;
    count: number;
    color: string;
  }[];
  weekStartDate: Date;
  weekEndDate: Date;
};

const ActivityStatsChart = ({ weeklyStats, weekStartDate, weekEndDate }: ActivityStatsProps) => {
  // Format dates for display
  const idToRemove = "emotional-hacking";

const filteredStats = weeklyStats.some(stat => stat.id === idToRemove)
  ? weeklyStats.filter(stat => stat.id !== idToRemove)
  : weeklyStats;
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="h-[400px] w-full">
          {filteredStats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredStats}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                layout="vertical"
                barSize={24}
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                <XAxis 
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#000000', fontSize: 12 }}
                  tickFormatter={(value) => `${Math.floor(value)}`}
                  allowDecimals={false}
                />
                <YAxis 
                  dataKey="title"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#000000', fontSize: 12 }}
                  width={150}
                  interval={0}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    color: '#000000'
                  }}
                  formatter={(value) => [`${value} times`, 'Completed']}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {weeklyStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No activities completed this week</p>
            </div>
          )}
        </div>

  );
};

export default ActivityStatsChart;
