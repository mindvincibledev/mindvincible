
import React, { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMoodColor } from '@/utils/moodUtils';
import { ScrollArea } from '@/components/ui/scroll-area';

type MoodTagsTableProps = {
  moodTags: Array<{
    mood: string;
    tag: string;
    count: number;
  }>;
};

const MoodTagsTable = ({ moodTags }: MoodTagsTableProps) => {
  // Reorganize data by mood
  const moodTagsByMood = useMemo(() => {
    const moodMap: Record<string, Array<{tag: string; count: number}>> = {};
    
    // Group tags by mood
    moodTags.forEach(item => {
      if (!moodMap[item.mood]) {
        moodMap[item.mood] = [];
      }
      moodMap[item.mood].push({ tag: item.tag, count: item.count });
    });
    
    // Sort tags within each mood by count (descending)
    Object.keys(moodMap).forEach(mood => {
      moodMap[mood].sort((a, b) => b.count - a.count);
    });
    
    return moodMap;
  }, [moodTags]);
  
  // Get all moods
  const moods = useMemo(() => Object.keys(moodTagsByMood), [moodTagsByMood]);
  
  // Maximum number of tags to show per mood
  const maxTagsPerMood = 5;
  
  return (
    <Card className="col-span-1 md:col-span-3 bg-black/40 backdrop-blur-lg border-purple-500/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white">Most Used Tags by Mood</CardTitle>
        <CardDescription className="text-white/60">See which factors influence your moods</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] rounded-lg">
          {moods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {moods.map(mood => (
                <div key={mood} className="rounded-lg bg-black/20 p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getMoodColor(mood) }}
                    ></div>
                    <h3 className="text-white font-medium">{mood}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {moodTagsByMood[mood].slice(0, maxTagsPerMood).map((item, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between rounded bg-white/5 px-3 py-2"
                      >
                        <span className="text-white/80 text-sm">{item.tag}</span>
                        <span className="text-white font-medium text-xs bg-white/10 px-2 py-1 rounded-full">
                          {item.count}
                        </span>
                      </div>
                    ))}
                    
                    {moodTagsByMood[mood].length > maxTagsPerMood && (
                      <div className="text-center text-white/50 text-xs mt-2">
                        +{moodTagsByMood[mood].length - maxTagsPerMood} more tags
                      </div>
                    )}
                    
                    {moodTagsByMood[mood].length === 0 && (
                      <div className="text-center text-white/50 text-sm py-3">
                        No tags for this mood
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-white/50">
              No tag data available yet.
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MoodTagsTable;
