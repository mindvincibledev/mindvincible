
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Check, X } from 'lucide-react';

interface BonusChallengeProps {
  onComplete: (shared: boolean, sharedPostDescription?: string, sharedPostImpact?: string) => void;
}

const BonusChallenge: React.FC<BonusChallengeProps> = ({ onComplete }) => {
  const [showForm, setShowForm] = useState(false);
  const [sharedPostDescription, setSharedPostDescription] = useState('');
  const [sharedPostImpact, setSharedPostImpact] = useState('');

  const handleAcceptChallenge = () => {
    setShowForm(true);
  };

  const handleDeclineChallenge = () => {
    onComplete(false);
  };

  const handleSubmit = () => {
    onComplete(true, sharedPostDescription, sharedPostImpact);
  };

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-lg shadow-xl border-none overflow-hidden">
      <CardContent className="p-0">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-[#0ABFDF] to-[#F9A159] rounded-full flex items-center justify-center mb-6">
            <Share2 className="text-white" size={32} />
          </div>
          
          <h2 className="text-2xl font-bold mb-4 text-center">Bonus Challenge</h2>
          
          {!showForm ? (
            <>
              <div className="text-center mb-8 max-w-md">
                <p className="text-lg mb-4">
                  Want to boost someone else's battery?
                </p>
                <p className="text-lg mb-6">
                  Find one inspiring post and share it with a friend.
                </p>
                <p className="font-bold text-[#0ABFDF]">
                  +30% bonus charge if you complete this challenge! 🎉
                </p>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  variant="outline"
                  onClick={handleDeclineChallenge}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Skip Challenge
                </Button>
                
                <Button
                  className="bg-gradient-to-r from-[#0ABFDF] to-[#F9A159] text-white flex items-center gap-2"
                  onClick={handleAcceptChallenge}
                >
                  <Check className="h-4 w-4" />
                  Accept Challenge
                </Button>
              </div>
            </>
          ) : (
            <div className="w-full max-w-md">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Which post did you share?
                  </label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    value={sharedPostDescription}
                    onChange={(e) => setSharedPostDescription(e.target.value)}
                    placeholder="Describe the post you shared..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Why did it feel powerful to you?
                  </label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    value={sharedPostImpact}
                    onChange={(e) => setSharedPostImpact(e.target.value)}
                    placeholder="Explain why this post was meaningful..."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  className="bg-gradient-to-r from-[#0ABFDF] to-[#F9A159] text-white"
                  onClick={handleSubmit}
                  disabled={!sharedPostDescription || !sharedPostImpact}
                >
                  Complete Challenge
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default BonusChallenge;
