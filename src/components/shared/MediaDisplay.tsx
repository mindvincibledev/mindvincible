
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
        console.log("No file path provided");
        setIsLoading(false);
        setLoadError(true);
        return;
      }
      
      setIsLoading(true);
      setLoadError(false);
      
      try {
        console.log(`Loading media: filePath=${filePath}, type=${type}, userId=${userId || 'not provided'}`);
        
        // Extract the filename from the path, regardless of format
        let fileName = filePath;
        if (filePath.includes('/')) {
          fileName = filePath.split('/').pop() || filePath;
        }
        
        // Ensure we have a user ID to work with
        if (!userId) {
          console.error('No user ID provided for media access');
          throw new Error('No user ID provided for media access');
        }
        
        // Construct the full path with user ID prefix if needed
        const fullPath = `${userId}/${fileName}`;
        console.log(`Constructed full path: ${fullPath}`);
        
        let signedUrl: string;

        // Determine which type of file we're dealing with based on filename patterns
        if (fileName.includes('emotion_') || 
            fileName.includes('location_') || 
            fileName.includes('appearance_') || 
            fileName.includes('intensity_') ||
            fileName.includes('sound_') ||  
            fileName.includes('message_')) {
          console.log('Using emotional airbnb utils for file');
          signedUrl = await getEmotionalAirbnbSignedUrl(fullPath);
        } 
        else if (fileName.includes('who_') || 
                fileName.includes('feeling_') || 
                fileName.includes('how_it_went_') || 
                fileName.includes('power_of_hi')) {
          console.log('Using power of hi utils for file');
          signedUrl = await getPowerOfHiSignedUrl(fullPath, type);
        } 
        else if (fileName.includes('see_') || 
                fileName.includes('touch_') || 
                fileName.includes('hear_') || 
                fileName.includes('smell_') || 
                fileName.includes('taste_') || 
                fileName.includes('grounding')) {
          console.log('Using grounding utils for file');
          signedUrl = await getGroundingSignedUrl(fullPath, type);
        } 
        else {
          // Default to journal files
          console.log('Using journal utils for file');
          const bucket = type === 'drawing' ? 'drawing_files' : 'audio_files';
          signedUrl = await getJournalSignedUrl(fullPath, bucket);
        }
        
        console.log('Successfully retrieved signed URL');
        setUrl(signedUrl);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading media:', error);
        setLoadError(true);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Media Loading Error",
          description: `Could not load ${type} file.`
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
          onError={(e) => {
            console.error('Image failed to load:', url);
            setLoadError(true);
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
            console.error('Audio failed to load:', url);
            setLoadError(true);
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
