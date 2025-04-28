import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Canvas from '@/components/Canvas';
import AudioRecorder from '@/components/AudioRecorder';
import { uploadPowerOfHiFile } from '@/utils/powerOfHiFileUtils';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Journal = () => {
  const { user } = useAuth();
  const [whoText, setWhoText] = useState('');
  const [howItWentText, setHowItWentText] = useState('');
  const [whoPath, setWhoPath] = useState<string | null>(null);
  const [howItWentPath, setHowItWentPath] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const handleSaveDrawing = async (blob: Blob | null) => {
    if (!blob || !user) return;
    
    try {
      const { path } = await uploadPowerOfHiFile(user.id, 'who', blob, 'drawing');
      setWhoPath(path);
    } catch (error) {
      console.error('Error uploading drawing:', error);
      toast.error('Failed to save drawing');
    }
  };

  const handleSaveAudio = async (blob: Blob | null) => {
    if (!blob || !user) return;
    
    try {
      const { path } = await uploadPowerOfHiFile(user.id, 'how_it_went', blob, 'audio');
      setHowItWentPath(path);
    } catch (error) {
      console.error('Error uploading audio:', error);
      toast.error('Failed to save audio recording');
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save your journal');
      return;
    }

    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from('power_of_hi_entries')
        .insert([
          {
            user_id: user.id,
            who_text: whoText,
            how_it_went_text: howItWentText,
            who_path: whoPath,
            how_it_went_path: howItWentPath,
          },
        ]);

      if (error) {
        console.error('Error saving journal entry:', error);
        toast.error('Failed to save journal entry');
      } else {
        toast.success('Journal entry saved successfully!');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearDrawing = useCallback(() => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4 space-y-8"
    >
      <Card className="p-8 bg-white/95 backdrop-blur-lg shadow-lg rounded-2xl">
        <h2 className="text-3xl font-bold text-center mb-8">Journal</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Who did you say "Hi" to?</h3>
            <Textarea
              placeholder="Describe who you said hi to..."
              value={whoText}
              onChange={(e) => setWhoText(e.target.value)}
              className="w-full rounded-md border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Draw who you said "Hi" to:</h3>
            <Canvas canvasRef={drawingCanvasRef} onSave={handleSaveDrawing} />
            <Button onClick={handleClearDrawing} variant="outline">
              Clear Drawing
            </Button>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">How did it go?</h3>
            <Textarea
              placeholder="Describe how saying hi went..."
              value={howItWentText}
              onChange={(e) => setHowItWentText(e.target.value)}
              className="w-full rounded-md border-gray-200 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Record how it went:</h3>
            <AudioRecorder onSave={handleSaveAudio} setAudioBlob={setAudioBlob} />
          </div>
        </div>

        <motion.div 
          className="mt-8 flex justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full md:w-auto px-12 py-6 text-lg font-semibold rounded-full bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90 transition-all duration-300 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Journal Entry'}
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default Journal;
