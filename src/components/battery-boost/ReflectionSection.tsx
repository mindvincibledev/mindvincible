
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmojiSlider from "@/components/ui/EmojiSlider";
import VisibilityToggle from "@/components/ui/VisibilityToggle";
import { CheckCircle } from 'lucide-react';

interface ReflectionSectionProps {
  finalPercentage: number;
  onComplete: (reflectionData: {
    feeling: string;
    selectedVibes: string[];
    boostTopics: string[];
    drainPatterns: string;
  }) => void;
}

const vibeOptions = [
  "Chill", "Funny", "Inspiring", "Creative", "Educational", 
  "Mad", "Sad", "Anxious", "Jealous", "FOMO", 
  "Calm", "Energetic", "Nostalgic", "Curious"
];

const topicOptions = [
  "Friends", "Family", "Pets", "Nature", "Food",
  "Fashion", "Music", "Art", "Sports", "Gaming",
  "Travel", "Fitness", "Beauty", "Science", "Memes", 
  "Celebrities", "Personal Growth"
];

const ReflectionSection: React.FC<ReflectionSectionProps> = ({ finalPercentage, onComplete }) => {
  const [moodValue, setMoodValue] = useState<number[]>([5]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [drainPatterns, setDrainPatterns] = useState<string>("");
  const [currentTab, setCurrentTab] = useState("feeling");
  
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

  const handleVibeToggle = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter(v => v !== vibe));
    } else {
      setSelectedVibes([...selectedVibes, vibe]);
    }
  };

  const handleTopicToggle = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const getFeelingFromSlider = (value: number) => {
    if (value <= 2) return "Not great";
    if (value <= 5) return "Neutral";
    if (value <= 7) return "Good";
    return "Excellent";
  };

  const handleNextStep = () => {
    if (currentTab === "feeling") {
      setCurrentTab("vibes");
    } else if (currentTab === "vibes") {
      setCurrentTab("boost");
    } else if (currentTab === "boost") {
      setCurrentTab("drain");
    } else {
      // Submit all data
      onComplete({
        feeling: getFeelingFromSlider(moodValue[0]),
        selectedVibes,
        boostTopics: selectedTopics,
        drainPatterns
      });
    }
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
            <p className="text-xl font-bold bg-gradient-to-r from-[#0ABFDF] to-[#F9A159] bg-clip-text text-transparent mb-4">
              Your battery is now at: ⚡️ {getBatteryMessage()}
            </p>
          </motion.div>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <div className="w-full overflow-hidden">
            <TabsList className="w-full mb-6 flex whitespace-nowrap overflow-x-auto p-1 gap-1 bg-white shadow-md border-2 border-gray-200">
              <TabsTrigger value="feeling" className="flex-1 py-3 px-4 text-base font-medium">
                How you feel?
              </TabsTrigger>
              <TabsTrigger value="vibes" className="flex-1 py-3 px-4 text-base font-medium">
                Your vibes
              </TabsTrigger>
              <TabsTrigger value="boost" className="flex-1 py-3 px-4 text-base font-medium">
                Energy boosters
              </TabsTrigger>
              <TabsTrigger value="drain" className="flex-1 py-3 px-4 text-base font-medium">
                Energy drainers
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="feeling" className="mt-0">
            <div className="space-y-6">
              <p className="text-center text-lg font-medium mb-6">How do you feel after this scroll?</p>
              
              <div className="bg-white/70 p-6 rounded-lg shadow-sm">
                <EmojiSlider 
                  value={moodValue}
                  onValueChange={setMoodValue}
                  minEmoji="😞"
                  middleEmoji="😐"
                  maxEmoji="😃"
                  label="Slide to match your mood"
                />
                <p className="text-center mt-4 text-lg">
                  {getFeelingFromSlider(moodValue[0])}
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="vibes" className="mt-0">
            <div className="space-y-6">
              <p className="text-center text-lg font-medium mb-6">What vibes did you experience?</p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {vibeOptions.map((vibe) => (
                  <Badge
                    key={vibe}
                    className={`cursor-pointer text-base py-2 px-4 ${
                      selectedVibes.includes(vibe)
                        ? "bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] hover:from-[#FC68B3] hover:to-[#FF8A48] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => handleVibeToggle(vibe)}
                  >
                    {selectedVibes.includes(vibe) && <CheckCircle className="w-4 h-4 mr-1 inline" />}
                    {vibe}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="boost" className="mt-0">
            <div className="space-y-6">
              <p className="text-center text-lg font-medium mb-6">What types of posts boosted your energy the most?</p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {topicOptions.map((topic) => (
                  <Badge
                    key={topic}
                    className={`cursor-pointer text-base py-2 px-4 ${
                      selectedTopics.includes(topic)
                        ? "bg-gradient-to-r from-[#0ABFDF] to-[#2AC20E] hover:from-[#2AC20E] hover:to-[#0ABFDF] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => handleTopicToggle(topic)}
                  >
                    {selectedTopics.includes(topic) && <CheckCircle className="w-4 h-4 mr-1 inline" />}
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="drain" className="mt-0">
            <div className="space-y-6">
              <p className="text-center text-lg font-medium mb-6">What patterns did you notice in the posts that drained you?</p>
              
              <div className="space-y-2">
                <Textarea 
                  className="w-full p-4 border border-gray-300 rounded-lg min-h-[150px]" 
                  value={drainPatterns}
                  onChange={(e) => setDrainPatterns(e.target.value)}
                  placeholder="Share any patterns or common themes you noticed in posts that decreased your battery level..."
                  rows={5}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleNextStep}
            className="bg-gradient-to-r from-[#0ABFDF] to-[#F9A159] text-white px-8 py-2 rounded-full text-lg"
          >
            {currentTab === "drain" ? "Complete" : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReflectionSection;
