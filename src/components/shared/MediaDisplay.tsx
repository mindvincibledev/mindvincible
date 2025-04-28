
import React, { useState, useEffect } from 'react';
import { getSignedUrl, refreshSignedUrlIfNeeded } from '@/utils/journalFileUtils';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MediaDisplayProps {
  filePath: string | null;
  type: 'drawing' | 'audio';
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ filePath, type }) => {
  const [url, setUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMedia = async () => {
      if (!filePath) return;
      
      try {
        console.log(`Attempting to load ${type} from path: ${filePath}`);
        const bucket = type === 'drawing' ? 'drawing_files' : 'audio_files';
        
        // First try to get the URL from the specific bucket
        try {
          const signedUrl = await getSignedUrl(filePath, bucket);
          console.log(`Successfully retrieved URL from ${bucket}`);
          setUrl(signedUrl);
          setError(null);
          return;
        } catch (initialError) {
          console.warn(`Could not retrieve from ${bucket}, trying alternative buckets...`);
          
          // Try alternate buckets based on file path hints
          let alternativeBucket = null;
          
          if (filePath.includes('emotional_airbnb')) {
            alternativeBucket = 'emotional_airbnb_drawings';
          } else if (filePath.includes('grounding')) {
            alternativeBucket = type === 'drawing' ? 'grounding_drawings' : 'grounding_audio';
          } else if (filePath.includes('power_of_hi') || filePath.includes('hi_challenge')) {
            alternativeBucket = type === 'drawing' ? 'power_of_hi_drawings' : 'power_of_hi_audio';
          }
          
          if (alternativeBucket) {
            try {
              // For these specialized buckets, we need to use their specific utility functions
              let specializedUrl;
              
              if (alternativeBucket === 'emotional_airbnb_drawings') {
                const { getSignedUrl: getEmotionalUrl } = await import('@/utils/emotionalAirbnbFileUtils');
                specializedUrl = await getEmotionalUrl(filePath);
              } else if (alternativeBucket.includes('grounding')) {
                const { getSignedUrl: getGroundingUrl } = await import('@/utils/groundingFileUtils');
                specializedUrl = await getGroundingUrl(filePath, type);
              } else if (alternativeBucket.includes('power_of_hi')) {
                const { getSignedUrl: getPowerOfHiUrl } = await import('@/utils/powerOfHiFileUtils');
                specializedUrl = await getPowerOfHiUrl(filePath, type);
              }
              
              if (specializedUrl) {
                console.log(`Successfully retrieved URL from ${alternativeBucket}`);
                setUrl(specializedUrl);
                setError(null);
                return;
              }
            } catch (specialError) {
              console.error(`Error with specialized bucket ${alternativeBucket}:`, specialError);
            }
          }
          
          // As a last resort, try to directly fetch from storage URL
          try {
            const { data } = await supabase.storage.from(bucket).getPublicUrl(filePath);
            if (data?.publicUrl) {
              console.log('Using public URL as fallback');
              setUrl(data.publicUrl);
              setError(null);
              return;
            }
          } catch (publicUrlError) {
            console.error('Error getting public URL:', publicUrlError);
          }
          
          setError(`Could not load media: ${initialError.message}`);
        }
      } catch (error) {
        console.error('Error loading media:', error);
        setError('Failed to load media');
      }
    };

    loadMedia();
  }, [filePath, type]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error("Audio playback error:", err);
          setError("Could not play audio. Format may not be supported.");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!filePath) return null;
  
  if (error) {
    return (
      <div className="mt-2 p-2 bg-red-50 text-red-600 rounded-md text-sm">
        {error}
      </div>
    );
  }

  if (!url) {
    return (
      <div className="mt-2 p-2 bg-gray-100 rounded-md">
        <p className="text-sm text-gray-500">Loading media...</p>
      </div>
    );
  }

  if (type === 'drawing') {
    return (
      <div className="mt-2">
        <img 
          src={url} 
          alt="User drawing" 
          className="max-w-full h-auto rounded-lg border border-gray-200"
          onError={() => setError("Image failed to load")}
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
          onError={() => setError("Audio failed to load")}
          className="hidden" 
        />
        <span className="text-sm text-gray-500">Audio Recording</span>
      </div>
    );
  }

  return null;
};

export default MediaDisplay;
