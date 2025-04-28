
import React, { useState, useEffect } from 'react';
import { Mic, Image, AlertCircle, Loader2 } from 'lucide-react';
import { getSignedUrl } from '@/utils/emotionalAirbnbFileUtils'; 
import { Button } from '@/components/ui/button';

interface MediaDisplayProps {
  filePath: string;
  type: 'audio' | 'drawing';
  userId: string;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ filePath, type, userId }) => {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the userId to potentially help with access permissions
        console.log(`Fetching media for userId: ${userId}, path: ${filePath}, type: ${type}`);
        
        const signedUrl = await getSignedUrl(filePath);
        
        if (!signedUrl) {
          setError('Could not retrieve media file');
        } else {
          setUrl(signedUrl);
        }
      } catch (err) {
        console.error('Error fetching media URL:', err);
        setError('Failed to load media');
      } finally {
        setLoading(false);
      }
    };

    if (filePath) {
      fetchUrl();
    }
  }, [filePath, type, userId]);

  const handleRetry = async () => {
    await fetchUrl();
  };

  const fetchUrl = async () => {
    try {
      setLoading(true);
      setError(null);
      const signedUrl = await getSignedUrl(filePath);
      
      if (!signedUrl) {
        setError('Could not retrieve media file');
      } else {
        setUrl(signedUrl);
      }
    } catch (err) {
      console.error('Error fetching media URL:', err);
      setError('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4 bg-gray-50 rounded-lg h-24">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        <span className="ml-2 text-gray-500">Loading media...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center text-red-500 mb-2">
          <AlertCircle className="w-5 h-5 mr-1" />
          <span>{error}</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRetry}
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (type === 'audio') {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Mic className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">Audio Recording</span>
        </div>
        <audio controls className="w-full">
          <source src={url} type="audio/webm" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <Image className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-600">Drawing</span>
      </div>
      <img 
        src={url} 
        alt="User drawing" 
        className="w-full rounded-lg object-contain max-h-64" 
        onError={(e) => {
          console.error('Image failed to load');
          setError('Image failed to load');
        }}
      />
    </div>
  );
};

export default MediaDisplay;
