
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BatteryMedium, Zap, BarChart, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';

interface WelcomeScreenProps {
  onStart: () => void;
  userEntries?: any[]; // Past entries from database
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, userEntries = [] }) => {
  const [activeTab, setActiveTab] = useState("scavenger");
  const navigate = useNavigate();
  
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
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="scavenger">Scavenger Hunt</TabsTrigger>
            <TabsTrigger value="boost">Boost Others</TabsTrigger>
            <TabsTrigger value="history">Your History</TabsTrigger>
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
          
          <TabsContent value="boost" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="text-center p-4">
              <h2 className="text-xl font-semibold mb-4">Boost Others' Batteries</h2>
              <p className="mb-6">
                Create an uplifting post that might charge someone else's battery. 
                Share positivity, encouragement, or your authentic self.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-2">Ideas to boost others:</h3>
                <ul className="text-left space-y-2 max-w-md mx-auto">
                  <li>• Share a genuine moment from your day</li>
                  <li>• Post a compliment about someone you appreciate</li>
                  <li>• Create a quick positive quote or affirmation</li>
                  <li>• Share something you're grateful for</li>
                </ul>
              </div>
              <Button 
                onClick={() => {/* Functionality to be implemented */}}
                className="bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] text-white hover:opacity-90 transition-all duration-300 px-8 py-4 text-lg rounded-full flex items-center gap-2"
              >
                <Users className="h-5 w-5" />
                Coming Soon
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="text-center p-4">
              <h2 className="text-xl font-semibold mb-4">Your Battery History</h2>
              {userEntries.length > 0 ? (
                <div className="space-y-4">
                  <p className="mb-4">Review your past battery scavenger hunts and see your progress over time.</p>
                  {/* History entries would be displayed here */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <BarChart className="h-32 w-full text-[#0ABFDF] opacity-50" />
                    <p className="text-sm text-gray-500 mt-2">Your battery history visualization</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mb-6">You haven't completed any battery scavenger hunts yet. Start your first one to build your history!</p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 flex items-center justify-center">
                    <BarChart className="h-24 w-full text-gray-300" />
                  </div>
                </div>
              )}
              <Button 
                onClick={() => {/* Functionality to be implemented */}}
                className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90 transition-all duration-300 px-8 py-4 text-lg rounded-full flex items-center gap-2"
              >
                <BarChart className="h-5 w-5" />
                Coming Soon
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WelcomeScreen;
