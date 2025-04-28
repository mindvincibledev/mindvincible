
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Save } from 'lucide-react';
import { toast } from 'sonner';

interface AudioRecorderProps {
  onSave: (blob: Blob | null) => void;
  setAudioBlob?: React.Dispatch<React.SetStateAction<Blob | null>>;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSave, setAudioBlob }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [audioURL, isRecording]);

  const startRecording = async () => {
    try {
      // Reset state
      audioChunksRef.current = [];
      setAudioURL(null);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        // Create audio blob from chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Create URL for playback
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);
        
        // Store blob for parent component
        if (setAudioBlob) {
          setAudioBlob(audioBlob);
        }
        
        // Stop all tracks in stream
        stream.getTracks().forEach(track => track.stop());
        
        // Clear recording timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Set up recording timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !audioURL) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleSave = () => {
    if (audioChunksRef.current.length === 0) {
      toast.error('No audio recording to save');
      return;
    }
    
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    onSave(audioBlob);
    toast.success('Audio recording saved');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="audio-recorder border border-gray-200 rounded-lg p-4 bg-white">
      {audioURL ? (
        <div className="audio-playback">
          <audio ref={audioRef} src={audioURL} onEnded={() => setIsPlaying(false)} />
          
          <div className="flex items-center justify-between mb-4">
            <Button 
              onClick={handlePlayPause} 
              variant="outline" 
              size="icon"
              className="h-10 w-10 rounded-full"
            >
              {isPlaying ? <Square size={16} /> : <Play size={16} />}
            </Button>
            
            <span className="text-gray-600">{formatTime(recordingTime)}</span>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={() => {
                setAudioURL(null);
                if (setAudioBlob) setAudioBlob(null);
                setRecordingTime(0);
              }}
              variant="outline"
              className="flex-1"
            >
              Discard
            </Button>
            
            <Button 
              onClick={handleSave} 
              className="flex-1 bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:opacity-90"
            >
              <Save size={16} className="mr-2" /> Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="recording-controls">
          <div className="flex justify-center mb-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`h-16 w-16 rounded-full ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:opacity-90'
              }`}
              size="icon"
            >
              <Mic size={24} />
            </Button>
          </div>
          
          {isRecording && (
            <div className="text-center">
              <p className="text-red-500 font-semibold animate-pulse">
                Recording... {formatTime(recordingTime)}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Tap the microphone when finished
              </p>
            </div>
          )}
          
          {!isRecording && (
            <p className="text-center text-gray-500">
              Tap the microphone to start recording
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
