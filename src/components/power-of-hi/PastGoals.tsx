
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Mic, Image, Smile, ArrowLeft, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { getSignedUrl } from '@/utils/powerOfHiFileUtils';

type CompletedGoal = {
  id: string;
  goal: string;
  who: string;
  how_it_went: string;
  feeling: string;
  who_path: string | null;
  how_it_went_path: string | null;
  feeling_path: string | null;
  who_stickers: string | null;
  how_it_went_stickers: string | null;
  feeling_stickers: string | null;
  created_at: string;
  challenge_level: string;
  who_difficulty: number;
  how_it_went_rating: number;
  what_felt_easy: string | null;
  what_felt_hard: string | null;
  other_people_responses: string | null;
  try_next_time: string | null;
  what_felt_easy_rating: number | null;
  what_felt_hard_rating: number | null;
  other_people_rating: number | null;
  try_next_time_confidence: number | null;
};

type FileUrls = {
  [path: string]: string;
};

const PastGoals = () => {
  const { user } = useAuth();
  const [completedGoals, setCompletedGoals] = useState<CompletedGoal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<CompletedGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileUrls, setFileUrls] = useState<FileUrls>({});
  const [loadingFiles, setLoadingFiles] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    fetchCompletedGoals();
  }, [user]);

  const fetchCompletedGoals = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('simple_hi_challenges')
        .select('*')
        .eq('user_id', user.id)
        .not('how_it_went', 'is', null)
        .not('feeling', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const goals = data || [];
      setCompletedGoals(goals);
      
      // Get signed URLs for all paths
      const pathsToFetch: {path: string, type: 'audio' | 'drawing'}[] = [];
      goals.forEach(goal => {
        if (goal.who_path) {
          const fileType = determineFileType(goal.who_path);
          pathsToFetch.push({ path: goal.who_path, type: fileType });
        }
        if (goal.how_it_went_path) {
          const fileType = determineFileType(goal.how_it_went_path);
          pathsToFetch.push({ path: goal.how_it_went_path, type: fileType });
        }
        if (goal.feeling_path) {
          const fileType = determineFileType(goal.feeling_path);
          pathsToFetch.push({ path: goal.feeling_path, type: fileType });
        }
      });
      
      if (pathsToFetch.length > 0) {
        await fetchSignedUrls(pathsToFetch);
      }
    } catch (error: any) {
      toast.error("Failed to load completed goals");
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const determineFileType = (path: string): 'audio' | 'drawing' => {
    // Check if the path contains 'audio' or ends with an audio extension
    if (path.includes('audio') || path.endsWith('.webm') || path.endsWith('.mp3') || path.endsWith('.wav')) {
      return 'audio';
    }
    // Default to drawing for all other files
    return 'drawing';
  };
  
  const fetchSignedUrls = async (paths: {path: string, type: 'audio' | 'drawing'}[]) => {
    const urls: FileUrls = {};
    const tempLoadingState: {[key: string]: boolean} = {};
    
    for (const { path, type } of paths) {
      if (path) {
        try {
          tempLoadingState[path] = true;
          setLoadingFiles(prevState => ({...prevState, [path]: true}));
          
          console.log(`Fetching signed URL for ${path} (type: ${type})`);
          
          // Get signed URL with the appropriate file type
          const signedUrl = await getSignedUrl(path, type);
          
          console.log(`Got signed URL for ${path} with length: ${signedUrl.length}`);
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
        .from('simple_hi_challenges')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setCompletedGoals(prev => prev.filter(goal => goal.id !== id));
      setIsDialogOpen(false);
      toast.success('Goal deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete goal');
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
            type: determineFileType(path)
          }])}
          className="ml-2"
        >
          Retry
        </Button>
      </div>;
    }
    
    const isAudio = determineFileType(path) === 'audio';
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
          <span className="text-sm text-gray-600">Image</span>
        </div>
        <img 
          src={signedUrl}
          alt={`${type} attachment`}
          className="w-full rounded-lg object-cover"
        />
      </div>
    );
  };

  const renderStickers = (stickersJson: string | null) => {
    if (!stickersJson) return null;
    try {
      const stickers = JSON.parse(stickersJson);
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          {stickers.map((sticker: string, index: number) => (
            <span key={index} className="text-2xl">{sticker}</span>
          ))}
        </div>
      );
    } catch {
      return null;
    }
  };

  const renderReflectionSection = (goal: CompletedGoal) => {
    if (!goal.what_felt_easy && !goal.what_felt_hard && !goal.other_people_responses && !goal.try_next_time) {
      return null;
    }

    return (
      <div className="mt-6 space-y-4 border-t pt-4">
        <h4 className="font-medium text-lg">Reflection</h4>
        
        {goal.what_felt_easy && (
          <div className="space-y-2">
            <h5 className="font-medium">What felt easy?</h5>
            <p>{goal.what_felt_easy}</p>
            {goal.what_felt_easy_rating && (
              <div className="text-sm text-gray-600">
                Rating: {goal.what_felt_easy_rating}/10
              </div>
            )}
          </div>
        )}

        {goal.what_felt_hard && (
          <div className="space-y-2">
            <h5 className="font-medium">What felt hard?</h5>
            <p>{goal.what_felt_hard}</p>
            {goal.what_felt_hard_rating && (
              <div className="text-sm text-gray-600">
                Rating: {goal.what_felt_hard_rating}/10
              </div>
            )}
          </div>
        )}

        {goal.other_people_responses && (
          <div className="space-y-2">
            <h5 className="font-medium">What surprised you about other people's responses?</h5>
            <p>{goal.other_people_responses}</p>
            {goal.other_people_rating && (
              <div className="text-sm text-gray-600">
                Rating: {goal.other_people_rating}/10
              </div>
            )}
          </div>
        )}

        {goal.try_next_time && (
          <div className="space-y-2">
            <h5 className="font-medium">What will you try next time?</h5>
            <p>{goal.try_next_time}</p>
            {goal.try_next_time_confidence && (
              <div className="text-sm text-gray-600">
                Confidence Level: {goal.try_next_time_confidence}/10
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {completedGoals.map((goal) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card 
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                setSelectedGoal(goal);
                setIsDialogOpen(true);
              }}
            >
              <div className="space-y-2">
                <h3 className={`font-medium ${
                  goal.challenge_level === 'easy' 
                    ? 'text-[#2AC20E]' 
                    : goal.challenge_level === 'medium'
                    ? 'text-[#F5DF4D]'
                    : 'text-[#FC68B3]'
                }`}>
                  {goal.goal}
                </h3>
                <p className="text-sm text-gray-500">
                  Completed {format(new Date(goal.created_at), 'MMM d, yyyy')}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Goal Details</DialogTitle>
            <DialogDescription>View the details of your completed goal</DialogDescription>
          </DialogHeader>
          
          {selectedGoal && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className={`text-lg font-medium ${
                  selectedGoal.challenge_level === 'easy'
                    ? 'text-[#2AC20E]'
                    : selectedGoal.challenge_level === 'medium'
                    ? 'text-[#F5DF4D]'
                    : 'text-[#FC68B3]'
                }`}>
                  {selectedGoal.goal}
                </h3>
                <p className="text-sm text-gray-500">
                  Created on {format(new Date(selectedGoal.created_at), 'MMMM d, yyyy')}
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Who did you interact with?</h4>
                  <p>{selectedGoal.who}</p>
                  {renderFileIndicator(selectedGoal.who_path, 'Who')}
                  {renderStickers(selectedGoal.who_stickers)}
                  <div className="mt-2 text-sm text-gray-600">
                    Difficulty Level: {selectedGoal.who_difficulty}/10
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">How did it go?</h4>
                  <p>{selectedGoal.how_it_went}</p>
                  {renderFileIndicator(selectedGoal.how_it_went_path, 'How it went')}
                  {renderStickers(selectedGoal.how_it_went_stickers)}
                  <div className="mt-2 text-sm text-gray-600">
                    Experience Rating: {selectedGoal.how_it_went_rating}/10
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">How did you feel?</h4>
                  <p>{selectedGoal.feeling}</p>
                  {renderFileIndicator(selectedGoal.feeling_path, 'Feeling')}
                  {renderStickers(selectedGoal.feeling_stickers)}
                </div>

                {renderReflectionSection(selectedGoal)}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedGoal.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Goal
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

export default PastGoals;
