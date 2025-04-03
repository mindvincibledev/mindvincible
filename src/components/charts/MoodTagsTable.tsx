
import React from 'react';
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

type MoodTagsTableProps = {
  moodTags: Array<{
    mood: string;
    tag: string;
    count: number;
  }>;
};

const MoodTagsTable = ({ moodTags }: MoodTagsTableProps) => {
  const topTags = moodTags.slice(0, 10); // Show only top 10 tags
  
  return (
    <Card className="col-span-1 md:col-span-3 bg-black/40 backdrop-blur-lg border-purple-500/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white">Most Used Tags by Mood</CardTitle>
        <CardDescription className="text-white/60">See which factors influence your moods</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg">
          <Table>
            <TableHeader className="bg-black/50">
              <TableRow>
                <TableHead className="text-white/80">Mood</TableHead>
                <TableHead className="text-white/80">Tag</TableHead>
                <TableHead className="text-white/80 text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topTags.length > 0 ? (
                topTags.map((item, index) => (
                  <TableRow key={index} className="border-b border-white/5 hover:bg-white/5">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getMoodColor(item.mood) }}
                        ></div>
                        <span className="text-white/90">{item.mood}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/70">{item.tag}</TableCell>
                    <TableCell className="text-right font-medium text-white">{item.count}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-white/50">
                    No tag data available yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTagsTable;
