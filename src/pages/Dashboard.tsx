
import React from 'react';
import { Link } from 'react-router-dom';
import { WavyBackground } from '@/components/ui/wavy-background';
import { PlusCircle, BarChart, PieChart, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Sample mood data for demonstration
const moodData = [
  { date: 'Mon', mood: 'Happy', value: 8 },
  { date: 'Tue', mood: 'Calm', value: 6 },
  { date: 'Wed', mood: 'Anxious', value: 3 },
  { date: 'Thu', mood: 'Excited', value: 9 },
  { date: 'Fri', mood: 'Sad', value: 2 },
  { date: 'Sat', mood: 'Calm', value: 7 },
  { date: 'Sun', mood: 'Happy', value: 8 },
];

// Mood distribution data
const moodDistribution = [
  { name: 'Happy', value: 35 },
  { name: 'Calm', value: 25 },
  { name: 'Anxious', value: 15 },
  { name: 'Sad', value: 10 },
  { name: 'Excited', value: 10 },
  { name: 'Angry', value: 5 },
];

// Weekly mood trend data
const weeklyTrend = [
  { week: 'Week 1', average: 5 },
  { week: 'Week 2', average: 6 },
  { week: 'Week 3', average: 4 },
  { week: 'Week 4', average: 7 },
];

// Helper function to get color based on mood
const getMoodColor = (mood: string): string => {
  const moodColors: Record<string, string> = {
    'Happy': '#FFD36B',
    'Excited': '#FC68B3',
    'Calm': '#3DFDFF',
    'Sad': '#D5D5F1',
    'Angry': '#FF5757',
    'Anxious': '#D5D5F1',
    'Overwhelmed': '#F5DF4D',
    'neutral': '#D5D5F1'
  };
  return moodColors[mood] || moodColors.neutral;
};

// Custom label for the pie chart
const renderCustomizedLabel = ({ 
  cx, 
  cy, 
  midAngle, 
  innerRadius, 
  outerRadius, 
  percent, 
  index 
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <WavyBackground 
          colors={["#FF8A48", "#D5D5F1", "#3DFDFF", "#F5DF4D", "#FC68B3", "#2AC20E"]} 
          waveWidth={100} 
          backgroundFill="black" 
          blur={10} 
          speed="fast" 
          waveOpacity={0.5} 
          className="w-full h-full" 
        />
      </div>
      
      <Navbar />
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Your Mood Dashboard</h1>
            <Link to="/mood-entry">
              <Button className="flex items-center gap-2 bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] hover:opacity-90 text-white">
                <PlusCircle size={18} />
                <span>New Mood Entry</span>
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Daily Mood Chart */}
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
            
            {/* Mood Distribution Pie Chart */}
            <Card className="bg-black/40 backdrop-blur-lg border-purple-500/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Mood Distribution</CardTitle>
                <CardDescription className="text-white/60">How you've been feeling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={moodDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {moodDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getMoodColor(entry.name)} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-black/80 backdrop-blur-md p-3 rounded-lg border border-purple-500/30">
                                <p className="text-white font-semibold">{payload[0].name}</p>
                                <p className="text-[#FF8A48]">
                                  {payload[0].value}%
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {moodDistribution.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getMoodColor(entry.name) }}
                      ></div>
                      <span className="text-xs text-white/70">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Weekly Trend Chart */}
            <Card className="col-span-1 md:col-span-3 bg-black/40 backdrop-blur-lg border-purple-500/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Monthly Trend</CardTitle>
                <CardDescription className="text-white/60">Your average mood over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={weeklyTrend}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="week" stroke="#fff" />
                      <YAxis stroke="#fff" />
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
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
