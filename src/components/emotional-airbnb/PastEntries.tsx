import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
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
import { getSignedUrl } from '@/utils/emotionalAirbnbFileUtils';
import VisibilityToggle from '@/components/ui/VisibilityToggle';

type EmotionalEntry = {
  id: string;
  created_at: string;
  emotion_text: string | null;
  location_in_body_text: string | null;
  appearance_description_text: string | null;
  intensity_description_text: string | null;
  sound_text: string | null;
  message_description_text: string | null;
  emotion_drawing_path: string | null;
  location_in_body_drawing_path: string | null;
  appearance_drawing_path: string | null;
  intensity_drawing_path: string | null;
  sound_drawing_path: string | null;
  message_drawing_path: string | null;
  visibility: boolean;
};

type FileUrls = {
  [path: string]: string;
};

const PastEntries = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<EmotionalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<EmotionalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileUrls, setFileUrls] = useState<FileUrls>({});
  const [loadingFiles, setLoadingFiles] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const handleVisibilityChange = async (entryId: string, newVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('emotional_airbnb')
        .update({ visibility: newVisibility })
        .eq('id', entryId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error updating visibility:', error);
        toast.error('Failed to update visibility setting');
        return;
      }

      // Update entries list after successful update
      setEntries(entries.map(entry => 
        entry.id === entryId ? { ...entry, visibility: newVisibility } : entry
      ));
      
      // Also update the selectedEntry if it's currently being viewed
      if (selectedEntry && selectedEntry.id === entryId) {
        setSelectedEntry({
          ...selectedEntry,
          visibility: newVisibility
        });
      }
      
      toast.success('Visibility updated successfully');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Failed to update visibility');
    }
  };

  const fetchEntries = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('emotional_airbnb')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const entriesData = data || [];
      setEntries(entriesData);
      
      // Get signed URLs for all drawing paths
      const pathsToFetch = entriesData.reduce((acc: string[], entry) => {
        const paths = [
          entry.emotion_drawing_path,
          entry.location_in_body_drawing_path,
          entry.appearance_drawing_path,
          entry.intensity_drawing_path,
          entry.sound_drawing_path,
          entry.message_drawing_path
        ].filter((path): path is string => !!path);
        
        return [...acc, ...paths];
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

  const fetchSignedUrls = async (paths: string[]) => {
    const urls: FileUrls = {};
    const tempLoadingState: {[key: string]: boolean} = {};
    
    for (const path of paths) {
      if (path) {
        try {
          tempLoadingState[path] = true;
          setLoadingFiles(prevState => ({...prevState, [path]: true}));
          
          console.log(`Fetching signed URL for ${path}`);
          const signedUrl = await getSignedUrl(path);
          console.log(`Got signed URL for ${path}`);
          
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
        .from('emotional_airbnb')
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

  const renderDrawing = (path: string | null, section: string) => {
    if (!path) return null;

    if (loadingFiles[path]) {
      return <div className="mt-4 p-4 bg-gray-50 rounded-lg">Loading {section} drawing...</div>;
    }

    const signedUrl = fileUrls[path];
    if (!signedUrl) {
      return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          Failed to load {section} drawing
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchSignedUrls([path])}
            className="ml-2"
          >
            Retry
          </Button>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <h4 className="font-medium mb-2">{section} Drawing</h4>
        <img 
          src={signedUrl}
          alt={`${section} drawing`}
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
        <p className="text-lg text-gray-600">No emotional entries yet. Start your first emotional journey!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className="p-5 cursor-pointer hover:shadow-lg transition-shadow bg-white/90 backdrop-blur-sm border border-[#D5D5F1]/30"
              onClick={() => {
                setSelectedEntry(entry);
                setIsDialogOpen(true);
              }}
            >
              <div className="space-y-2">
                <h3 className="font-medium text-[#FC68B3]">
                  {entry.emotion_text || 'Emotional Journey'}
                </h3>
                <p className="text-sm text-gray-500">
                  Created {format(new Date(entry.created_at), 'MMM d, yyyy')}
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
              Emotional Journey Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedEntry && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">How were you feeling?</h4>
                  <p>{selectedEntry.emotion_text}</p>
                  {renderDrawing(selectedEntry.emotion_drawing_path, 'Emotion')}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Where did you feel it?</h4>
                  <p>{selectedEntry.location_in_body_text}</p>
                  {renderDrawing(selectedEntry.location_in_body_drawing_path, 'Location')}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">What did it look like?</h4>
                  <p>{selectedEntry.appearance_description_text}</p>
                  {renderDrawing(selectedEntry.appearance_drawing_path, 'Appearance')}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">How intense was it?</h4>
                  <p>{selectedEntry.intensity_description_text}</p>
                  {renderDrawing(selectedEntry.intensity_drawing_path, 'Intensity')}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">What did it sound like?</h4>
                  <p>{selectedEntry.sound_text}</p>
                  {renderDrawing(selectedEntry.sound_drawing_path, 'Sound')}
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">What message did it have?</h4>
                  <p>{selectedEntry.message_description_text}</p>
                  {renderDrawing(selectedEntry.message_drawing_path, 'Message')}
                </div>
              </div>

              <div className="flex justify-between items-center space-x-2 pt-4">
                <VisibilityToggle
                  isVisible={selectedEntry.visibility}
                  onToggle={(value) => handleVisibilityChange(selectedEntry.id, value)}
                  description="Make visible to clinicians"
                />
                
                <div className="flex space-x-2">
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PastEntries;
