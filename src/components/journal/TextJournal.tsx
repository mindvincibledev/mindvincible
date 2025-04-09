
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TextJournalProps {
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
  title: string;
  content: string;
}

const TextJournal: React.FC<TextJournalProps> = ({
  onContentChange,
  onTitleChange,
  title,
  content
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="journal-title" className="text-black mb-2 block font-medium">
          Journal Title
        </Label>
        <Input
          id="journal-title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter a title for your journal entry"
          className="bg-white/90 backdrop-blur-sm border-[#FC68B3]/30 text-black placeholder-gray-500 focus-visible:ring-[#FC68B3]/50 transition-all"
        />
      </div>
      
      <div>
        <Label htmlFor="journal-content" className="text-black mb-2 block font-medium">
          Journal Content
        </Label>
        <Textarea
          id="journal-content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Write your thoughts and feelings here..."
          className="min-h-[200px] bg-white/90 backdrop-blur-sm border-[#FC68B3]/30 text-black placeholder-gray-500 focus-visible:ring-[#FC68B3]/50 transition-all"
        />
      </div>
    </div>
  );
};

export default TextJournal;
