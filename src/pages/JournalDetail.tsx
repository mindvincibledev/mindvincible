import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Mic, Brush, Trash } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { JournalEntry } from '@/types/journal';
import { getSignedUrl as getJournalSignedUrl } from '@/utils/journalFileUtils';
import { getSignedUrl as getPowerOfHiSignedUrl } from '@/utils/powerOfHiFileUtils';
import VisibilityToggle from '@/components/ui/VisibilityToggle';

const JournalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [drawingUrl, setDrawingUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (id) {
      fetchJournalEntry(id);
    }
  }, [id, user, navigate]);
  
  const fetchJournalEntry = async (entryId: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', entryId)
        .eq('user_id', user?.id)
        .single();
        
      if (error) throw error;
      
      if (!data) {
        toast({
          variant: "destructive",
          title: "Entry not found",
          description: "The journal entry you're looking for doesn't exist",
        });
        navigate('/journal');
        return;
      }
      
      const journalEntry = data as JournalEntry;
      setEntry(journalEntry);
      
      // Get signed URLs for audio and drawing files
      if (journalEntry.audio_path) {
        try {
          // Use journal file utils for regular journal entries
          const signedUrl = await getJournalSignedUrl(journalEntry.audio_path, 'audio_files');
          setAudioUrl(signedUrl);
        } catch (error) {
          console.error('Error getting signed audio URL:', error);
          toast({
            variant: "destructive",
            title: "Error loading audio",
            description: "Could not load the audio file",
          });
        }
      }
      
      if (journalEntry.drawing_path) {
        try {
          // Use journal file utils for regular journal entries
          const signedUrl = await getJournalSignedUrl(journalEntry.drawing_path, 'drawing_files');
          setDrawingUrl(signedUrl);
        } catch (error) {
          console.error('Error getting signed drawing URL:', error);
          toast({
            variant: "destructive",
            title: "Error loading drawing",
            description: "Could not load the drawing",
          });
        }
      }
    } catch (error: any) {
      console.error('Error fetching journal entry:', error);
      toast({
        variant: "destructive",
        title: "Error loading entry",
        description: error.message || "Could not load the journal entry",
      });
      navigate('/journal');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteEntry = async () => {
    if (!entry || !user) return;
    
    try {
      // Delete associated files if present
      if (entry.audio_path) {
        // Get filename from URL
        const url = new URL(entry.audio_path);
        const pathParts = url.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];
        
        console.log('Attempting to delete audio file:', fileName);
        
        // Delete from audio_files bucket
        const { error: deleteAudioError } = await supabase.storage
          .from('audio_files')
          .remove([fileName]);
          
        if (deleteAudioError) {
          console.error('Error deleting audio file:', deleteAudioError);
        }
      }
      
      if (entry.drawing_path) {
        // Get filename from URL
        const url = new URL(entry.drawing_path);
        const pathParts = url.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];
        
        console.log('Attempting to delete drawing file:', fileName);
        
        // Delete from drawing_files bucket
        const { error: deleteDrawingError } = await supabase.storage
          .from('drawing_files')
          .remove([fileName]);
          
        if (deleteDrawingError) {
          console.error('Error deleting drawing file:', deleteDrawingError);
        }
      }
      
      // Delete the entry
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entry.id);
        
      if (error) throw error;
      
      toast({
        title: "Entry deleted",
        description: "Your journal entry has been deleted",
      });
      
      navigate('/journal');
    } catch (error: any) {
      console.error('Error deleting journal entry:', error);
      toast({
        variant: "destructive",
        title: "Error deleting entry",
        description: error.message || "Could not delete the journal entry",
      });
    }
  };
  
  // Define the formatDate function only once
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };
  
  const handleVisibilityChange = async (newVisibility: boolean) => {
    if (!entry || !user) return;
    
    try {
      const { error } = await supabase
        .from('journal_entries')
        .update({ visibility: newVisibility })
        .eq('id', entry.id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setEntry(prev => prev ? { ...prev, visibility: newVisibility } : null);
      toast({
        title: "Visibility updated",
        description: `Entry is now ${newVisibility ? 'visible' : 'hidden'} to clinicians`,
      });
    } catch (error: any) {
      console.error('Error updating visibility:', error);
      toast({
        variant: "destructive",
        title: "Error updating visibility",
        description: error.message || "Could not update entry visibility",
      });
    }
  };

  if (loading) {
    return (
      <BackgroundWithEmojis>
        <div className="min-h-screen relative">
          <Navbar />
          
          <div className="relative z-10 container mx-auto px-4 py-24">
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-800 text-lg">Loading journal entry...</div>
            </div>
          </div>
        </div>
      </BackgroundWithEmojis>
    );
  }
  
  if (!entry) return null;
  
  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Link to="/journal">
                <Button variant="ghost" className="text-gray-800 hover:bg-gray-100">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Journal
                </Button>
              </Link>
              
              <div className="flex items-center gap-4">
                <VisibilityToggle
                  isVisible={entry.visibility}
                  onToggle={handleVisibilityChange}
                  description="Make this entry visible to clinicians"
                />
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <Trash className="h-5 w-5" />
                      <span className="hidden sm:inline">Delete Entry</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        journal entry and any associated files.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteEntry}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-100 p-6 shadow-lg">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  {entry.entry_type === 'text' && (
                    <FileText className="h-6 w-6 text-[#FC68B3]" />
                  )}
                  {entry.entry_type === 'audio' && (
                    <Mic className="h-6 w-6 text-[#FF8A48]" />
                  )}
                  {entry.entry_type === 'drawing' && (
                    <Brush className="h-6 w-6 text-[#3DFDFF]" />
                  )}
                  <h1 className="text-3xl font-bold text-gray-800">{entry.title}</h1>
                </div>
                
                <p className="text-gray-600 text-sm">
                  Created: {formatDate(entry.created_at)}
                </p>
              </div>
              
              {entry.entry_type === 'text' && entry.content && (
                <div className="bg-white/60 backdrop-blur-sm border border-[#FC68B3]/20 rounded-lg p-6 mb-6">
                  <p className="text-gray-800 whitespace-pre-wrap">{entry.content}</p>
                </div>
              )}
              
              {entry.entry_type === 'audio' && audioUrl && (
                <div className="bg-white/60 backdrop-blur-sm border border-[#FF8A48]/20 rounded-lg p-6 mb-6">
                  <audio src={audioUrl} controls className="w-full" />
                </div>
              )}
              
              {entry.entry_type === 'drawing' && drawingUrl && (
                <div className="bg-white/60 backdrop-blur-sm border border-[#3DFDFF]/20 rounded-lg p-6 mb-6 flex justify-center">
                  <img 
                    src={drawingUrl} 
                    alt={entry.title} 
                    className="max-w-full rounded-lg shadow-lg border border-gray-100" 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default JournalDetail;
