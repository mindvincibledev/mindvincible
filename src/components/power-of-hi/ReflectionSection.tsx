
import React from 'react';
import { motion } from 'framer-motion';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ReflectionSectionProps {
  onSubmit: (data: ReflectionData) => void;
  isSubmitting: boolean;
}

export interface ReflectionData {
  whatFeltEasy: string;
  whatFeltHard: string;
  otherPeopleResponses: string;
  tryNextTime: string;
}

const ReflectionSection = ({ onSubmit, isSubmitting }: ReflectionSectionProps) => {
  const [whatFeltEasy, setWhatFeltEasy] = React.useState("");
  const [whatFeltHard, setWhatFeltHard] = React.useState("");
  const [otherPeopleResponses, setOtherPeopleResponses] = React.useState("");
  const [tryNextTime, setTryNextTime] = React.useState("");
  const [easyDifficulty, setEasyDifficulty] = React.useState([5]);
  const [hardDifficulty, setHardDifficulty] = React.useState([5]);
  const [isConfident, setIsConfident] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      whatFeltEasy,
      whatFeltHard,
      otherPeopleResponses,
      tryNextTime
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
            <Label>How easy was it? 😊</Label>
            <Slider
              value={easyDifficulty}
              onValueChange={setEasyDifficulty}
              max={10}
              step={1}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>Super Easy</span>
              <span>Just Right</span>
              <span>Challenging</span>
            </div>
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
            <Label>How challenging was it? 🤔</Label>
            <Slider
              value={hardDifficulty}
              onValueChange={setHardDifficulty}
              max={10}
              step={1}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>A Bit Tough</span>
              <span>Pretty Hard</span>
              <span>Super Hard</span>
            </div>
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
