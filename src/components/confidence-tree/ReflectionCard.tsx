
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash2, Eye, EyeOff, CalendarDays } from "lucide-react";
import { format } from 'date-fns';
import { ConfidenceTreeReflection } from '@/types/confidenceTree';
import { motion } from 'framer-motion';

interface ReflectionCardProps {
  reflection: ConfidenceTreeReflection;
  onToggleVisibility: (id: string, currentVisibility: boolean) => void;
  onDelete: () => void;
}

const ReflectionCard = ({ reflection, onToggleVisibility, onDelete }: ReflectionCardProps) => {
  const isVisible = reflection.is_visible_to_clinicians !== false;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden border-l-4 ${isVisible ? 'border-l-[#2AC20E]' : 'border-l-[#FC68B3]'}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-medium text-[#FF8A48]">
                {reflection.prompt}
              </CardTitle>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <CalendarDays className="h-4 w-4 mr-1" />
                {reflection.created_at && format(new Date(reflection.created_at), 'MMM d, yyyy - h:mm a')}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {isVisible ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-rose-500" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{reflection.reflection_text}</p>
          
          {reflection.confidence_trees && (
            <div className="mt-2 text-sm text-gray-500">
              <span className="font-medium">Tree:</span> {reflection.confidence_trees.name}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2 pb-4 flex justify-between">
          <div className="flex items-center space-x-2">
            <Switch 
              id={`visibility-${reflection.id}`}
              checked={isVisible}
              onCheckedChange={() => onToggleVisibility(reflection.id || '', isVisible)}
            />
            <Label htmlFor={`visibility-${reflection.id}`} className="text-sm">
              {isVisible ? 'Visible to clinicians' : 'Hidden from clinicians'}
            </Label>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={onDelete}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ReflectionCard;
