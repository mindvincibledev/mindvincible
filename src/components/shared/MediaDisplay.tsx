
import React, { useState, useEffect } from 'react';
import { getSignedUrl as getJournalSignedUrl, refreshSignedUrlIfNeeded as refreshJournalSignedUrl } from '@/utils/journalFileUtils';
import { getSignedUrl as getEmotionalAirbnbSignedUrl } from '@/utils/emotionalAirbnbFileUtils';
import { getSignedUrl as getPowerOfHiSignedUrl } from '@/utils/powerOfHiFileUtils';
import { getSignedUrl as getGroundingSignedUrl } from '@/utils/groundingFileUtils';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaDisplayProps {
  filePath: string | null;
  type: 'drawing' | 'audio';
  userId?: string; // Optional user ID for accessing user-specific files
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ filePath, type, userId }) => {
  const [url, setUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadMedia = async () => {
      if (!filePath) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setLoadError(false);
      
      try {
        // Determine if this is a path from a specific activity based on path pattern
        let signedUrl: string;
        
        if (filePath.includes('emotional_airbnb')) {
          signedUrl = await getEmotionalAirbnbSignedUrl(filePath);
        } else if (filePath.includes('power_of_hi')) {
          signedUrl = await getPowerOfHiSignedUrl(filePath, type);
        } else if (filePath.includes('grounding')) {
          signedUrl = await getGroundingSignedUrl(filePath, type);
        } else {
          // Default to journal files
          const bucket = type === 'drawing' ? 'drawing_files' : 'audio_files';
          signedUrl = await getJournalSignedUrl(filePath, bucket);
        }
        
        setUrl(signedUrl);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading media:', error);
        setLoadError(true);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Media Loading Error",
          description: `Could not load ${type} file. Please try again later.`
        });
      }
    };

    loadMedia();
  }, [filePath, type, userId, toast]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          toast({
            variant: "destructive", 
            title: "Playback Error",
            description: "Could not play audio file."
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Show loading state
  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">Loading {type}...</div>;
  }

  // Show error state
  if (loadError || !filePath) {
    return null; // Hide component completely on error
  }

  // No URL available
  if (!url) {
    return null;
  }

  if (type === 'drawing') {
    return (
      <div className="mt-2">
        <img 
          src={url} 
          alt="User drawing" 
          className="max-w-full h-auto rounded-lg border border-gray-200"
          onError={() => {
            setLoadError(true);
            console.error('Failed to load image:', filePath);
          }}
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
        <audio 
          ref={audioRef} 
          src={url} 
          onEnded={() => setIsPlaying(false)} 
          onError={() => {
            setLoadError(true);
            console.error('Failed to load audio:', filePath);
          }}
          className="hidden" 
        />
        <span className="text-sm text-gray-500">Audio Recording</span>
      </div>
    );
  }

  return null;
};

export default MediaDisplay;
