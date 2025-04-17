
import React from 'react';
import { motion } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import EmojiSlider from '@/components/ui/EmojiSlider';

interface ReflectionSectionProps {
  onSubmit: (data: ReflectionData) => void;
  isSubmitting: boolean;
}

export interface ReflectionData {
  whatFeltEasy: string;
  whatFeltHard: string;
  otherPeopleResponses: string;
  tryNextTime: string;
  whatFeltEasyRating: number;
  whatFeltHardRating: number;
  otherPeopleRating: number;
  tryNextTimeConfidence: number;
}

const ReflectionSection = ({ onSubmit, isSubmitting }: ReflectionSectionProps) => {
  const [whatFeltEasy, setWhatFeltEasy] = React.useState("");
  const [whatFeltHard, setWhatFeltHard] = React.useState("");
  const [otherPeopleResponses, setOtherPeopleResponses] = React.useState("");
  const [tryNextTime, setTryNextTime] = React.useState("");
  const [whatFeltEasyRating, setWhatFeltEasyRating] = React.useState([5]);
  const [whatFeltHardRating, setWhatFeltHardRating] = React.useState([5]);
  const [otherPeopleRating, setOtherPeopleRating] = React.useState([5]);
  const [tryNextTimeConfidence, setTryNextTimeConfidence] = React.useState([5]);
  const [isConfident, setIsConfident] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      whatFeltEasy,
      whatFeltHard,
      otherPeopleResponses,
      tryNextTime,
      whatFeltEasyRating: whatFeltEasyRating[0],
      whatFeltHardRating: whatFeltHardRating[0],
      otherPeopleRating: otherPeopleRating[0],
      tryNextTimeConfidence: tryNextTimeConfidence[0]
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-4">
            <Label htmlFor="what-felt-easy">What felt easy? 🌟</Label>
            <Textarea
              id="what-felt-easy"
              value={whatFeltEasy}
              onChange={(e) => setWhatFeltEasy(e.target.value)}
              placeholder="Share the moments that flowed naturally..."
              className="min-h-[100px]"
            />
            <EmojiSlider
              value={whatFeltEasyRating}
              onValueChange={setWhatFeltEasyRating}
              label="How easy was it? 😊"
              minEmoji="😓"
              middleEmoji="🙂"
              maxEmoji="🌟"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="what-felt-hard">What felt hard? 💪</Label>
            <Textarea
              id="what-felt-hard"
              value={whatFeltHard}
              onChange={(e) => setWhatFeltHard(e.target.value)}
              placeholder="What were your challenges?"
              className="min-h-[100px]"
            />
            <EmojiSlider
              value={whatFeltHardRating}
              onValueChange={setWhatFeltHardRating}
              label="How challenging was it? 🤔"
              minEmoji="😌"
              middleEmoji="😅"
              maxEmoji="😰"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="other-responses">What surprised you about other people's responses? 🎉</Label>
            <Textarea
              id="other-responses"
              value={otherPeopleResponses}
              onChange={(e) => setOtherPeopleResponses(e.target.value)}
              placeholder="Tell us what unexpected things you discovered..."
              className="min-h-[100px]"
            />
            <EmojiSlider
              value={otherPeopleRating}
              onValueChange={setOtherPeopleRating}
              label="How surprising were their responses? 🤔"
              minEmoji="😐"
              middleEmoji="😲"
              maxEmoji="🤯"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="try-next-time">What's one thing you'll try next time? 🎯</Label>
            <Textarea
              id="try-next-time"
              value={tryNextTime}
              onChange={(e) => setTryNextTime(e.target.value)}
              placeholder="Share your next adventure..."
              className="min-h-[100px]"
            />
            <EmojiSlider
              value={tryNextTimeConfidence}
              onValueChange={setTryNextTimeConfidence}
              label="How confident are you about trying this? 💪"
              minEmoji="😟"
              middleEmoji="🤔"
              maxEmoji="💪"
            />
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Checkbox 
              id="confident"
              checked={isConfident}
              onCheckedChange={(checked) => setIsConfident(checked as boolean)}
            />
            <Label 
              htmlFor="confident"
              className="text-sm font-normal"
            >
              I feel more confident about talking to new people! 🌟
            </Label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !whatFeltEasy || !whatFeltHard || !otherPeopleResponses || !tryNextTime}
          className="w-full md:w-auto bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90"
        >
          {isSubmitting ? (
            "Saving..."
          ) : (
            <>
              Complete Reflection
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default ReflectionSection;
