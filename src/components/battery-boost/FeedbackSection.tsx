
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          <h2 className="text-2xl font-bold mb-10 text-center">Activity Complete!</h2>
          
          <div className="flex items-center justify-center w-full mb-12">
            <div className="flex flex-col items-center">
              <p className="text-gray-600 mb-4 font-medium text-center">Starting Battery</p>
              <div className="relative w-24 h-48 border-2 border-gray-800 rounded-2xl overflow-hidden">
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-gray-800 rounded-t-lg"></div>
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-[#F9A159] to-[#0ABFDF]"
                  style={{ height: `${initialBatteryLevel}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xl font-bold text-white mix-blend-difference">{initialBatteryLevel}%</p>
                </div>
              </div>
            </div>
            
            <div className="mx-8 flex items-center">
              <ArrowRight size={36} className="text-gray-700" />
            </div>
            
            <div className="flex flex-col items-center">
              <p className="text-gray-600 mb-4 font-medium text-center">Final Battery</p>
              <div className="relative w-24 h-48 border-2 border-gray-800 rounded-2xl overflow-hidden">
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-gray-800 rounded-t-lg"></div>
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-[#0ABFDF] to-[#2AC20E]"
                  style={{ height: `${finalBatteryLevel}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xl font-bold text-white mix-blend-difference">{finalBatteryLevel}%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 py-6 text-lg"
              onClick={handleReturnHome}
            >
              <Home className="h-5 w-5" />
              Return to Resources
            </Button>
            
            <Button
              className="bg-gradient-to-r from-[#33C3F0] to-[#F97316] text-white py-6 text-lg"
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
