
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";
import EmojiSlider from '@/components/ui/EmojiSlider';
import VisibilityToggle from '@/components/ui/VisibilityToggle';

export interface ReflectionData {
  whatFeltEasy: string;
  whatFeltHard: string;
  otherPeopleResponses: string;
  tryNextTime: string;
  whatFeltEasyRating: number;
  whatFeltHardRating: number;
  otherPeopleRating: number;
  tryNextTimeConfidence: number;
  visibility: boolean;
}

interface ReflectionSectionProps {
  onSubmit: (data: ReflectionData) => void;
  isSubmitting: boolean;
}

const ReflectionSection = ({ onSubmit, isSubmitting }: ReflectionSectionProps) => {
  const [whatFeltEasy, setWhatFeltEasy] = useState('');
  const [whatFeltHard, setWhatFeltHard] = useState('');
  const [otherPeopleResponses, setOtherPeopleResponses] = useState('');
  const [tryNextTime, setTryNextTime] = useState('');
  
  const [whatFeltEasyRating, setWhatFeltEasyRating] = useState([5]);
  const [whatFeltHardRating, setWhatFeltHardRating] = useState([5]);
  const [otherPeopleRating, setOtherPeopleRating] = useState([5]);
  const [tryNextTimeConfidence, setTryNextTimeConfidence] = useState([5]);
  const [visibility, setVisibility] = useState(false); // Changed default to false

  const handleSubmit = () => {
    const data: ReflectionData = {
      whatFeltEasy,
      whatFeltHard,
      otherPeopleResponses,
      tryNextTime,
      whatFeltEasyRating: whatFeltEasyRating[0],
      whatFeltHardRating: whatFeltHardRating[0],
      otherPeopleRating: otherPeopleRating[0],
      tryNextTimeConfidence: tryNextTimeConfidence[0],
      visibility,
    };
    onSubmit(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="what-felt-easy">What felt easy about the interaction?</Label>
        <Textarea
          id="what-felt-easy"
          value={whatFeltEasy}
          onChange={(e) => setWhatFeltEasy(e.target.value)}
          placeholder="Describe what felt easy..."
          className="min-h-[80px]"
        />
        <EmojiSlider
          value={whatFeltEasyRating}
          onValueChange={setWhatFeltEasyRating}
          label="How easy was it? 🤔"
          minEmoji="😓"
          middleEmoji="🙂"
          maxEmoji="🌟"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="what-felt-hard">What felt hard about the interaction?</Label>
        <Textarea
          id="what-felt-hard"
          value={whatFeltHard}
          onChange={(e) => setWhatFeltHard(e.target.value)}
          placeholder="Describe what felt hard..."
          className="min-h-[80px]"
        />
        <EmojiSlider
          value={whatFeltHardRating}
          onValueChange={setWhatFeltHardRating}
          label="How hard was it? 🤔"
          minEmoji="😓"
          middleEmoji="🙂"
          maxEmoji="🌟"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="other-people-responses">How did other people respond?</Label>
        <Textarea
          id="other-people-responses"
          value={otherPeopleResponses}
          onChange={(e) => setOtherPeopleResponses(e.target.value)}
          placeholder="Describe how others responded..."
          className="min-h-[80px]"
        />
        <EmojiSlider
          value={otherPeopleRating}
          onValueChange={setOtherPeopleRating}
          label="How would you rate their responses? 🤔"
          minEmoji="😓"
          middleEmoji="🙂"
          maxEmoji="🌟"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="try-next-time">What will you try next time?</Label>
        <Textarea
          id="try-next-time"
          value={tryNextTime}
          onChange={(e) => setTryNextTime(e.target.value)}
          placeholder="Describe what you'll try next time..."
          className="min-h-[80px]"
        />
        <EmojiSlider
          value={tryNextTimeConfidence}
          onValueChange={setTryNextTimeConfidence}
          label="How confident are you in trying this next time? 🤔"
          minEmoji="😓"
          middleEmoji="🙂"
          maxEmoji="🌟"
        />
      </div>
      
      <VisibilityToggle
        isVisible={visibility}
        onToggle={setVisibility}
        description="Make visible to clinicians"
      />

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full mt-6 bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90"
      >
        {isSubmitting ? "Submitting..." : "Complete Goal"}
      </Button>
    </motion.div>
  );
};

export default ReflectionSection;
