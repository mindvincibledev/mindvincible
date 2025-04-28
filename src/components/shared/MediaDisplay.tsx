
import React, { useState, useEffect } from 'react';
import { getSignedUrl as getJournalSignedUrl } from '@/utils/journalFileUtils';
import { getSignedUrl as getEmotionalAirbnbSignedUrl } from '@/utils/emotionalAirbnbFileUtils';
import { getSignedUrl as getPowerOfHiSignedUrl } from '@/utils/powerOfHiFileUtils';
import { getSignedUrl as getGroundingSignedUrl } from '@/utils/groundingFileUtils';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaDisplayProps {
  filePath: string | null;
  type: 'drawing' | 'audio';
  userId?: string; // Student's user ID for accessing their files
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
        console.log(`Attempting to load media: ${filePath}, type: ${type}, userID: ${userId || 'not provided'}`);
        
        // Extract just the filename if the path is a full URL
        const pathToUse = filePath.includes('http') 
          ? filePath.split('/').pop() || filePath
          : filePath;
        
        let signedUrl: string;

        // Check if this is a file from emotional airbnb
        if (pathToUse.includes('emotion_') || pathToUse.includes('location_in_body_') || 
            pathToUse.includes('appearance_') || pathToUse.includes('emotional_airbnb')) {
          console.log('Detected emotional airbnb media');
          // If userId is provided and not already in path, prepend it
          const fullPath = userId && !pathToUse.includes('/') ? `${userId}/${pathToUse}` : pathToUse;
          signedUrl = await getEmotionalAirbnbSignedUrl(fullPath);
        } 
        // Check if this is a file from power of hi
        else if (pathToUse.includes('who_') || pathToUse.includes('feeling_') || 
                pathToUse.includes('how_it_went_') || pathToUse.includes('power_of_hi')) {
          console.log('Detected power of hi media');
          const fullPath = userId && !pathToUse.includes('/') ? `${userId}/${pathToUse}` : pathToUse;
          signedUrl = await getPowerOfHiSignedUrl(fullPath, type);
        } 
        // Check if this is a file from grounding
        else if (pathToUse.includes('see_') || pathToUse.includes('touch_') || 
                pathToUse.includes('hear_') || pathToUse.includes('smell_') || 
                pathToUse.includes('taste_') || pathToUse.includes('grounding')) {
          console.log('Detected grounding media');
          const fullPath = userId && !pathToUse.includes('/') ? `${userId}/${pathToUse}` : pathToUse;
          signedUrl = await getGroundingSignedUrl(fullPath, type);
        } 
        // Default to journal files
        else {
          console.log('Detected journal media');
          const bucket = type === 'drawing' ? 'drawing_files' : 'audio_files';
          const fullPath = userId && !pathToUse.includes('/') ? `${userId}/${pathToUse}` : pathToUse;
          signedUrl = await getJournalSignedUrl(fullPath, bucket);
        }
        
        console.log('Successfully retrieved signed URL:', signedUrl);
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
    return <div className="p-2 text-center text-red-500 text-sm">Unable to load {type}</div>;
  }

  // No URL available
  if (!url) {
    return <div className="p-2 text-center text-gray-500 text-sm">No {type} available</div>;
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
