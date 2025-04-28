import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DrawingCanvas } from '@/components/DrawingCanvas';
import { AudioRecorder } from '@/components/AudioRecorder';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { getSignedUrl } from '@/utils/powerOfHiFileUtils';
import { toast } from 'sonner';

interface ReflectionSectionProps {
  entry: any;
}

const ReflectionSection = ({ entry }: ReflectionSectionProps) => {
  const [drawingUrl, setDrawingUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadFiles = async () => {
      if (!entry) return;
      
      try {
        // Load drawing file if exists
        if (entry.who_path) {
          const signedUrl = await getSignedUrl(entry.who_path, 'drawing');
          setDrawingUrl(signedUrl);
        }
        
        // Load audio file if exists
        if (entry.how_it_went_path) {
          const signedUrl = await getSignedUrl(entry.how_it_went_path, 'audio');
          setAudioUrl(signedUrl);
        }
      } catch (error) {
        console.error('Error loading files:', error);
        toast.error('Failed to load some files');
      }
    };
    
    loadFiles();
  }, [entry]);

  return (
    <Card className="w-full bg-white/95 backdrop-blur-lg shadow-lg rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Your Reflection</CardTitle>
        <CardDescription>Let's reflect on how it went</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="drawing">How did you feel before saying Hi?</Label>
            {drawingUrl ? (
              <img src={drawingUrl} alt="Before Saying Hi" className="w-full rounded-md shadow-sm" />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center text-gray-500">
                No drawing available
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="audio">How did it go?</Label>
            {audioUrl ? (
              <audio src={audioUrl} controls className="w-full" />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center text-gray-500">
                No audio available
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReflectionSection;
