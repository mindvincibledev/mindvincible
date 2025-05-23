
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash2, Eye, EyeOff, CalendarDays } from "lucide-react";
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
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
import { ConfidenceTreeReflection, TreeData } from '@/types/confidenceTree';
import ReflectionCard from './ReflectionCard';

type PastReflectionsProps = {
  userId: string;
  trees: TreeData[];
  currentTreeId: string;
};

const PastReflections = ({ userId, trees, currentTreeId }: PastReflectionsProps) => {
  const [selectedTreeId, setSelectedTreeId] = useState<string>(currentTreeId);
  const [reflections, setReflections] = useState<ConfidenceTreeReflection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (userId && selectedTreeId) {
      fetchReflections();
    }
  }, [userId, selectedTreeId]);

  const fetchReflections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('confidence_tree_reflections')
        .select(`*, confidence_trees(name)`)
        .eq('user_id', userId)
        .eq('tree_id', selectedTreeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReflections(data || []);
    } catch (error) {
      console.error('Error fetching reflections:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your reflections',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (reflectionId: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('confidence_tree_reflections')
        .update({ is_visible_to_clinicians: !currentVisibility })
        .eq('id', reflectionId)
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setReflections(reflections.map(reflection => 
        reflection.id === reflectionId 
          ? { ...reflection, is_visible_to_clinicians: !currentVisibility } 
          : reflection
      ));

      toast({
        title: 'Success',
        description: `Reflection is now ${!currentVisibility ? 'visible' : 'hidden'} to clinicians`,
      });
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast({
        title: 'Error',
        description: 'Failed to update visibility',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteReflection = async (reflectionId: string) => {
    try {
      const { error } = await supabase
        .from('confidence_tree_reflections')
        .delete()
        .eq('id', reflectionId)
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setReflections(reflections.filter(reflection => reflection.id !== reflectionId));
      
      toast({
        title: 'Success',
        description: 'Reflection deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting reflection:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete reflection',
        variant: 'destructive'
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-[#FF8A48]">My Reflection Journal</h2>
        
        <Select 
          value={selectedTreeId} 
          onValueChange={setSelectedTreeId}
        >
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Select a tree" />
          </SelectTrigger>
          <SelectContent>
            {trees.map(tree => (
              <SelectItem key={tree.id} value={tree.id || ''}>
                {tree.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-pulse text-[#FF8A48]">Loading reflections...</div>
        </div>
      ) : reflections.length > 0 ? (
        <div className="grid gap-6">
          {reflections.map(reflection => (
            <ReflectionCard
              key={reflection.id}
              reflection={reflection}
              onToggleVisibility={handleToggleVisibility}
              onDelete={() => setDeletingId(reflection.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="bg-[#D5D5F1]/20">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-center text-gray-500 mb-4">
              You haven't added any reflections for this tree yet.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                // Fix: Use querySelector to get the element and add a null check
                const reflectTab = document.querySelector('[data-value="reflect"]');
                if (reflectTab instanceof HTMLElement) {
                  reflectTab.click();
                }
              }}
            >
              Start Reflecting
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your reflection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deletingId && handleDeleteReflection(deletingId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PastReflections;
