
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
  // Filter out emotional-hacking since it's a parent activity
  const filteredStats = weeklyStats.filter(stat => stat.id !== "emotional-hacking");

  if (filteredStats.length === 0) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <p className="text-gray-500">No activities completed this week</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
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
            {filteredStats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityStatsChart;
