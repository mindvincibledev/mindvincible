
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ConfidenceTreeReflection } from '@/types/confidenceTree';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import VisibilityToggle from '@/components/ui/VisibilityToggle';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface ReflectionCardProps {
  reflection: ConfidenceTreeReflection;
  onDelete: (id: string) => void;
}

export const ReflectionCard = ({ reflection, onDelete }: ReflectionCardProps) => {
  const [isVisible, setIsVisible] = useState(reflection.is_visible_to_clinicians || false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleVisibilityChange = async (visible: boolean) => {
    try {
      const { error } = await supabase
        .from('confidence_tree_reflections')
        .update({ is_visible_to_clinicians: visible })
        .eq('id', reflection.id);
        
      if (error) throw error;
      setIsVisible(visible);
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update visibility');
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this reflection?")) {
      setIsDeleting(true);
      try {
        const { error } = await supabase
          .from('confidence_tree_reflections')
          .delete()
          .eq('id', reflection.id);
          
        if (error) throw error;
        onDelete(reflection.id!);
        toast.success('Reflection deleted');
      } catch (error) {
        console.error('Error deleting reflection:', error);
        toast.error('Failed to delete reflection');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="h-full flex flex-col bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {reflection.confidence_trees?.name || "Unnamed Tree"}
        </CardTitle>
        <CardDescription className="text-sm">
          {reflection.created_at && format(new Date(reflection.created_at), 'MMM dd, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mb-2 text-sm font-medium text-gray-700">
          Prompt: {reflection.prompt}
        </div>
        <p className="text-gray-800 mt-2">
          {reflection.reflection_text}
        </p>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <VisibilityToggle 
          isVisible={isVisible} 
          onToggle={handleVisibilityChange}
          description="Share with clinicians" 
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-red-500 hover:bg-red-50" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 size={18} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReflectionCard;
