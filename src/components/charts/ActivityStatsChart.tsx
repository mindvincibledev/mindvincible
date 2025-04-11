
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ActivityStatsProps = {
  activityStats: {
    [key: string]: {
      id: string;
      title: string;
      shortName?: string;
      count: number;
      color: string;
    }
  };
};

const ActivityStatsChart = ({ activityStats }: ActivityStatsProps) => {
  const data = Object.values(activityStats).map(item => ({
    name: item.shortName || item.title.split(':')[0],
    fullName: item.title,
    count: item.count,
    color: item.color,
    id: item.id
  }));

  return (
    <Card className="col-span-1 md:col-span-3 bg-white/95 backdrop-blur-lg border-gray-200 shadow-lg text-black">
      <CardContent className="text-black">
        <div className="h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#000000', fontSize: 12 }}
                angle={0}
                textAnchor="middle"
                height={40}
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
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.fullName;
                  }
                  return label;
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityStatsChart;
