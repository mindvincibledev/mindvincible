import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const Journal = () => {
  const { user } = useAuth();
  const [entry, setEntry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSaveEntry = async () => {
    if (!entry) {
      toast.error('Please write something in your journal');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('simple_hi_journal').insert({
        user_id: user?.id,
        entry,
        date: date ? format(date, "yyyy-MM-dd") : null,
      });

      if (error) throw error;

      toast.success('Journal entry saved successfully!');
      setEntry('');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast.error('Failed to save journal entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    if (!entry) {
      toast.error('Please write something in your journal before completing');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('simple_hi_journal').insert({
        user_id: user?.id,
        entry,
        date: date ? format(date, "yyyy-MM-dd") : null,
      });

      if (error) throw error;

      toast.success('Journal entry saved successfully!');
      setEntry('');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast.error('Failed to save journal entry. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowFeedback(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4 space-y-8"
    >
      <Card className="p-8 bg-white/95 backdrop-blur-lg shadow-lg rounded-2xl">
        <h2 className="text-3xl font-bold text-center mb-8">Journal Entry</h2>

        <div className="space-y-4">
          <label className="block text-lg font-medium mb-2">Today's Date:</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("2023-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <label className="block text-lg font-medium mb-2">Write your thoughts here:</label>
          <Textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="What's on your mind today?"
            className="min-h-[200px] p-4 rounded-lg border-2 border-gray-100 focus:border-[#2AC20E] focus:ring-[#2AC20E]"
          />
        </div>

        <motion.div className="mt-10 flex justify-center gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleSaveEntry}
              disabled={isSubmitting}
              className="px-12 py-6 text-lg font-semibold rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Entry'}
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleComplete}
              disabled={isSubmitting}
              className="px-12 py-6 text-lg font-semibold rounded-full bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90 transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'Completing...' : 'Complete Challenge'}
            </Button>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default Journal;
