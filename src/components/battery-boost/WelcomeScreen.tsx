
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BatteryMedium, Zap, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PastBatteryEntries from './PastBatteryEntries';

interface WelcomeScreenProps {
  onStart: () => void;
  userEntries?: any[]; // Past entries from database
  onRefreshEntries?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, userEntries = [], onRefreshEntries }) => {
  const [activeTab, setActiveTab] = useState("scavenger");
  
  return (
    <Card className="p-6 bg-white/90 backdrop-blur-lg shadow-xl border-none overflow-hidden">
      <CardContent className="p-0">
        <motion.div 
          className="relative w-24 h-24 mx-auto mb-4 mt-4"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <div className="relative flex items-center justify-center">
            <BatteryMedium size={64} className="text-[#0ABFDF]" />
            <motion.div
              className="absolute"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut",
              }}
            >
              <Zap size={24} className="text-[#F9A159]" />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0ABFDF] to-[#F9A159] bg-clip-text text-transparent mb-4">
            Battery Boost
          </h1>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed max-w-xl mx-auto">
            Not all scrolling is the same. Some posts boost us, some drain us. Let's see what your feed is doing to your energy.
          </p>
        </motion.div>
        
        <Tabs defaultValue="scavenger" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-2 p-1 mb-8 bg-white/70 border-2 border-gray-200 shadow-md">
            <TabsTrigger 
              value="scavenger"
              className="font-medium text-base py-3 px-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF8A48] data-[state=active]:to-[#FC68B3] data-[state=active]:text-white"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Scavenger Hunt
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="font-medium text-base py-3 px-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF8A48] data-[state=active]:to-[#FC68B3] data-[state=active]:text-white"
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Your History
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="scavenger" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="text-center p-4">
              <h2 className="text-xl font-semibold mb-4">Battery Scavenger Hunt</h2>
              <p className="mb-6">
                Scroll through your social feed and track which posts charge or drain your battery. 
                We'll help you identify patterns and create a healthier scroll experience.
              </p>
              <Button 
                onClick={onStart}
                className="bg-gradient-to-r from-[#0ABFDF] to-[#F9A159] text-white hover:opacity-90 transition-all duration-300 px-8 py-6 text-lg rounded-full"
              >
                Start Scavenger Hunt
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4 text-center">Your Battery History</h2>
              <PastBatteryEntries entries={userEntries} onRefreshEntries={onRefreshEntries} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WelcomeScreen;
