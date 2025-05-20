
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Trash2, ChevronDown, ChevronUp, Zap, BarChart3 } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import VisibilityToggle from '@/components/ui/VisibilityToggle';
import { motion } from 'framer-motion';

interface BatteryEntry {
  id: string;
  starting_percentage: number;
  final_percentage: number;
  feeling_after_scroll: string | null;
  selected_vibes: string[] | null;
  boost_topics: string[] | null;
  drain_patterns: string | null;
  accounts_to_unfollow: string | null;
  accounts_to_follow_more: string | null;
  next_scroll_strategy: string | null;
  shared_post_description: string | null;
  shared_post_impact: string | null;
  bonus_completed: boolean | null;
  created_at: string;
  visible_to_clinicians: boolean;
}

interface BatteryPost {
  id: string;
  entry_id: string;
  post_type: 'charging' | 'draining';
  percentage_change: number;
  post_category: string | null;
  notes: string | null;
  created_at: string;
}

interface PastBatteryEntriesProps {
  entries?: BatteryEntry[];
  onRefreshEntries?: () => void;
}

const PastBatteryEntries: React.FC<PastBatteryEntriesProps> = ({ 
  entries: propEntries = [], 
  onRefreshEntries 
}) => {
  const { user } = useAuth();
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [entriesWithPosts, setEntriesWithPosts] = useState<{[key: string]: BatteryPost[]}>({});
  const [loadingPosts, setLoadingPosts] = useState<{[key: string]: boolean}>({});
  const [entries, setEntries] = useState<BatteryEntry[]>(propEntries);

  const fetchPostsForEntry = async (entryId: string) => {
    if (entriesWithPosts[entryId] || !user) return;
    
    try {
      setLoadingPosts(prev => ({ ...prev, [entryId]: true }));
      
      const { data, error } = await supabase
        .from('battery_boost_posts')
        .select('*')
        .eq('entry_id', entryId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Fix: Cast the returned data to ensure it matches the BatteryPost type
      const typedData: BatteryPost[] = data?.map(item => ({
        ...item,
        post_type: item.post_type as 'charging' | 'draining'
      })) || [];

      setEntriesWithPosts(prev => ({
        ...prev,
        [entryId]: typedData
      }));
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load entry details');
    } finally {
      setLoadingPosts(prev => ({ ...prev, [entryId]: false }));
    }
  };

  const toggleExpanded = (entryId: string) => {
    if (expandedEntryId === entryId) {
      setExpandedEntryId(null);
    } else {
      setExpandedEntryId(entryId);
      fetchPostsForEntry(entryId);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!user) return;
    
    try {
      // First delete related posts
      const { error: postsError } = await supabase
        .from('battery_boost_posts')
        .delete()
        .eq('entry_id', entryId)
        .eq('user_id', user.id);
      
      if (postsError) throw postsError;
      
      // Then delete the entry
      const { error: entryError } = await supabase
        .from('battery_boost_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.id);
      
      if (entryError) throw entryError;
      
      // Immediately update the local state
      setEntries(entries.filter(entry => entry.id !== entryId));
      
      toast.success('Entry deleted successfully');
      // Still call onRefreshEntries to sync with parent components if needed
      if (onRefreshEntries) onRefreshEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  const handleVisibilityChange = async (entryId: string, isVisible: boolean) => {
    if (!user) return;
    
    try {
      // Immediately update local state for responsive UI
      setEntries(entries.map(entry => 
        entry.id === entryId ? { ...entry, visible_to_clinicians: isVisible } : entry
      ));
      
      const { error } = await supabase
        .from('battery_boost_entries')
        .update({ visible_to_clinicians: isVisible })
        .eq('id', entryId)
        .eq('user_id', user.id);
      
      if (error) {
        // If the update fails, revert the local state
        setEntries(entries.map(entry => 
          entry.id === entryId ? { ...entry, visible_to_clinicians: !isVisible } : entry
        ));
        throw error;
      }
      
      toast.success(`Entry is now ${isVisible ? 'visible' : 'private'} to clinicians`);
      
      // Still call onRefreshEntries to sync with parent components if needed
      if (onRefreshEntries) onRefreshEntries();
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  // Update local entries when prop entries change
  React.useEffect(() => {
    setEntries(propEntries);
  }, [propEntries]);

  if (entries.length === 0) {
    return (
      <div className="text-center p-6 bg-white/90 rounded-lg shadow-sm">
        <p className="text-gray-600">No battery entries yet. Complete your first Battery Boost activity!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <Collapsible>
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      {format(new Date(entry.created_at), 'MMM d, yyyy')}
                    </p>
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Zap className="h-5 w-5 text-[#FF8A48]" />
                      Battery Boost Entry
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <VisibilityToggle
                      isVisible={entry.visible_to_clinicians}
                      onToggle={(value) => handleVisibilityChange(entry.id, value)}
                      description="Share with clinicians"
                    />

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleExpanded(entry.id)}
                      >
                        {expandedEntryId === entry.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="font-medium">Battery Level</span>
                    <span>
                      {entry.starting_percentage}% → {entry.final_percentage ?? entry.starting_percentage}%
                    </span>
                  </div>
                  <Progress 
                    value={entry.final_percentage ?? entry.starting_percentage} 
                    className="h-2.5"
                  />
                </div>
              </div>

              <CollapsibleContent>
                <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
                  {loadingPosts[entry.id] ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">Loading entry details...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Posts Section */}
                        {entriesWithPosts[entry.id] && entriesWithPosts[entry.id].length > 0 && (
                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="text-md font-medium mb-3">Posts Tracked</h4>
                            <div className="space-y-3">
                              {entriesWithPosts[entry.id].map(post => (
                                <div 
                                  key={post.id} 
                                  className={`p-3 rounded-lg ${
                                    post.post_type === 'charging' 
                                      ? 'bg-green-50 border-l-4 border-green-400' 
                                      : 'bg-red-50 border-l-4 border-red-400'
                                  }`}
                                >
                                  <div className="flex justify-between">
                                    <span className="font-medium">
                                      {post.post_type === 'charging' ? '+' : '-'}{Math.abs(post.percentage_change)}%
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {post.post_category || 'Uncategorized'}
                                    </span>
                                  </div>
                                  {post.notes && (
                                    <p className="text-sm mt-1">{post.notes}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reflections Section */}
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h4 className="text-md font-medium mb-3">Reflections</h4>
                          <div className="space-y-2">
                            {entry.feeling_after_scroll && (
                              <div className="mb-2">
                                <p className="text-sm font-medium">How I felt:</p>
                                <p className="text-sm">{entry.feeling_after_scroll}</p>
                              </div>
                            )}
                            
                            {entry.selected_vibes && entry.selected_vibes.length > 0 && (
                              <div className="mb-2">
                                <p className="text-sm font-medium">Vibes:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {entry.selected_vibes.map((vibe, idx) => (
                                    <span 
                                      key={idx} 
                                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                                    >
                                      {vibe}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {entry.boost_topics && entry.boost_topics.length > 0 && (
                              <div className="mb-2">
                                <p className="text-sm font-medium">Topics that boost me:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {entry.boost_topics.map((topic, idx) => (
                                    <span 
                                      key={idx} 
                                      className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Additional Insights */}
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="text-md font-medium mb-3">Insights & Actions</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            {entry.drain_patterns && (
                              <div>
                                <p className="text-sm font-medium">Drain Patterns:</p>
                                <p className="text-sm">{entry.drain_patterns}</p>
                              </div>
                            )}
                            {entry.accounts_to_unfollow && (
                              <div>
                                <p className="text-sm font-medium">Accounts to Unfollow:</p>
                                <p className="text-sm">{entry.accounts_to_unfollow}</p>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            {entry.accounts_to_follow_more && (
                              <div>
                                <p className="text-sm font-medium">Accounts to Follow More:</p>
                                <p className="text-sm">{entry.accounts_to_follow_more}</p>
                              </div>
                            )}
                            {entry.next_scroll_strategy && (
                              <div>
                                <p className="text-sm font-medium">Next Scroll Strategy:</p>
                                <p className="text-sm">{entry.next_scroll_strategy}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bonus Challenge */}
                        {(entry.bonus_completed || entry.shared_post_description) && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <h5 className="text-sm font-medium flex items-center gap-1 mb-2">
                              <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white font-bold">+</span>
                              </div>
                              Bonus Challenge
                            </h5>
                            {entry.shared_post_description && (
                              <div>
                                <p className="text-sm">{entry.shared_post_description}</p>
                              </div>
                            )}
                            {entry.shared_post_impact && (
                              <div className="mt-1">
                                <p className="text-sm italic">"{entry.shared_post_impact}"</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default PastBatteryEntries;
