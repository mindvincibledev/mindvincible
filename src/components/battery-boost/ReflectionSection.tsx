
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BatteryFull, Smile, Frown, Meh, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReflectionSectionProps {
  finalPercentage: number;
  onComplete: (reflectionData: {
    feeling: string;
    accountsToUnfollow: string;
    accountsToFollow: string;
    nextScrollStrategy: string;
  }) => void;
}

const ReflectionSection: React.FC<ReflectionSectionProps> = ({ finalPercentage, onComplete }) => {
  const [currentTab, setCurrentTab] = useState("feeling");
  const [feeling, setFeeling] = useState<string>("");
  const [accountsToUnfollow, setAccountsToUnfollow] = useState<string>("");
  const [accountsToFollow, setAccountsToFollow] = useState<string>("");
  const [nextScrollStrategy, setNextScrollStrategy] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const getBatteryColor = () => {
    if (finalPercentage >= 70) return 'from-[#0ABFDF] to-[#2AC20E]';
    if (finalPercentage >= 40) return 'from-[#F9A159] to-[#0ABFDF]';
    return 'from-[#ff6b6b] to-[#F9A159]';
  };

  const getBatteryMessage = () => {
    if (finalPercentage >= 80) return "Fully Charged! 🚀";
    if (finalPercentage >= 60) return "Well Charged! ⚡";
    if (finalPercentage >= 40) return "Half Battery! 🔋";
    if (finalPercentage >= 20) return "Low Battery! 📉";
    return "Battery Drained! 🪫";
  };

  const handleNextStep = () => {
    if (currentTab === "feeling") {
      setCurrentTab("unfollow");
    } else if (currentTab === "unfollow") {
      setCurrentTab("follow");
    } else if (currentTab === "follow") {
      setCurrentTab("strategy");
    } else {
      // Submit all data
      onComplete({
        feeling: selectedMood || feeling,
        accountsToUnfollow,
        accountsToFollow,
        nextScrollStrategy
      });
    }
  };

  const selectMood = (mood: string) => {
    setSelectedMood(mood);
    setFeeling(mood);
  };

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-lg shadow-xl border-none overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-2xl font-bold mb-2">Scroll Summary</h2>
            <div className="relative h-32 w-20 mb-4 border-2 border-gray-800 rounded-lg overflow-hidden">
              <div 
                className={`absolute bottom-0 w-full bg-gradient-to-t ${getBatteryColor()}`}
                style={{ height: `${finalPercentage}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xl font-bold text-white mix-blend-difference">{finalPercentage}%</p>
              </div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-gray-800 rounded-t-lg"></div>
            </div>
            <p className="text-xl font-bold bg-gradient-to-r from-[#0ABFDF] to-[#F9A159] bg-clip-text text-transparent">
              {getBatteryMessage()}
            </p>
          </motion.div>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <ScrollArea className="w-full">
            <TabsList className="w-full mb-6 overflow-x-auto flex whitespace-nowrap">
              <TabsTrigger value="feeling" className="flex-1">How do you feel?</TabsTrigger>
              <TabsTrigger value="unfollow" className="flex-1">Who to unfollow?</TabsTrigger>
              <TabsTrigger value="follow" className="flex-1">Who to follow more?</TabsTrigger>
              <TabsTrigger value="strategy" className="flex-1">Next scroll strategy</TabsTrigger>
            </TabsList>
          </ScrollArea>

          <TabsContent value="feeling" className="mt-0">
            <div className="space-y-6">
              <p className="text-center text-lg">How do you feel after this scroll?</p>
              
              <div className="flex justify-center space-x-8 mb-6">
                <button 
                  onClick={() => selectMood("Happy")}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all ${selectedMood === "Happy" ? "bg-green-100 scale-110" : "bg-gray-50"}`}
                >
                  <Smile size={40} className="text-green-500 mb-2" />
                  <span>Happy</span>
                </button>
                
                <button 
                  onClick={() => selectMood("Neutral")}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all ${selectedMood === "Neutral" ? "bg-blue-100 scale-110" : "bg-gray-50"}`}
                >
                  <Meh size={40} className="text-blue-500 mb-2" />
                  <span>Neutral</span>
                </button>
                
                <button 
                  onClick={() => selectMood("Drained")}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all ${selectedMood === "Drained" ? "bg-red-100 scale-110" : "bg-gray-50"}`}
                >
                  <Frown size={40} className="text-red-500 mb-2" />
                  <span>Drained</span>
                </button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Or describe how you feel in your own words:</label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg" 
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                  placeholder="Describe how you feel after your scroll session..."
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="unfollow" className="mt-0">
            <div className="space-y-6">
              <p className="text-center text-lg">Which accounts or content types drained your energy?</p>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">I might want to unfollow or see less of:</label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg" 
                  value={accountsToUnfollow}
                  onChange={(e) => setAccountsToUnfollow(e.target.value)}
                  placeholder="List accounts, hashtags, or content types that negatively impacted your energy..."
                  rows={5}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="follow" className="mt-0">
            <div className="space-y-6">
              <p className="text-center text-lg">Which accounts or content boosted your energy?</p>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">I want to see more of:</label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg" 
                  value={accountsToFollow}
                  onChange={(e) => setAccountsToFollow(e.target.value)}
                  placeholder="List accounts, hashtags, or content types that positively impacted your energy..."
                  rows={5}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="strategy" className="mt-0">
            <div className="space-y-6">
              <p className="text-center text-lg">What's one thing you'll try next time you scroll?</p>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Next time I scroll, I'll:</label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg" 
                  value={nextScrollStrategy}
                  onChange={(e) => setNextScrollStrategy(e.target.value)}
                  placeholder="Share a strategy for having a more positive scroll experience next time..."
                  rows={5}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleNextStep}
            className="bg-gradient-to-r from-[#0ABFDF] to-[#F9A159] text-white flex items-center gap-2"
          >
            {currentTab === "strategy" ? "Complete" : "Continue"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReflectionSection;
