
import React from 'react';
import { motion } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import EmojiSlider from './EmojiSlider';

interface ReflectionSectionProps {
  onSubmit: (data: ReflectionData) => void;
  isSubmitting: boolean;
}

export interface ReflectionData {
  whatFeltEasy: string;
  whatFeltEasyRating: number;
  whatFeltHard: string;
  whatFeltHardRating: number;
  otherPeopleResponses: string;
  otherPeopleRating: number;
  tryNextTime: string;
  tryNextTimeConfidence: number;
}

const ReflectionSection = ({ onSubmit, isSubmitting }: ReflectionSectionProps) => {
  const [whatFeltEasy, setWhatFeltEasy] = React.useState("");
  const [whatFeltEasyRating, setWhatFeltEasyRating] = React.useState([2]);
  const [whatFeltHard, setWhatFeltHard] = React.useState("");
  const [whatFeltHardRating, setWhatFeltHardRating] = React.useState([2]);
  const [otherPeopleResponses, setOtherPeopleResponses] = React.useState("");
  const [otherPeopleRating, setOtherPeopleRating] = React.useState([2]);
  const [tryNextTime, setTryNextTime] = React.useState("");
  const [tryNextTimeConfidence, setTryNextTimeConfidence] = React.useState([2]);
  const [isConfident, setIsConfident] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      whatFeltEasy,
      whatFeltEasyRating: whatFeltEasyRating[0],
      whatFeltHard,
      whatFeltHardRating: whatFeltHardRating[0],
      otherPeopleResponses,
      otherPeopleRating: otherPeopleRating[0],
      tryNextTime,
      tryNextTimeConfidence: tryNextTimeConfidence[0]
    });
  };

  const easyEmojis = ["😰", "😐", "🙂", "😊", "🤗"];
  const hardEmojis = ["😱", "😓", "😐", "😌", "💪"];
  const surpriseEmojis = ["😴", "🤔", "😲", "🤯", "🤩"];
  const confidenceEmojis = ["😰", "🤔", "🙂", "😊", "🚀"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
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
              emojis={easyEmojis}
              label="How easy was it?"
              description="Slide to show how comfortable you felt"
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
              emojis={hardEmojis}
              label="How challenging was it?"
              description="Slide to show how difficult it felt"
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
              emojis={surpriseEmojis}
              label="How surprising were their responses?"
              description="Slide to show your level of surprise"
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
              emojis={confidenceEmojis}
              label="How confident do you feel about trying it?"
              description="Slide to show your confidence level"
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
