
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface GutCheckScreenProps {
  onComplete: (selection: string) => void;
  decisionData: {
    considerationPath: string;
    otherPath: string;
    change_a?: string;
    feel_a?: string;
    change_b?: string;
    feel_b?: string;
    challenges_a?: string;
    challenges_b?: string;
    strengths_a?: string[];
    strengths_b?: string[];
    values_a?: string;
    values_b?: string;
    tag_a?: string[];
    tag_b?: string[];
    gain_a?: string;
    gain_b?: string;
    future_a?: string;
    future_b?: string;
  };
}

// Helper function to get summary points with default fallbacks
const getSummaryPoints = (data: GutCheckScreenProps['decisionData'], path: 'A' | 'B') => {
  const points = [];
  const field = path === 'A' ? 'A' : 'B';
  
  // Daily impact
  if (data[`change${field}` as keyof typeof data]) {
    points.push({
      emoji: '💡',
      title: 'Daily Impact',
      content: data[`change${field}` as keyof typeof data] as string
    });
  }
  
  // Challenges
  if (data[`challenges${field}` as keyof typeof data]) {
    points.push({
      emoji: '🧱',
      title: 'Challenges',
      content: data[`challenges${field}` as keyof typeof data] as string
    });
  }
  
  // Strengths
  const strengths = data[`strengths${field}` as keyof typeof data] as string[] | undefined;
  if (strengths && strengths.length > 0) {
    points.push({
      emoji: '💪',
      title: 'Strengths',
      content: strengths.join(', ')
    });
  }
  
  // Values alignment
  if (data[`values${field}` as keyof typeof data]) {
    points.push({
      emoji: '🧭',
      title: 'Values',
      content: data[`values${field}` as keyof typeof data] as string
    });
  }
  
  // Future gains
  if (data[`gain${field}` as keyof typeof data]) {
    points.push({
      emoji: '🔮',
      title: 'Future Gains',
      content: data[`gain${field}` as keyof typeof data] as string
    });
  }
  
  return points;
};

const GutCheckScreen: React.FC<GutCheckScreenProps> = ({ onComplete, decisionData }) => {
  const [selection, setSelection] = useState<string>('');
  
  const summaryPointsA = getSummaryPoints(decisionData, 'A');
  const summaryPointsB = getSummaryPoints(decisionData, 'B');
  
  const handleComplete = () => {
    if (!selection) {
      return;
    }
    console.log("Completing with selection:", selection);
    onComplete(selection);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-4">
          Gut Check: Which Path Feels Right?
        </h2>
        
        <p className="text-gray-600 text-center mb-8">
          Now that you've reflected, let's see which path resonates with you the most.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Road A */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card 
              className={`cursor-pointer border-2 transition-all ${
                selection === 'A' 
                  ? 'border-[#3DFDFF] bg-gradient-to-br from-white to-[#D5D5F1]/10 shadow-lg' 
                  : 'hover:border-[#D5D5F1]'
              }`}
              onClick={() => setSelection('A')}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Road A: {decisionData.considerationPath}</span>
                  {selection === 'A' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-[#3DFDFF] rounded-full p-1"
                    >
                      <Check className="h-4 w-4 text-white" />
                    </motion.div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {summaryPointsA.length > 0 ? (
                    summaryPointsA.map((point, index) => (
                      <div key={index}>
                        {index > 0 && <Separator className="my-2" />}
                        <div className="flex gap-2">
                          <div className="text-xl">{point.emoji}</div>
                          <div>
                            <h4 className="font-medium text-sm">{point.title}</h4>
                            <p className="text-sm text-gray-600">{point.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic text-sm">No reflection data provided</p>
                  )}
                  
                  {decisionData.future_a && (
                    <div className="text-center mt-4">
                      <div className="text-3xl mb-1">{decisionData.future_a}</div>
                      <p className="text-xs text-gray-500">Future symbol</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Road B */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Card 
              className={`cursor-pointer border-2 transition-all ${
                selection === 'B' 
                  ? 'border-[#3DFDFF] bg-gradient-to-br from-white to-[#3DFDFF]/10 shadow-lg' 
                  : 'hover:border-[#3DFDFF]'
              }`}
              onClick={() => setSelection('B')}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Road B: {decisionData.otherPath}</span>
                  {selection === 'B' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-[#3DFDFF] rounded-full p-1"
                    >
                      <Check className="h-4 w-4 text-white" />
                    </motion.div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {summaryPointsB.length > 0 ? (
                    summaryPointsB.map((point, index) => (
                      <div key={index}>
                        {index > 0 && <Separator className="my-2" />}
                        <div className="flex gap-2">
                          <div className="text-xl">{point.emoji}</div>
                          <div>
                            <h4 className="font-medium text-sm">{point.title}</h4>
                            <p className="text-sm text-gray-600">{point.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic text-sm">No reflection data provided</p>
                  )}
                  
                  {decisionData.future_b && (
                    <div className="text-center mt-4">
                      <div className="text-3xl mb-1">{decisionData.future_b}</div>
                      <p className="text-xs text-gray-500">Future symbol</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <div className="text-center">
          <p className="font-medium mb-6">Which path feels more like you right now?</p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button
              variant={selection === 'A' ? 'default' : 'outline'}
              onClick={() => setSelection('A')}
              className={`${
                selection === 'A' ? 'bg-gradient-to-r from-[#D5D5F1] to-[#3DFDFF]' : ''
              } min-w-[150px]`}
            >
              Road A feels right
            </Button>
            
            <Button
              variant={selection === 'B' ? 'default' : 'outline'}
              onClick={() => setSelection('B')}
              className={`${
                selection === 'B' ? 'bg-gradient-to-r from-[#3DFDFF] to-[#F5DF4D]' : ''
              } min-w-[150px]`}
            >
              Road B feels right
            </Button>
            
            <Button
              variant={selection === 'undecided' ? 'default' : 'outline'}
              onClick={() => setSelection('undecided')}
              className={`${
                selection === 'undecided' ? 'bg-gradient-to-r from-[#FC68B3] to-[#FF8A48]' : ''
              } min-w-[150px]`}
            >
              Still deciding
            </Button>
          </div>
          
          <div className="mt-8">
            <Button 
              onClick={handleComplete}
              disabled={!selection}
              className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90 px-8"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Complete Decision Map
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Remember, your choice isn't permanent! You can always revisit this later.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default GutCheckScreen;
