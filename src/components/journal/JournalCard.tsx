
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { FileText, Mic, Brush } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JournalCardProps {
  id: string;
  title: string;
  createdAt: string;
  type: string;
  excerpt?: string;
}

const JournalCard: React.FC<JournalCardProps> = ({ id, title, createdAt, type, excerpt }) => {
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  const getIcon = () => {
    switch (type) {
      case 'text':
        return <FileText className="h-5 w-5 text-[#FC68B3]" />;
      case 'audio':
        return <Mic className="h-5 w-5 text-[#FF8A48]" />;
      case 'drawing':
        return <Brush className="h-5 w-5 text-[#3DFDFF]" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  const getBackgroundStyle = () => {
    switch (type) {
      case 'text':
        return 'border-[#FC68B3]/30 bg-gradient-to-br from-[#FC68B3]/10 to-white/80';
      case 'audio':
        return 'border-[#FF8A48]/30 bg-gradient-to-br from-[#FF8A48]/10 to-white/80';
      case 'drawing':
        return 'border-[#3DFDFF]/30 bg-gradient-to-br from-[#3DFDFF]/10 to-white/80';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <Link to={`/journal/${id}`}>
      <Card className={`hover:scale-105 transition-all backdrop-blur-sm border ${getBackgroundStyle()}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-gray-800">{title}</CardTitle>
            <div className="bg-white/50 p-2 rounded-full">{getIcon()}</div>
          </div>
        </CardHeader>
        
        <CardContent>
          {excerpt && type === 'text' && (
            <p className="text-sm text-gray-600 line-clamp-3">{excerpt}</p>
          )}
          
          {type === 'audio' && (
            <div className="h-12 flex items-center justify-center">
              <p className="text-sm text-gray-600">Audio Journal Entry</p>
            </div>
          )}
          
          {type === 'drawing' && (
            <div className="h-12 flex items-center justify-center">
              <p className="text-sm text-gray-600">Drawing Journal Entry</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 text-xs text-gray-500">
          Created {formattedDate}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default JournalCard;
