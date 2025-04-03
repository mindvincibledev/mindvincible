
import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type MonthlyTrendChartProps = {
  weeklyTrend: Array<{
    week: string;
    average: number;
  }>;
};

const MonthlyTrendChart = ({ weeklyTrend }: MonthlyTrendChartProps) => {
  return (
    <Card className="col-span-1 md:col-span-3 bg-black/40 backdrop-blur-lg border-purple-500/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white">Monthly Trend</CardTitle>
        <CardDescription className="text-white/60">Your average mood over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {weeklyTrend.some(week => week.average > 0) ? (
              <RechartsLineChart
                data={weeklyTrend}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="week" stroke="#fff" />
                <YAxis stroke="#fff" domain={[0, 10]} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black/80 backdrop-blur-md p-3 rounded-lg border border-purple-500/30">
                          <p className="text-white font-semibold">{label}</p>
                          <p className="text-[#FF8A48]">
                            Average: {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  stroke="#3DFDFF" 
                  strokeWidth={2}
                  dot={{ fill: '#3DFDFF', r: 6 }}
                  activeDot={{ r: 8, fill: '#FC68B3' }}
                />
              </RechartsLineChart>
            ) : (
              <div className="h-full flex items-center justify-center text-white/70">
                <p>No trend data to display yet</p>
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyTrendChart;
