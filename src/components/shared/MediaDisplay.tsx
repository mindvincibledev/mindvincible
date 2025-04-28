
import React, { useState, useEffect } from 'react';
import { getSignedUrl, refreshSignedUrlIfNeeded } from '@/utils/journalFileUtils';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface MediaDisplayProps {
  filePath: string | null;
  type: 'drawing' | 'audio';
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ filePath, type }) => {
  const [url, setUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const loadMedia = async () => {
      if (!filePath) return;
      
      try {
        const signedUrl = await getSignedUrl(filePath, type === 'drawing' ? 'drawing_files' : 'audio_files');
        setUrl(signedUrl);
      } catch (error) {
        console.error('Error loading media:', error);
      }
    };

    loadMedia();
  }, [filePath, type]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!filePath || !url) return null;

  if (type === 'drawing') {
    return (
      <div className="mt-2">
        <img 
          src={url} 
          alt="User drawing" 
          className="max-w-full h-auto rounded-lg border border-gray-200"
        />
      </div>
    );
  }

  if (type === 'audio') {
    return (
      <div className="mt-2 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePlayPause}
          className="h-8 w-8"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <audio ref={audioRef} src={url} onEnded={() => setIsPlaying(false)} className="hidden" />
        <span className="text-sm text-gray-500">Audio Recording</span>
      </div>
    );
  }

  return null;
};

export default MediaDisplay;
