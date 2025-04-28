
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Mic, Image, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { getSignedUrl } from '@/utils/groundingFileUtils';

type GroundingResponse = {
  id: string;
  activity_id: string;
  section_name: string;
  response_text: string | null;
  response_drawing_path: string | null;
  response_audio_path: string | null;
  response_selected_items: string[] | null;
  created_at: string;
};

type FileUrls = {
  [path: string]: string;
};

const PastGroundingEntries = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<GroundingResponse[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<GroundingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileUrls, setFileUrls] = useState<FileUrls>({});
  const [loadingFiles, setLoadingFiles] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const fetchEntries = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('grounding_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const responsesData = data || [];
      setEntries(responsesData);
      
      // Get signed URLs for all paths
      const pathsToFetch = responsesData.reduce((acc: {path: string, type: 'audio' | 'drawing'}[], entry) => {
        if (entry.response_drawing_path) {
          acc.push({ path: entry.response_drawing_path, type: 'drawing' });
        }
        if (entry.response_audio_path) {
          acc.push({ path: entry.response_audio_path, type: 'audio' });
        }
        return acc;
      }, []);
      
      if (pathsToFetch.length > 0) {
        await fetchSignedUrls(pathsToFetch);
      }
    } catch (error: any) {
      toast.error("Failed to load entries");
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSignedUrls = async (paths: {path: string, type: 'audio' | 'drawing'}[]) => {
    const urls: FileUrls = {};
    const tempLoadingState: {[key: string]: boolean} = {};
    
    for (const { path, type } of paths) {
      if (path) {
        try {
          tempLoadingState[path] = true;
          setLoadingFiles(prevState => ({...prevState, [path]: true}));
          
          const signedUrl = await getSignedUrl(path, type);
          urls[path] = signedUrl;
        } catch (error) {
          console.error(`Failed to get signed URL for ${path}:`, error);
        } finally {
          tempLoadingState[path] = false;
        }
      }
    }
    
    setFileUrls(urls);
    setLoadingFiles(tempLoadingState);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('grounding_responses')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== id));
      setIsDialogOpen(false);
      toast.success('Entry deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete entry');
      console.error('Error:', error);
    }
  };

  const renderFileIndicator = (path: string | null, type: string) => {
    if (!path) return null;

    if (loadingFiles[path]) {
      return <div className="mt-4 p-4 bg-gray-50 rounded-lg">Loading {type} attachment...</div>;
    }

    const signedUrl = fileUrls[path];
    if (!signedUrl) {
      return <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        Failed to load {type} attachment
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchSignedUrls([{ 
            path, 
            type: type === 'audio' ? 'audio' : 'drawing'
          }])}
          className="ml-2"
        >
          Retry
        </Button>
      </div>;
    }
    
    const isAudio = type === 'audio';
    const previewStyle = "mt-4 p-4 bg-gray-50 rounded-lg";
    
    if (isAudio) {
      return (
        <div className={previewStyle}>
          <div className="flex items-center gap-2 mb-2">
            <Mic className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Audio Recording</span>
          </div>
          <audio controls className="w-full">
            <source src={signedUrl} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }

    return (
      <div className={previewStyle}>
        <div className="flex items-center gap-2 mb-2">
          <Image className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">Drawing</span>
        </div>
        <img 
          src={signedUrl}
          alt={`${type} attachment`}
          className="w-full rounded-lg object-cover"
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-lg text-gray-600">Loading entries...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center p-8 bg-white/80 rounded-lg shadow-sm backdrop-blur-sm">
        <p className="text-lg text-gray-600">No grounding entries yet. Start your first grounding quest!</p>
      </div>
    );
  }

  const groupEntriesByTimestamp = (entries: GroundingResponse[]) => {
    const grouped = entries.reduce((acc: { [key: string]: GroundingResponse[] }, entry) => {
      const timestamp = entry.created_at;
      if (!acc[timestamp]) {
        acc[timestamp] = [];
      }
      acc[timestamp].push(entry);
      return acc;
    }, {});

    return Object.entries(grouped).map(([timestamp, entries]) => ({
      timestamp,
      entries: entries.sort((a, b) => 
        ['see', 'touch', 'hear', 'smell', 'taste']
          .indexOf(a.section_name)
        - ['see', 'touch', 'hear', 'smell', 'taste']
          .indexOf(b.section_name)
      )
    }));
  };

  const groupedEntries = groupEntriesByTimestamp(entries);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groupedEntries.map(({ timestamp, entries: groupEntries }) => (
          <motion.div
            key={timestamp}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className="p-5 cursor-pointer hover:shadow-lg transition-shadow bg-white/90 backdrop-blur-sm border border-[#D5D5F1]/30"
              onClick={() => {
                setSelectedEntry(groupEntries[0]);
                setIsDialogOpen(true);
              }}
            >
              <div className="space-y-2">
                <h3 className="font-medium text-[#FC68B3]">
                  Grounding Quest
                </h3>
                <p className="text-sm text-gray-500">
                  Completed {format(new Date(timestamp), 'MMM d, yyyy')}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
              Grounding Quest Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedEntry && (
            <div className="space-y-6">
              <div className="space-y-4">
                {entries
                  .filter(entry => entry.created_at === selectedEntry.created_at)
                  .map(entry => (
                    <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2 capitalize">{entry.section_name}</h4>
                      {entry.response_text && (
                        <p className="mb-2">{entry.response_text}</p>
                      )}
                      {entry.response_selected_items && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {entry.response_selected_items.map((item, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-white rounded-full text-sm text-gray-700"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                      {renderFileIndicator(entry.response_drawing_path, 'drawing')}
                      {renderFileIndicator(entry.response_audio_path, 'audio')}
                    </div>
                  ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedEntry.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Entry
                </Button>
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PastGroundingEntries;
