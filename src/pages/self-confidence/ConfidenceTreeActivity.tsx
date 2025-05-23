
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from "@/components/ui/use-toast";
import { useNavigate, Link } from 'react-router-dom';
import BuildTree from '@/components/confidence-tree/BuildTree';
import ReflectionSection from '@/components/confidence-tree/ReflectionSection';
import PastReflections from '@/components/confidence-tree/PastReflections';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import {
  TreeData,
  parseTreeDataFromSupabase,
  prepareTreeDataForSupabase,
  ConfidenceTreeReflection,
  createNewTree
} from '@/types/confidenceTree';

const ConfidenceTreeActivity = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("build");
  const [currentTree, setCurrentTree] = useState<TreeData | null>(null);
  const [userTrees, setUserTrees] = useState<TreeData[]>([]);
  const [treeToEdit, setTreeToEdit] = useState<TreeData | null>(null);
  const [loading, setLoading] = useState(true);

  // Reflection states
  const [reflectionPrompts, setReflectionPrompts] = useState([
    "Which branch of your tree is the strongest? Why?",
    "Which wilted leaves (negative influences) would you like to release from your tree?",
    "Which leaves would you like to see grow more in the future?"
  ]);
  const [promptIndex, setPromptIndex] = useState(0);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [savingReflection, setSavingReflection] = useState(false);
  const [selectedBranchForReflection, setSelectedBranchForReflection] = useState('');
  const [selectedLeafToRelease, setSelectedLeafToRelease] = useState<{id: string, text: string} | null>(null);

  // Function to load user's trees
  const loadUserTrees = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data: trees, error } = await supabase
        .from('confidence_trees')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (trees && trees.length > 0) {
        const parsedTrees = trees.map(tree => parseTreeDataFromSupabase(tree));
        setUserTrees(parsedTrees);
        // Set the most recently updated tree as the current one
        const mostRecent = parsedTrees.reduce((latest, tree) => {
          if (!latest.updated_at) return tree;
          if (!tree.updated_at) return latest;
          return new Date(tree.updated_at) > new Date(latest.updated_at) ? tree : latest;
        }, parsedTrees[0]);
        setCurrentTree(mostRecent);
        setTreeToEdit(mostRecent);
      } else {
        // Create a new tree if none exists
        createNewEmptyTree();
      }
    } catch (error) {
      console.error('Error loading trees:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your confidence trees',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new empty tree
  const createNewEmptyTree = () => {
    const newTree: TreeData = {
      name: "My Confidence Tree",
      branches: [],
      user_id: user?.id
    };
    setCurrentTree(newTree);
    setTreeToEdit(newTree);
  };

  // Function to handle tree changes
  const handleTreeChange = (updatedTree: TreeData) => {
    setCurrentTree(updatedTree);
  };

  // Function to save tree to database
  const saveTree = async () => {
    if (!user || !currentTree) return;
    
    try {
      setLoading(true);
      const treeData = prepareTreeDataForSupabase(currentTree);
      
      if (currentTree.id) {
        // Update existing tree
        const { error } = await supabase
          .from('confidence_trees')
          .update({
            name: treeData.name,
            branches: treeData.branches,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentTree.id);
          
        if (error) throw error;
        toast({ title: 'Success', description: 'Your tree has been updated' });
      } else {
        // Create new tree
        const { data, error } = await supabase
          .from('confidence_trees')
          .insert({
            name: treeData.name,
            branches: treeData.branches,
            user_id: user.id
          })
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const newTree = parseTreeDataFromSupabase(data[0]);
          // Update the trees list
          setUserTrees(prevTrees => [...prevTrees, newTree]);
          
          // Reset to a new empty tree after successfully saving
          createNewEmptyTree();
          toast({ 
            title: 'Success', 
            description: 'Your tree has been created! You can now create another tree or view your saved trees.'
          });
        }
      }
    } catch (error) {
      console.error('Error saving tree:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your tree',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle leaf actions (star, release)
  const handleLeafAction = (branchId: string, leafId: string, action: 'star' | 'release') => {
    if (!currentTree) return;
    
    const updatedTree = {...currentTree};
    const branchIndex = updatedTree.branches.findIndex(branch => branch.id === branchId);
    
    if (branchIndex === -1) return;
    
    if (action === 'star') {
      const leafIndex = updatedTree.branches[branchIndex].leaves.findIndex(leaf => leaf.id === leafId);
      if (leafIndex !== -1) {
        updatedTree.branches[branchIndex].leaves[leafIndex].starred = 
          !updatedTree.branches[branchIndex].leaves[leafIndex].starred;
      }
    } else if (action === 'release') {
      updatedTree.branches[branchIndex].leaves = 
        updatedTree.branches[branchIndex].leaves.filter(leaf => leaf.id !== leafId);
    }
    
    setCurrentTree(updatedTree);
    saveTree();
  };

  // Function to handle reflection submission - this was shown in your fragment
  const submitReflection = async () => {
    if (!reflectionText.trim()) {
      toast({ 
        title: 'Missing reflection',
        description: 'Please enter your reflection',
        variant: 'destructive'
      });
      return;
    }

    // If the first prompt requires a branch selection
    if (promptIndex === 0 && !selectedBranchForReflection) {
      toast({ 
        title: 'Missing selection',
        description: 'Please select a branch',
        variant: 'destructive'
      });
      return;
    }

    // Save the reflection to the database
    if (user && treeToEdit?.id) {
      setSavingReflection(true);
      try {
        const { error } = await supabase
          .from('confidence_tree_reflections')
          .insert({
            tree_id: treeToEdit.id,
            user_id: user.id,
            reflection_text: reflectionText,
            prompt: reflectionPrompts[promptIndex],
            is_visible_to_clinicians: true // Default to visible
          });

        if (error) throw error;
        
        // Handle leaf release if we're on the wilted leaves prompt
        if (promptIndex === 1 && selectedLeafToRelease) {
          const branchWithLeaf = currentTree?.branches.find(branch => 
            branch.leaves.some(leaf => leaf.id === selectedLeafToRelease.id)
          );
          
          if (branchWithLeaf) {
            handleLeafAction(branchWithLeaf.id, selectedLeafToRelease.id, 'release');
            
            // Update the tree in the database after releasing the leaf
            if (currentTree) {
              const updatedTreeData = prepareTreeDataForSupabase(currentTree);
              await supabase
                .from('confidence_trees')
                .update({
                  branches: updatedTreeData.branches
                })
                .eq('id', treeToEdit.id);
            }
          }
          
          setSelectedLeafToRelease(null);
        }
        
      } catch (error) {
        console.error('Error saving reflection:', error);
        toast({ 
          title: 'Error',
          description: 'Failed to save your reflection',
          variant: 'destructive'
        });
      } finally {
        setSavingReflection(false);
      }
    }
    
    toast({ title: 'Success', description: 'Reflection saved!' });
    setReflectionText('');
    
    // Reset branch selection if moving from first prompt
    if (promptIndex === 0) {
      setSelectedBranchForReflection('');
    }
    
    // Move to the next prompt or close dialog if done
    if (promptIndex < reflectionPrompts.length - 1) {
      setPromptIndex(promptIndex + 1);
    } else {
      setShowPromptDialog(false);
      setPromptIndex(0);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserTrees();
    } else {
      navigate('/login');
    }
  }, [user]);

  if (loading && !currentTree) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#D5D5F1]/10 pt-16 pb-8">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <div className="mb-6">
          <Link to="/resources" className="flex items-center text-[#FF8A48] hover:text-[#FF8A48]/80 transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Back to Resources Hub</span>
          </Link>
        </div>
        
        <Card className="p-6 bg-white/90 backdrop-blur-lg shadow-xl border-none overflow-hidden">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] bg-clip-text text-transparent">
            Grow Your Confidence Tree
          </h1>
          
          <Tabs defaultValue="build" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger 
                value="build" 
                className="text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF8A48] data-[state=active]:to-[#FC68B3] data-[state=active]:text-white"
              >
                Build Tree
              </TabsTrigger>
              <TabsTrigger 
                value="reflect" 
                className="text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF8A48] data-[state=active]:to-[#FC68B3] data-[state=active]:text-white"
              >
                Reflect
              </TabsTrigger>
              <TabsTrigger 
                value="past-reflections" 
                className="text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FF8A48] data-[state=active]:to-[#FC68B3] data-[state=active]:text-white"
              >
                My Reflections
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="build">
              {currentTree && (
                <BuildTree 
                  treeData={currentTree} 
                  onTreeChange={handleTreeChange}
                  onSave={saveTree}
                  loading={loading}
                />
              )}
            </TabsContent>
            
            <TabsContent value="reflect">
              {currentTree && treeToEdit && (
                <ReflectionSection 
                  treeData={currentTree}
                  treeId={treeToEdit.id || ''}
                  onShowPrompt={() => {
                    setShowPromptDialog(true);
                    setPromptIndex(0);
                  }}
                  showPromptDialog={showPromptDialog}
                  setShowPromptDialog={setShowPromptDialog}
                  reflectionPrompts={reflectionPrompts}
                  promptIndex={promptIndex}
                  reflectionText={reflectionText}
                  setReflectionText={setReflectionText}
                  submitReflection={submitReflection}
                  savingReflection={savingReflection}
                  selectedBranchForReflection={selectedBranchForReflection}
                  setSelectedBranchForReflection={setSelectedBranchForReflection}
                  selectedLeafToRelease={selectedLeafToRelease}
                  setSelectedLeafToRelease={setSelectedLeafToRelease}
                />
              )}
            </TabsContent>
            
            <TabsContent value="past-reflections">
              {treeToEdit && (
                <PastReflections 
                  userId={user?.id || ''}
                  trees={userTrees}
                  currentTreeId={treeToEdit.id || ''}
                />
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ConfidenceTreeActivity;
