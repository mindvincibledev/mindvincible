
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfidenceTreeReflection } from '@/types/confidenceTree';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import ReflectionCard from './ReflectionCard';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const PastReflections = () => {
  const { user } = useAuth();
  const [reflections, setReflections] = useState<ConfidenceTreeReflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupByTree, setGroupByTree] = useState(true);

  // Function to fetch reflections from Supabase
  const fetchReflections = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('confidence_tree_reflections')
        .select(`
          *,
          confidence_trees (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our type definitions
      const formattedData = data.map(item => ({
        ...item,
        confidence_trees: item.confidence_trees as Partial<typeof item.confidence_trees>
      }));
      
      setReflections(formattedData);
    } catch (error) {
      console.error('Error fetching reflections:', error);
      toast.error('Failed to load your reflections');
    } finally {
      setLoading(false);
    }
  };

  // Delete a reflection
  const handleDelete = (reflectionId: string) => {
    setReflections(reflections.filter(r => r.id !== reflectionId));
  };

  // Group reflections by tree
  const getGroupedReflections = () => {
    if (!groupByTree) return reflections;
    
    const treeMap = new Map<string, ConfidenceTreeReflection[]>();
    
    reflections.forEach(reflection => {
      const treeName = reflection.confidence_trees?.name || 'Unknown Tree';
      if (!treeMap.has(treeName)) {
        treeMap.set(treeName, []);
      }
      treeMap.get(treeName)!.push(reflection);
    });
    
    return Array.from(treeMap.values()).flat();
  };

  // Effect to fetch reflections when component mounts
  useEffect(() => {
    if (user) {
      fetchReflections();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading your reflections...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">My Reflections</CardTitle>
            <CardDescription>Past thoughts on your confidence trees</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="groupByTree" className="text-sm text-gray-600">
              Group by tree
            </label>
            <input 
              type="checkbox"
              id="groupByTree"
              checked={groupByTree}
              onChange={(e) => setGroupByTree(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {reflections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">You haven't added any reflections yet.</p>
            <p className="text-gray-400">Complete the reflection process with your trees to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getGroupedReflections().map((reflection, index) => (
              <motion.div
                key={reflection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ReflectionCard 
                  reflection={reflection} 
                  onDelete={handleDelete} 
                />
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PastReflections;
