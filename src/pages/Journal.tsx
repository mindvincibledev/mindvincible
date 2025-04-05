import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import JournalCard from '@/components/journal/JournalCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { JournalEntry } from '@/types/journal';

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchJournalEntries();
  }, [user, navigate]);
  
  const fetchJournalEntries = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Use type assertion to tell TypeScript that data is JournalEntry[]
      setEntries((data || []) as JournalEntry[]);
    } catch (error: any) {
      console.error('Error fetching journal entries:', error);
      toast({
        variant: "destructive",
        title: "Error loading journals",
        description: error.message || "Could not load your journal entries",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 md:mb-0">Your Journal</h1>
            
            <Link to="/journal/new">
              <Button className="bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:opacity-90 text-white flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                New Journal Entry
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-white text-lg">Loading your journal entries...</div>
            </div>
          ) : entries.length === 0 ? (
            <div className="bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-8 text-center">
              <h2 className="text-2xl text-white mb-4">No Journal Entries Yet</h2>
              <p className="text-gray-300 mb-6">
                Start expressing yourself by creating your first journal entry.
              </p>
              <Link to="/journal/new">
                <Button className="bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:opacity-90 text-white">
                  Create Your First Entry
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entries.map((entry) => (
                <JournalCard
                  key={entry.id}
                  id={entry.id}
                  title={entry.title}
                  createdAt={entry.created_at}
                  type={entry.entry_type}
                  excerpt={entry.content?.substring(0, 120)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default Journal;
