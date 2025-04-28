
import React, { useEffect, useState } from 'react';
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
import { JournalEntry, PowerOfHiChallenge } from '@/types/journal';
import { getSignedUrl, refreshSignedUrlIfNeeded } from '@/utils/journalFileUtils';
import { getPowerOfHiFileUrl } from '@/utils/powerOfHiFileUtils';

const JournalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [hiChallenge, setHiChallenge] = useState<PowerOfHiChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [drawingUrl, setDrawingUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [whoPreview, setWhoPreview] = useState<string | null>(null);
  const [howItWentPreview, setHowItWentPreview] = useState<string | null>(null);
  const [feelingPreview, setFeelingPreview] = useState<string | null>(null);
  
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
      
      // First try to fetch from journal_entries
      const { data: journalData, error: journalError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', entryId)
        .eq('user_id', user?.id)
        .maybeSingle();
        
      if (journalData) {
        setEntry(journalData as JournalEntry);
        
        // Get signed URLs for audio or drawing if needed
        if (journalData.audio_path) {
          try {
            const url = await getSignedUrl(journalData.audio_path, 'audio_files');
            setAudioUrl(url);
          } catch (error) {
            console.error('Error getting audio URL:', error);
          }
        }
        
        if (journalData.drawing_path) {
          try {
            const url = await getSignedUrl(journalData.drawing_path, 'drawing_files');
            setDrawingUrl(url);
          } catch (error) {
            console.error('Error getting drawing URL:', error);
          }
        }
      } else {
        // If not found in journal_entries, try to fetch from simple_hi_challenges
        const { data: hiData, error: hiError } = await supabase
          .from('simple_hi_challenges')
          .select('*')
          .eq('id', entryId)
          .eq('user_id', user?.id)
          .maybeSingle();
          
        if (hiError) throw hiError;
        
        if (hiData) {
          setHiChallenge(hiData as PowerOfHiChallenge);
          
          // Get signed URLs for Power of Hi files
          if (hiData.who_path) {
            const signedUrl = await getPowerOfHiFileUrl(hiData.who_path);
            if (signedUrl) {
              setWhoPreview(signedUrl);
            }
          }
          
          if (hiData.how_it_went_path) {
            const signedUrl = await getPowerOfHiFileUrl(hiData.how_it_went_path);
            if (signedUrl) {
              setHowItWentPreview(signedUrl);
            }
          }
          
          if (hiData.feeling_path) {
            const signedUrl = await getPowerOfHiFileUrl(hiData.feeling_path);
            if (signedUrl) {
              setFeelingPreview(signedUrl);
            }
          }
        } else {
          // Entry not found in either table
          toast({
            variant: "destructive",
            title: "Entry not found",
            description: "The journal entry you're looking for doesn't exist",
          });
          navigate('/journal');
          return;
        }
      }
    } catch (error: any) {
      console.error('Error fetching entry:', error);
      toast({
        variant: "destructive",
        title: "Error loading entry",
        description: error.message || "Could not load the entry",
      });
      navigate('/journal');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteEntry = async () => {
    if ((!entry && !hiChallenge) || !user) return;
    
    try {
      if (entry) {
        // Delete journal entry files and database record
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
        
        // Delete the journal entry record
        const { error } = await supabase
          .from('journal_entries')
          .delete()
          .eq('id', entry.id);
          
        if (error) throw error;
      } else if (hiChallenge) {
        // Delete Power of Hi challenge files
        for (const path of [hiChallenge.who_path, hiChallenge.how_it_went_path, hiChallenge.feeling_path]) {
          if (path) {
            const { error: deleteError } = await supabase.storage
              .from('simple_hi_images')
              .remove([path]);
              
            if (deleteError) {
              console.error('Error deleting Power of Hi file:', deleteError);
            }
          }
        }
        
        // Delete the Power of Hi challenge record
        const { error } = await supabase
          .from('simple_hi_challenges')
          .delete()
          .eq('id', hiChallenge.id);
          
        if (error) throw error;
      }
      
      toast({
        title: "Entry deleted",
        description: "Your entry has been deleted",
      });
      
      navigate('/journal');
    } catch (error: any) {
      console.error('Error deleting entry:', error);
      toast({
        variant: "destructive",
        title: "Error deleting entry",
        description: error.message || "Could not delete the entry",
      });
    }
  };
  
  // Define the formatDate function only once
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };
  
  if (loading) {
    return (
      <BackgroundWithEmojis>
        <div className="min-h-screen relative">
          <Navbar />
          
          <div className="relative z-10 container mx-auto px-4 py-24">
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-800 text-lg">Loading entry...</div>
            </div>
          </div>
        </div>
      </BackgroundWithEmojis>
    );
  }
  
  if (!entry && !hiChallenge) return null;
  
  // Display journal entry
  if (entry) {
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
  }
  
  // Display Power of Hi challenge
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
                      Power of Hi challenge and any associated files.
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
            
            <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-100 p-6 shadow-lg">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold text-gray-800">Power of Hi Challenge</h1>
                </div>
                
                <p className="text-gray-600 text-sm">
                  Created: {hiChallenge && formatDate(hiChallenge.created_at)}
                </p>
                
                {hiChallenge && (
                  <div className="mt-4 p-3 bg-white/60 backdrop-blur-sm border border-[#FF8A48]/20 rounded-lg">
                    <h2 className="font-semibold text-lg">Goal: {hiChallenge.goal}</h2>
                    <p className="text-sm text-gray-600">Level: {hiChallenge.challenge_level}</p>
                  </div>
                )}
              </div>
              
              {whoPreview && (
                <div className="bg-white/60 backdrop-blur-sm border border-[#3DFDFF]/20 rounded-lg p-6 mb-6">
                  <h3 className="font-medium mb-2">Who I Said Hi To</h3>
                  {hiChallenge?.who && (
                    <p className="mb-4 text-gray-700">{hiChallenge.who}</p>
                  )}
                  <div className="flex justify-center">
                    <img 
                      src={whoPreview} 
                      alt="Who" 
                      className="max-w-full rounded-lg shadow-lg border border-gray-100" 
                    />
                  </div>
                </div>
              )}

              {howItWentPreview && (
                <div className="bg-white/60 backdrop-blur-sm border border-[#3DFDFF]/20 rounded-lg p-6 mb-6">
                  <h3 className="font-medium mb-2">How It Went</h3>
                  {hiChallenge?.how_it_went && (
                    <p className="mb-4 text-gray-700">{hiChallenge.how_it_went}</p>
                  )}
                  <div className="flex justify-center">
                    <img 
                      src={howItWentPreview} 
                      alt="How It Went" 
                      className="max-w-full rounded-lg shadow-lg border border-gray-100" 
                    />
                  </div>
                </div>
              )}

              {feelingPreview && (
                <div className="bg-white/60 backdrop-blur-sm border border-[#3DFDFF]/20 rounded-lg p-6 mb-6">
                  <h3 className="font-medium mb-2">How I Felt</h3>
                  {hiChallenge?.feeling && (
                    <p className="mb-4 text-gray-700">{hiChallenge.feeling}</p>
                  )}
                  <div className="flex justify-center">
                    <img 
                      src={feelingPreview} 
                      alt="Feeling" 
                      className="max-w-full rounded-lg shadow-lg border border-gray-100" 
                    />
                  </div>
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
