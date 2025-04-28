import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Mic, Image, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { motion, AnimatePresence } from 'framer-motion';
import { getSignedUrl } from '@/utils/groundingFileUtils';
import VisibilityToggle from '@/components/ui/VisibilityToggle';

type GroundingResponse = {
  id: string;
  activity_id: string;
  section_name: string;
  response_text: string | null;
  response_drawing_path: string | null;
  response_audio_path: string | null;
  response_selected_items: string[] | null;
  created_at: string;
  visibility: boolean;
};

type GroupedResponses = {
  activity_id: string;
  created_at: string;
  responses: GroundingResponse[];
};

type FileUrls = {
  [path: string]: string;
};

const PastGroundingEntries = () => {
  const { user } = useAuth();
  const [groupedEntries, setGroupedEntries] = useState<GroupedResponses[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileUrls, setFileUrls] = useState<FileUrls>({});
  const [loadingFiles, setLoadingFiles] = useState<{[key: string]: boolean}>({});
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const handleVisibilityChange = async (activityId: string, newVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('grounding_responses')
        .update({ visibility: newVisibility })
        .eq('activity_id', activityId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error updating visibility:', error);
        toast.error('Failed to update visibility setting');
        return;
      }

      // Update the visibility in the local state for all responses with this activity_id
      setGroupedEntries(prevEntries => prevEntries.map(group => {
        if (group.activity_id === activityId) {
          // Update all responses within this group
          const updatedResponses = group.responses.map(response => ({
            ...response,
            visibility: newVisibility
          }));
          return {
            ...group,
            responses: updatedResponses
          };
        }
        return group;
      }));

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
        .from('grounding_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Group responses by activity_id
      const grouped = data.reduce((acc: { [key: string]: GroundingResponse[] }, response) => {
        if (!acc[response.activity_id]) {
          acc[response.activity_id] = [];
        }
        acc[response.activity_id].push(response);
        return acc;
      }, {});

      const groupedArray = Object.entries(grouped).map(([activity_id, responses]) => ({
        activity_id,
        created_at: responses[0].created_at,
        responses: responses.sort((a, b) => 
          ['see', 'touch', 'hear', 'smell', 'taste']
            .indexOf(a.section_name)
          - ['see', 'touch', 'hear', 'smell', 'taste']
            .indexOf(b.section_name)
        ),
      }));

      setGroupedEntries(groupedArray);
      
      // Get signed URLs for all paths
      const pathsToFetch = data.reduce((acc: {path: string, type: 'audio' | 'drawing'}[], entry) => {
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

  const handleDelete = async (activityId: string) => {
    try {
      const { error } = await supabase
        .from('grounding_responses')
        .delete()
        .eq('activity_id', activityId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setGroupedEntries(prev => prev.filter(group => group.activity_id !== activityId));
      toast.success('Quest entries deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete quest entries');
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

  if (groupedEntries.length === 0) {
    return (
      <div className="text-center p-8 bg-white/80 rounded-lg shadow-sm backdrop-blur-sm">
        <p className="text-lg text-gray-600">No grounding entries yet. Start your first grounding quest!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groupedEntries.map((group) => (
        <motion.div
          key={group.activity_id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-4">
            <Collapsible>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-[#FC68B3]">
                    Grounding Quest
                  </h3>
                  <p className="text-sm text-gray-500">
                    Completed {format(new Date(group.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <VisibilityToggle
                    isVisible={group.responses[0]?.visibility ?? true}
                    onToggle={(value) => handleVisibilityChange(group.activity_id, value)}
                    description="Make visible to clinicians"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(group.activity_id);
                    }}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {expandedActivityId === group.activity_id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>

              <CollapsibleContent className="mt-4 space-y-4">
                {group.responses.map((response) => (
                  <div key={response.id} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2 capitalize">{response.section_name}</h4>
                    {response.response_text && (
                      <p className="mb-2">{response.response_text}</p>
                    )}
                    {response.response_selected_items && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {response.response_selected_items.map((item, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-white rounded-full text-sm text-gray-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                    {renderFileIndicator(response.response_drawing_path, 'drawing')}
                    {renderFileIndicator(response.response_audio_path, 'audio')}
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default PastGroundingEntries;
