
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Mic, StopCircle, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';

interface AudioJournalProps {
  onAudioChange: (blob: Blob) => void;
  onTitleChange: (title: string) => void;
  title: string;
}

const AudioJournal: React.FC<AudioJournalProps> = ({ 
  onAudioChange, 
  onTitleChange, 
  title 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      
      stopMediaStream();
    };
  }, []);
  
  // Clean up audio element listeners when component unmounts
  useEffect(() => {
    const audioElement = audioElementRef.current;
    
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleAudioEnded);
        audioElement.removeEventListener('pause', handleAudioPaused);
      }
    };
  }, []);
  
  const stopMediaStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };
  
  const startRecording = async () => {
    try {
      // Stop any existing stream first
      stopMediaStream();
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = handleRecordingStop;
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast.info("Recording started");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Failed to access microphone. Please check permissions.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      stopMediaStream();
      setIsRecording(false);
    }
  };
  
  const handleRecordingStop = () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioURL(audioUrl);
    
    // Set up audio element for playback
    const audioElement = new Audio(audioUrl);
    audioElement.addEventListener('ended', handleAudioEnded);
    audioElement.addEventListener('pause', handleAudioPaused);
    audioElementRef.current = audioElement;
    
    // Pass the audio blob to parent component
    onAudioChange(audioBlob);
    
    toast.success("Recording saved");
  };
  
  const togglePlayback = () => {
    const audioElement = audioElementRef.current;
    
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Error playing audio:", err);
          toast.error("Failed to play audio");
        });
    }
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
  const handleAudioPaused = () => {
    setIsPlaying(false);
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
          className="bg-white border-[#3DFDFF]/30 text-black placeholder-gray-500"
        />
      </div>
      
      <div className="rounded-lg border border-[#3DFDFF]/30 bg-white p-6">
        <div className="flex flex-col items-center justify-center gap-4">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              variant="outline"
              size="lg"
              className="h-20 w-20 rounded-full flex items-center justify-center hover:bg-red-50"
            >
              <Mic className="h-10 w-10 text-red-500" />
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              variant="outline"
              size="lg"
              className="h-20 w-20 rounded-full bg-red-50 animate-pulse flex items-center justify-center hover:bg-red-100"
            >
              <StopCircle className="h-10 w-10 text-red-500" />
            </Button>
          )}
          
          <div className="text-center">
            {isRecording ? (
              <p className="text-red-500 font-medium">Recording...</p>
            ) : (
              <p className="text-gray-600">Tap to {audioURL ? "record again" : "start recording"}</p>
            )}
          </div>
          
          {audioURL && !isRecording && (
            <div className="flex flex-col items-center w-full mt-4 gap-2">
              <Button
                onClick={togglePlayback}
                variant="outline"
                className="flex items-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Play Recording
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500">Audio has been saved</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioJournal;
