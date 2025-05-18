import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BatteryFull, BatteryLow, Plus, Minus, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface BatteryTrackerProps {
  onComplete: (finalPercentage: number) => void;
  onAddPost: (type: 'charging' | 'draining', percentage: number, category?: string, notes?: string) => void;
}

const getPostCategory = (change: number): string => {
  const categories = {
    15: 'inspiring',
    10: 'positive_quote',
    20: 'body_positivity',
    '-10': 'insecure_comparison',
    '-20': 'unrealistic_standards',
    '-15': 'self_doubt_negativity'
  };
  
  return categories[change.toString()] || 'other';
};

const BatteryTracker: React.FC<BatteryTrackerProps> = ({ onComplete, onAddPost }) => {
  const [batteryPercentage, setBatteryPercentage] = useState(50);
  const [timeRemaining, setTimeRemaining] = useState(5 * 60); // 5 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [postNote, setPostNote] = useState('');
  const [showNote, setShowNote] = useState(false);
  const [currentChange, setCurrentChange] = useState<{type: 'charging' | 'draining', value: number, category: string} | null>(null);
  
  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTimerActive(false);
      toast.success("Time's up! Let's see how your battery is doing.");
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);
  
  // Format time display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const startTimer = () => {
    setIsTimerActive(true);
  };

  const handleCharge = (changeValue: number, category?: string) => {
    const newPercentage = Math.min(100, Math.max(0, batteryPercentage + changeValue));
    setCurrentChange({
      type: changeValue > 0 ? 'charging' : 'draining',
      value: changeValue,
      category: category || getPostCategory(changeValue)
    });
    setShowNote(true);
  };
  
  const submitPost = () => {
    if (currentChange) {
      const newPercentage = Math.min(100, Math.max(0, batteryPercentage + currentChange.value));
      setBatteryPercentage(newPercentage);
      
      // Log the post
      onAddPost(
        currentChange.type, 
        Math.abs(currentChange.value), 
        currentChange.category, 
        postNote
      );
      
      // Reset for next post
      setPostNote('');
      setShowNote(false);
      setCurrentChange(null);
      
      // Show feedback
      toast.success(`Battery ${currentChange.value > 0 ? 'charged' : 'drained'} by ${Math.abs(currentChange.value)}%`);
    }
  };

  // Auto-complete when timer ends
  useEffect(() => {
    if (timeRemaining === 0 && !showNote) {
      // Wait a moment before auto-completing for UX
      const timer = setTimeout(() => {
        onComplete(batteryPercentage);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, batteryPercentage, onComplete, showNote]);
  
  const getBatteryColor = () => {
    if (batteryPercentage >= 70) return 'bg-gradient-to-t from-[#0ABFDF] to-[#2AC20E]';
    if (batteryPercentage >= 40) return 'bg-gradient-to-t from-[#F9A159] to-[#0ABFDF]';
    return 'bg-gradient-to-t from-[#ff6b6b] to-[#F9A159]';
  };
  
  return (
    <Card className="p-6 bg-white/90 backdrop-blur-lg shadow-xl border-none overflow-hidden">
      <CardContent className="p-0">
        {!isTimerActive ? (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center mb-6">Create Your Battery Tracker</h2>
            
            <div className="relative h-64 w-32 mb-8 border-4 border-gray-800 rounded-lg overflow-hidden">
              <div 
                className={`absolute bottom-0 w-full transition-all duration-1000 ${getBatteryColor()}`}
                style={{ height: `${batteryPercentage}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-2xl font-bold text-white mix-blend-difference">{batteryPercentage}%</p>
              </div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-5 bg-gray-800 rounded-t-lg"></div>
            </div>
            
            <div className="text-center mb-8 max-w-md mx-auto">
              <p className="mb-4">
                You'll start at 50% (neutral state). As you scroll through your social feed,
                log posts that charge or drain your energy.
              </p>
              
              <div className="space-y-2 text-left p-4 bg-gray-50 rounded-lg mb-4">
                <h3 className="font-bold">Post Types:</h3>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">💚 Inspiring post → +15%</li>
                  <li className="flex items-center gap-2">😒 Insecure/comparison post → -10%</li>
                  <li className="flex items-center gap-2">💖 Body positivity → +20%</li>
                  <li className="flex items-center gap-2">🙄 Unrealistic standards → -20%</li>
                  <li className="flex items-center gap-2">🔁 Positive quote → +10%</li>
                  <li className="flex items-center gap-2">📉 Self-doubt/negativity → -15%</li>
                </ul>
              </div>
            </div>
            
            <Button 
              onClick={startTimer}
              className="bg-gradient-to-r from-[#0ABFDF] to-[#F9A159] text-white hover:opacity-90 transition-all duration-300 px-8 py-4 text-lg rounded-full flex items-center gap-2"
            >
              <Clock className="h-5 w-5" /> 
              Start Timer & Begin Scroll
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 mr-2 text-[#0ABFDF]" />
              <h2 className="text-xl font-bold">Time Remaining: {formatTime(timeRemaining)}</h2>
            </div>
            
            <div className="relative h-64 w-32 mb-8 border-4 border-gray-800 rounded-lg overflow-hidden">
              <motion.div 
                className={`absolute bottom-0 w-full ${getBatteryColor()}`}
                initial={{ height: '50%' }}
                animate={{ height: `${batteryPercentage}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              ></motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.p 
                  className="text-2xl font-bold text-white mix-blend-difference"
                  key={batteryPercentage}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                >
                  {batteryPercentage}%
                </motion.p>
              </div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-5 bg-gray-800 rounded-t-lg"></div>
            </div>
            
            {showNote ? (
              <div className="w-full max-w-md">
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                  placeholder="What did the post say/show? (Optional)"
                  rows={3}
                  value={postNote}
                  onChange={(e) => setPostNote(e.target.value)}
                />
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowNote(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-[#0ABFDF] to-[#F9A159]"
                    onClick={submitPost}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="space-y-4">
                  <h3 className="font-semibold text-center">Charging Posts</h3>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#0ABFDF] to-[#2AC20E]"
                    onClick={() => handleCharge(15, 'inspiring')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Inspiring (+15%)
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#0ABFDF] to-[#2AC20E]"
                    onClick={() => handleCharge(20, 'body_positivity')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Body Positivity (+20%)
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#0ABFDF] to-[#2AC20E]"
                    onClick={() => handleCharge(10, 'positive_quote')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Positive Quote (+10%)
                  </Button>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-center">Draining Posts</h3>
                  <Button 
                    variant="outline" 
                    className="w-full border-red-300 text-red-500"
                    onClick={() => handleCharge(-10, 'insecure_comparison')}
                  >
                    <Minus className="mr-2 h-4 w-4" />
                    Comparison (-10%)
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-red-300 text-red-500"
                    onClick={() => handleCharge(-20, 'unrealistic_standards')}
                  >
                    <Minus className="mr-2 h-4 w-4" />
                    Unrealistic (-20%)
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-red-300 text-red-500"
                    onClick={() => handleCharge(-15, 'self_doubt_negativity')}
                  >
                    <Minus className="mr-2 h-4 w-4" />
                    Self-doubt (-15%)
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mt-8 w-full max-w-md">
              <Progress value={(timeRemaining / (5 * 60)) * 100} className="h-2" />
            </div>
            
            {!showNote && (
              <Button 
                className="mt-8 bg-[#0ABFDF]" 
                onClick={() => onComplete(batteryPercentage)}
                disabled={timeRemaining > 0}
              >
                {timeRemaining > 0 ? `Wait ${formatTime(timeRemaining)}` : 'Complete Activity'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BatteryTracker;
