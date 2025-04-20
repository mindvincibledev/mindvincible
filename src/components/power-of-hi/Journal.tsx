import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import ReflectionSection, { ReflectionData } from './ReflectionSection';
import { toast } from 'sonner';

interface JournalProps {
  onComplete: () => void;
}

const Journal = ({ onComplete }: JournalProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: ReflectionData) => {
    setIsSubmitting(true);
    // Simulate saving journal data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Journal saved!");
    setIsSubmitting(false);
    
    // Call the onComplete callback after successful submission
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="p-8">
        <ReflectionSection onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </Card>
    </motion.div>
  );
};

export default Journal;
