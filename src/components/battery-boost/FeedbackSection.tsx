
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import VisibilityToggle from '@/components/ui/VisibilityToggle';

interface FeedbackSectionProps {
  initialBatteryLevel: number;
  finalBatteryLevel: number;
  onComplete: () => void;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ 
  initialBatteryLevel, 
  finalBatteryLevel,
  onComplete 
}) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmitFeedback = () => {
    setIsSubmitting(true);
    
    // Here you would normally send the feedback to your backend
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you for your feedback!");
      onComplete();
    }, 1000);
  };

  const handleReturnHome = () => {
    navigate('/resources');
  };

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-lg shadow-xl border-none overflow-hidden">
      <CardContent className="p-0">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Activity Complete!</h2>
          
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="text-center">
              <p className="text-sm text-gray-500">Starting Battery</p>
              <div className="relative h-24 w-12 mb-2 border-2 border-gray-800 rounded-lg overflow-hidden">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-[#F9A159] to-[#0ABFDF]"
                  style={{ height: `${initialBatteryLevel}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xs font-bold text-white mix-blend-difference">{initialBatteryLevel}%</p>
                </div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-gray-800 rounded-t-lg"></div>
              </div>
            </div>
            
            <div className="text-2xl font-bold">→</div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">Final Battery</p>
              <div className="relative h-24 w-12 mb-2 border-2 border-gray-800 rounded-lg overflow-hidden">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-[#0ABFDF] to-[#2AC20E]"
                  style={{ height: `${finalBatteryLevel}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xs font-bold text-white mix-blend-difference">{finalBatteryLevel}%</p>
                </div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-gray-800 rounded-t-lg"></div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 w-full max-w-md">
            <Button
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={handleReturnHome}
            >
              <Home className="h-4 w-4" />
              Return to Resources
            </Button>
            
            <Button
              className="flex-1 bg-gradient-to-r from-[#0ABFDF] to-[#F9A159] text-white"
              onClick={handleSubmitFeedback}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default FeedbackSection;
