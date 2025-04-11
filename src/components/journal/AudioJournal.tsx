
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, Play, Save } from 'lucide-react';
import { toast } from 'sonner';

interface AudioJournalProps {
  onAudioChange: (audioBlob: Blob) => void;
  onTitleChange: (title: string) => void;
  title: string;
}

const AudioJournal: React.FC<AudioJournalProps> = ({ onAudioChange, onTitleChange, title }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onAudioChange(audioBlob);
        
        // Stop all tracks from the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.success("Recording started. Speak clearly into your microphone.");
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error("Microphone access denied. Please allow microphone access to record audio journals.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast.success("Recording finished. Your audio has been saved.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="audio-journal-title" className="text-black mb-2 block font-medium">
          Audio Journal Title
        </Label>
        <Input
          id="audio-journal-title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter a title for your audio journal"
          className="bg-white border-[#FF8A48]/30 text-black placeholder-gray-500"
        />
      </div>
      
      <div className="flex flex-col items-center gap-4 p-6 rounded-lg border border-[#FF8A48]/30 bg-white">
        <div className="text-2xl font-mono font-bold text-black">
          {formatTime(recordingTime)}
        </div>
        
        <div className="flex items-center gap-4">
          {!isRecording ? (
            <Button 
              onClick={startRecording}
              className="bg-[#FF8A48] hover:bg-[#FF8A48]/80 text-black flex items-center gap-2"
            >
              <Mic className="h-5 w-5" />
              Start Recording
            </Button>
          ) : (
            <Button 
              onClick={stopRecording}
              variant="destructive"
              className="flex items-center gap-2 text-black"
            >
              <MicOff className="h-5 w-5" />
              Stop Recording
            </Button>
          )}
        </div>
        
        {audioURL && (
          <div className="w-full mt-4">
            <audio src={audioURL} controls className="w-full" />
          </div>
        )}
        
        <p className="text-sm text-black mt-2">
          {isRecording 
            ? "Recording in progress... Speak clearly into your microphone." 
            : "Click 'Start Recording' to begin your audio journal entry."}
        </p>
      </div>
    </div>
  );
};

export default AudioJournal;
