
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import EmojiSlider from "@/components/ui/EmojiSlider";
import { CheckCircle } from 'lucide-react';

interface ReflectionSectionProps {
  finalPercentage: number;
  onComplete: (reflectionData: {
    feeling: string;
    selectedVibes: string[];
    boostTopics: string[];
    drainPatterns: string;
    accountsToUnfollow: string;
    accountsToFollow: string;
    nextScrollStrategy: string;
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
  const [accountsToUnfollow, setAccountsToUnfollow] = useState<string>("");
  const [accountsToFollow, setAccountsToFollow] = useState<string>("");
  const [nextScrollStrategy, setNextScrollStrategy] = useState<string>("");
  
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

  const handleSubmit = () => {
    onComplete({
      feeling: getFeelingFromSlider(moodValue[0]),
      selectedVibes: selectedVibes,
      boostTopics: selectedTopics,
      drainPatterns: drainPatterns,
      accountsToUnfollow: accountsToUnfollow,
      accountsToFollow: accountsToFollow,
      nextScrollStrategy: nextScrollStrategy
    });
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

        <div className="space-y-8">
          {/* How do you feel section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">How do you feel after this scroll?</h3>
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

          {/* Vibes section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">What vibes did you experience?</h3>
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

          {/* Topics section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">What types of posts boosted your energy the most?</h3>
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

          {/* Drain patterns section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">What patterns did you notice in the posts that drained you?</h3>
            <Textarea 
              className="w-full p-4 border border-gray-300 rounded-lg" 
              value={drainPatterns}
              onChange={(e) => setDrainPatterns(e.target.value)}
              placeholder="Share any patterns or common themes you noticed in posts that decreased your battery level..."
              rows={3}
            />
          </div>

          {/* Accounts to unfollow */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">One account I want to unfollow is…</h3>
            <Input 
              className="w-full p-4 border border-gray-300 rounded-lg" 
              value={accountsToUnfollow}
              onChange={(e) => setAccountsToUnfollow(e.target.value)}
              placeholder="@account_name"
            />
          </div>

          {/* Accounts to follow more */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">One I want to see more of is…</h3>
            <Input 
              className="w-full p-4 border border-gray-300 rounded-lg" 
              value={accountsToFollow}
              onChange={(e) => setAccountsToFollow(e.target.value)}
              placeholder="@account_name"
            />
          </div>

          {/* Next scroll strategy */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">One thing I'll try next time I scroll is…</h3>
            <Textarea 
              className="w-full p-4 border border-gray-300 rounded-lg" 
              value={nextScrollStrategy}
              onChange={(e) => setNextScrollStrategy(e.target.value)}
              placeholder="Share a strategy you'll try next time..."
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#0ABFDF] to-[#F9A159] text-white px-8 py-2 rounded-full text-lg"
          >
            Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReflectionSection;
