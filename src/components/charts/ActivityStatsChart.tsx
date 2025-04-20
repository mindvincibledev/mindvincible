
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
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card className="col-span-1 md:col-span-3 bg-white/95 backdrop-blur-lg border-gray-200 shadow-lg text-black">
      <CardHeader>
        <CardTitle className="text-gray-800">Weekly Activity Stats</CardTitle>
        <CardDescription className="text-gray-600">
          Activities completed this week ({formatDate(weekStartDate)} - {formatDate(weekEndDate)})
        </CardDescription>
      </CardHeader>
      <CardContent className="text-black">
        <div className="h-64 md:h-72">
          {weeklyStats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="title" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#000000', fontSize: 12 }}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#000000', fontSize: 12 }}
                  tickFormatter={(value) => `${Math.floor(value)}`} 
                  allowDecimals={false}
                  label={{ 
                    value: 'Times Completed', 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { 
                      textAnchor: 'middle', 
                      fill: '#000000', 
                      fontSize: 12,
                      fontWeight: 500
                    } 
                  }}
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
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
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
      </CardContent>
    </Card>
  );
};

export default ActivityStatsChart;
