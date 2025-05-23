import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Leaf, Plus, Star, X, Trash2, Eye, EyeOff, Save, Edit } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import TreeCanvas from '@/components/confidence-tree/TreeCanvas';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TreeData, Branch, Leaf as LeafType, parseTreeDataFromSupabase, prepareTreeDataForSupabase, ConfidenceTreeReflection } from '@/types/confidenceTree';
import { createNewBranch, createNewLeaf } from '@/utils/confidenceTreeUtils';
import PastReflections from '@/components/confidence-tree/PastReflections';
import { calculateLeafPositions, drawLeafShape, getLeafColor } from '@/utils/confidenceTreeUtils';
import VisibilityToggle from '@/components/ui/VisibilityToggle';

const ConfidenceTreeActivity = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('builder');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [trees, setTrees] = useState<TreeData[]>([]);
  const [currentTree, setCurrentTree] = useState<TreeData>({
    name: 'My Confidence Tree',
    branches: []
  });

  // Dialog states
  const [showBranchDialog, setShowBranchDialog] = useState(false);
  const [showLeafDialog, setShowLeafDialog] = useState(false);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [newBranchName, setNewBranchName] = useState('');
  const [newLeafText, setNewLeafText] = useState('');
  const [newLeafType, setNewLeafType] = useState<'positive' | 'negative' | 'mixed'>('positive');
  const [showReflectionMode, setShowReflectionMode] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [reflectionText, setReflectionText] = useState('');
  const [selectedLeafToRelease, setSelectedLeafToRelease] = useState<LeafType | null>(null);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [treeToEdit, setTreeToEdit] = useState<TreeData | null>(null);
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [showPostSaveReflection, setShowPostSaveReflection] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // New state for branch selection in reflection
  const [selectedBranchForReflection, setSelectedBranchForReflection] = useState<string>('');
  const [savingReflection, setSavingReflection] = useState(false);

  // Reflections questions for the user
  const reflectionPrompts = [
    "Which branch is the strongest? Why?",
    "Are there any wilted leaves you want to let go of?",
    "Which leaves do you want to grow more of?"
  ];

  // Function to check if we should enter reflection mode
  const checkForReflectionMode = (tree: TreeData) => {
    if (!tree || !tree.branches) return false;
    
    const hasBranches = tree.branches.length >= 3;
    const hasLeavesOnEachBranch = tree.branches.every(branch => branch.leaves.length > 0);
    
    return hasBranches && hasLeavesOnEachBranch;
  };

  // Fetch user's trees
  const fetchTrees = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('confidence_trees')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Parse the data to ensure proper typing
      const parsedTrees = (data || []).map(tree => parseTreeDataFromSupabase(tree));
      setTrees(parsedTrees);
    } catch (error) {
      console.error('Error fetching trees:', error);
      toast.error('Failed to load your trees');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (feedbackType: string) => {
    if (!user?.id) {
      toast.error("You need to be logged in to complete this activity");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Record activity completion with feedback
      const { error } = await supabase
        .from('activity_completions')
        .insert({
          user_id: user.id,
          activity_id: 'confidence-tree',
          activity_name: 'Confidence Tree',
          feedback: feedbackType
        });
      
      if (error) {
        console.error("Error completing activity:", error);
        toast.error("Failed to record activity completion");
        setIsSubmitting(false);
        return;
      }
      
      toast.success("Activity completed successfully!");
      setShowFeedback(false);
    } catch (error) {
      console.error("Error completing activity:", error);
      toast.error("Failed to record activity completion");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save tree to database
  const saveTree = async () => {
    if (!user) {
      toast.error('Please login to save your tree');
      return;
    }

    if (currentTree.branches.length === 0) {
      toast.error('Add at least one branch to your tree before saving');
      return;
    }

    setSaving(true);
    try {
      // Prepare tree data for Supabase
      const treeData = prepareTreeDataForSupabase(currentTree);
      
      // If we're editing an existing tree
      if (editMode && treeToEdit?.id) {
        const { error } = await supabase
          .from('confidence_trees')
          .update({
            name: treeData.name,
            branches: treeData.branches,
          })
          .eq('id', treeToEdit.id);
        
        if (error) throw error;
        
        toast.success('Tree updated successfully');
        setEditMode(false);
        setTreeToEdit(null);
        
      } else {
        // Creating a new tree - show feedback dialog first
        setShowFeedback(true);
        
        const { error } = await supabase
          .from('confidence_trees')
          .insert({
            user_id: user.id,
            name: treeData.name,
            branches: treeData.branches,
            is_shared: isVisible
          });
        
        if (error) throw error;
        
        toast.success('Tree saved successfully');
      }
      
      // Check if tree meets reflection criteria
      if (checkForReflectionMode(currentTree)) {
        setShowPostSaveReflection(true);
      }
      
      // Reset the current tree and fetch the updated list
      setCurrentTree({
        name: 'My Confidence Tree',
        branches: []
      });
      fetchTrees();
      setActiveTab('garden');
      setShowReflectionMode(false);
      
    } catch (error) {
      console.error('Error saving tree:', error);
      toast.error('Failed to save your tree');
    } finally {
      setSaving(false);
    }
  };

  // Delete a tree
  const deleteTree = async (treeId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('confidence_trees')
        .delete()
        .eq('id', treeId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success('Tree deleted successfully');
      fetchTrees();
    } catch (error) {
      console.error('Error deleting tree:', error);
      toast.error('Failed to delete the tree');
    }
  };

  // Toggle tree sharing status
  const toggleTreeSharing = async (tree: TreeData) => {
    if (!tree.id || !user) return;
    
    try {
      const newSharedStatus = !tree.is_shared;
      
      const { error } = await supabase
        .from('confidence_trees')
        .update({ is_shared: newSharedStatus })
        .eq('id', tree.id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setTrees(trees.map(t => 
        t.id === tree.id ? { ...t, is_shared: newSharedStatus } : t
      ));
      
      toast.success(newSharedStatus ? 'Tree is now shared' : 'Tree is now private');
    } catch (error) {
      console.error('Error toggling tree sharing:', error);
      toast.error('Failed to update sharing status');
    }
  };

  // Add a branch to the tree
  const addBranch = () => {
    if (!newBranchName.trim()) {
      toast.error('Please enter a name for the branch');
      return;
    }

    if (currentTree.branches.length >= 5) {
      toast.warning('Maximum 5 branches allowed for clarity');
      return;
    }

    const newBranch = createNewBranch(newBranchName);

    setCurrentTree({
      ...currentTree,
      branches: [...currentTree.branches, newBranch]
    });

    setNewBranchName('');
    setShowBranchDialog(false);

    toast.success(`Added branch: ${newBranchName}`);
  };

  // Add a leaf to a branch
  const addLeaf = () => {
    if (!selectedBranch) return;
    if (!newLeafText.trim()) {
      toast.error('Please enter some text for this leaf');
      return;
    }

    // Update limit from 5 to 15 leaves per branch
    if (selectedBranch.leaves.length >= 15) {
      toast.warning('Maximum 15 leaves allowed per branch');
      return;
    }

    const newLeaf = createNewLeaf(newLeafText, newLeafType);

    const updatedBranches = currentTree.branches.map(branch => 
      branch.id === selectedBranch.id 
        ? { ...branch, leaves: [...branch.leaves, newLeaf] }
        : branch
    );

    setCurrentTree({
      ...currentTree,
      branches: updatedBranches
    });

    setNewLeafText('');
    setShowLeafDialog(false);
    toast.success('Added a new leaf!');
  };

  // Handle leaf actions (star, release)
  const handleLeafAction = (branchId: string, leafId: string, action: 'star' | 'release') => {
    const updatedBranches = currentTree.branches.map(branch => {
      if (branch.id === branchId) {
        if (action === 'star') {
          // Toggle star status
          const updatedLeaves = branch.leaves.map(leaf => 
            leaf.id === leafId ? { ...leaf, starred: !leaf.starred } : leaf
          );
          return { ...branch, leaves: updatedLeaves };
        } else if (action === 'release') {
          // Remove the leaf
          const updatedLeaves = branch.leaves.filter(leaf => leaf.id !== leafId);
          return { ...branch, leaves: updatedLeaves };
        }
      }
      return branch;
    });

    setCurrentTree({
      ...currentTree,
      branches: updatedBranches
    });

    if (action === 'release') {
      toast.success('Leaf released. You let it go!');
    } else {
      toast.success('Leaf marked for growth!');
    }
  };

  // Submit reflection for a prompt
  const submitReflection = async () => {
    if (!reflectionText.trim()) {
      toast.error('Please enter your reflection');
      return;
    }

    // If the first prompt requires a branch selection
    if (promptIndex === 0 && !selectedBranchForReflection) {
      toast.error('Please select a branch');
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
            prompt: reflectionPrompts[promptIndex]
          });

        if (error) throw error;
        
        // Handle leaf release if we're on the wilted leaves prompt
        if (promptIndex === 1 && selectedLeafToRelease) {
          const branchWithLeaf = currentTree.branches.find(branch => 
            branch.leaves.some(leaf => leaf.id === selectedLeafToRelease.id)
          );
          
          if (branchWithLeaf) {
            handleLeafAction(branchWithLeaf.id, selectedLeafToRelease.id, 'release');
            
            // Update the tree in the database after releasing the leaf
            const updatedTreeData = prepareTreeDataForSupabase(currentTree);
            await supabase
              .from('confidence_trees')
              .update({
                branches: updatedTreeData.branches
              })
              .eq('id', treeToEdit.id);
          }
          
          setSelectedLeafToRelease(null);
        }
        
      } catch (error) {
        console.error('Error saving reflection:', error);
        toast.error('Failed to save your reflection');
      } finally {
        setSavingReflection(false);
      }
    }
    
    toast.success('Reflection saved!');
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

  // Edit an existing tree
  const editTree = (tree: TreeData) => {
    setCurrentTree({ ...tree });
    setTreeToEdit(tree);
    setEditMode(true);
    setActiveTab('builder');
  };

  // Start reflection mode for a previously saved tree
  const startReflectionForTree = (tree: TreeData) => {
    setCurrentTree({ ...tree });
    setTreeToEdit(tree);
    setShowReflectionMode(true);
    setActiveTab('builder');
  };

  // Prompt user for tree name before saving
  const openNameDialog = () => {
    setNameDialogOpen(true);
  };

  // Effect to handle post-save reflection prompt
  useEffect(() => {
    if (showPostSaveReflection) {
      const timer = setTimeout(() => {
        toast.info(
          <div>
            <p className="font-medium">Time to reflect on your tree!</p>
            <p className="text-sm">Your tree has enough branches and leaves to reflect on.</p>
            <div className="mt-3 flex justify-end gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowPostSaveReflection(false)}
              >
                Not now
              </Button>
              <Button 
                size="sm" 
                onClick={() => {
                  // Find the most recently created tree
                  if (trees.length > 0) {
                    startReflectionForTree(trees[0]);
                    setShowPostSaveReflection(false);
                  }
                }}
              >
                Reflect now
              </Button>
            </div>
          </div>,
          { duration: 10000 }
        );
        
        return () => clearTimeout(timer);
      }, 1000);
    }
  }, [showPostSaveReflection, trees]);

  // Effect to fetch trees when component mounts
  useEffect(() => {
    if (user) {
      fetchTrees();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Effect to hide welcome animation after a few seconds
  useEffect(() => {
    if (showWelcomeAnimation) {
      const timer = setTimeout(() => {
        setShowWelcomeAnimation(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [showWelcomeAnimation]);

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10 max-w-4xl">
          <Link to="/resources" className="inline-flex items-center text-gray-700 hover:text-primary mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resources Hub
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F5DF4D] to-[#3DFDFF] bg-clip-text text-transparent mb-4">
              Confidence Tree
            </h1>
            <p className="text-gray-800 text-lg max-w-2xl mx-auto">
              See how your confidence has grown — and where you want it to bloom next.
            </p>
          </motion.div>
          
          {/* Welcome Animation */}
          <AnimatePresence>
            {showWelcomeAnimation && (
              <motion.div 
                className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="bg-white p-8 rounded-xl max-w-md text-center relative overflow-hidden"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                >
                  <div className="h-40 mb-4 relative">
                    <motion.div
                      className="w-4 h-0 bg-[#8B4513] absolute left-1/2 bottom-0 transform -translate-x-1/2"
                      animate={{ height: 60 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                    <motion.div
                      className="w-16 h-16 rounded-full bg-[#2AC20E]/80 absolute left-1/2 top-20 transform -translate-x-1/2"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1, delay: 1.5 }}
                    />
                  </div>
                  
                  <motion.p
                    className="text-lg mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                  >
                    The people around us shape our confidence—sometimes helping it grow, sometimes holding it back. Let's see what's grown on your tree.
                  </motion.p>
                  
                  <motion.button
                    className="bg-gradient-to-r from-[#F5DF4D] to-[#3DFDFF] text-black px-6 py-2 rounded-full font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    onClick={() => setShowWelcomeAnimation(false)}
                  >
                    Let's Begin
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Tabs 
            defaultValue="builder" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger 
                value="builder"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F5DF4D] data-[state=active]:to-[#3DFDFF]"
              >
                Tree Builder
              </TabsTrigger>
              <TabsTrigger 
                value="garden"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FC68B3] data-[state=active]:to-[#FF8A48]"
              >
                My Growth Garden
              </TabsTrigger>
              <TabsTrigger 
                value="reflections"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3DFDFF] data-[state=active]:to-[#2AC20E]"
              >
                Past Reflections
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="builder" className="mt-0">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl">
                      {editMode ? 'Edit Your Tree' : showReflectionMode ? 'Reflect on Your Tree' : 'Build Your Tree'}
                    </CardTitle>
                    {!showReflectionMode && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={openNameDialog}
                        className="border-green-500 text-green-600 hover:bg-green-50 flex items-center gap-2"
                      >
                        <Save size={16} />
                        {editMode ? 'Update Tree' : 'Save Tree'}
                      </Button>
                    )}
                  </div>
                  <CardDescription>{currentTree.name}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {showReflectionMode ? (
                    <div>
                      <h3 className="text-xl font-medium mb-4">Reflection Time</h3>
                      <p className="mb-6">
                        Take a moment to reflect on your confidence tree and what it shows about your relationships.
                      </p>
                      
                      <div className="mb-8">
                        <TreeCanvas treeData={currentTree} interactiveMode="reflect" />
                      </div>
                      
                      <div className="flex gap-4 justify-center mt-8">
                        <Button
                          onClick={() => setShowPromptDialog(true)}
                          className="bg-gradient-to-r from-[#F5DF4D] to-[#3DFDFF] text-black"
                        >
                          Reflect on My Tree
                        </Button>
                        {editMode && (
                          <Button
                            onClick={openNameDialog}
                            variant="outline"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                          >
                            <Save size={16} className="mr-2" />
                            Update My Tree
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {!editMode && (
                        <div className="mb-6">
                          <VisibilityToggle
                            isVisible={isVisible}
                            onToggle={setIsVisible}
                            description="Share this tree with clinicians"
                          />
                        </div>
                      )}
                      
                      <div className="bg-[#F9F6EB] p-6 rounded-lg mb-8 border border-[#E6DFC6] relative overflow-hidden">
                        <motion.div
                          className="absolute -bottom-3 -right-3 w-20 h-20 opacity-10"
                          animate={{ 
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.05, 0.95, 1],
                          }}
                          transition={{ 
                            duration: 6,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                        >
                          <Leaf size={80} />
                        </motion.div>
                        
                        <h3 className="text-xl font-medium mb-4">Start with the Trunk</h3>
                        <p className="mb-6">
                          The trunk of your tree represents <strong>YOU</strong>. The branches will be people who have influenced your confidence.
                        </p>
                        
                        <div className="mb-8">
                          <TreeCanvas treeData={currentTree} interactiveMode="build" />
                        </div>

                        <div className="flex justify-center">
                          <Button
                            onClick={() => setShowBranchDialog(true)}
                            className="flex items-center gap-2 bg-[#8B4513] hover:bg-[#6d370f] text-white"
                            disabled={currentTree.branches.length >= 5}
                          >
                            <Plus size={18} />
                            Add a Branch
                          </Button>
                        </div>
                        
                        {currentTree.branches.length > 0 && (
                          <div className="mt-8">
                            <h3 className="text-xl font-medium mb-4">Add Leaves to Your Branches</h3>
                            <p className="mb-4">
                              Click on a branch to add leaves. Each leaf represents things they've said or done that affected your confidence.
                            </p>
                            
                            <div className="flex gap-4 justify-center mb-6">
                              <div className="flex items-center gap-1">
                                <span className="inline-block w-3 h-3 bg-[#2AC20E] rounded-full"></span>
                                <span className="text-sm">Positive 🍃</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="inline-block w-3 h-3 bg-[#8B4513] rounded-full"></span>
                                <span className="text-sm">Hurtful 🍂</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="inline-block w-3 h-3 bg-[#D2691E] rounded-full"></span>
                                <span className="text-sm">Mixed 🍁</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                              {currentTree.branches.map(branch => (
                                <Card key={branch.id} className="bg-white">
                                  <CardHeader className="py-3 px-4">
                                    <CardTitle className="text-base flex justify-between items-center">
                                      <span>{branch.name}</span>
                                      <span className="text-sm text-gray-500">{branch.leaves.length}/15 leaves</span>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-4">
                                    <ScrollArea className="h-44 pr-4">
                                      <div className="flex flex-wrap gap-2">
                                        {branch.leaves.map(leaf => (
                                          <div 
                                            key={leaf.id}
                                            className={`rounded-full px-3 py-1 text-xs text-white flex items-center mb-2
                                              ${leaf.type === 'positive' ? 'bg-green-500' : 
                                                leaf.type === 'negative' ? 'bg-amber-700' : 'bg-gradient-to-r from-green-500 to-amber-700'}`}
                                          >
                                            <span className="mr-1 truncate max-w-32" title={leaf.text}>
                                              {leaf.text.length > 30 ? `${leaf.text.substring(0, 30)}...` : leaf.text}
                                            </span>
                                            {leaf.starred && <Star size={10} className="ml-1" fill="white" />}
                                          </div>
                                        ))}
                                      </div>
                                    </ScrollArea>
                                    <Button
                                      onClick={() => {
                                        setSelectedBranch(branch);
                                        setShowLeafDialog(true);
                                      }}
                                      variant="ghost" 
                                      size="sm"
                                      className="w-full mt-3 text-green-600 border border-green-200 hover:bg-green-50"
                                      disabled={branch.leaves.length >= 15}
                                    >
                                      <Plus size={16} className="mr-1" />
                                      Add Leaf
                                    </Button>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="garden">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardHeader className="border-b">
                  <CardTitle className="text-2xl">My Growth Garden</CardTitle>
                  <CardDescription>View and manage your confidence trees</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {loading ? (
                    <div className="text-center py-12">Loading your trees...</div>
                  ) : trees.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-6">You haven't created any confidence trees yet.</p>
                      <Button
                        onClick={() => setActiveTab('builder')}
                        className="bg-gradient-to-r from-[#F5DF4D] to-[#3DFDFF] text-black"
                      >
                        Create Your First Tree
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {trees.map(tree => {
                        // Check if this tree qualifies for reflection mode
                        const canReflect = checkForReflectionMode(tree);
                        
                        return (
                          <Card key={tree.id} className="overflow-hidden border border-gray-200">
                            <div className="h-40 relative overflow-hidden bg-gradient-to-b from-[#F9F6EB] to-[#E6DFC6]">
                              <TreeCanvas treeData={tree} interactiveMode="view" simplified />
                              <div className="absolute top-2 right-2 flex gap-2">
                                <Button
                                  variant="outline" 
                                  size="icon" 
                                  className="bg-white rounded-full w-8 h-8 p-1 shadow-sm"
                                  onClick={() => toggleTreeSharing(tree)}
                                >
                                  {tree.is_shared ? (
                                    <Eye size={16} className="text-blue-500" />
                                  ) : (
                                    <EyeOff size={16} className="text-gray-500" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline" 
                                  size="icon" 
                                  className="bg-white rounded-full w-8 h-8 p-1 shadow-sm"
                                  onClick={() => editTree(tree)}
                                >
                                  <Edit size={16} className="text-amber-500" />
                                </Button>
                                <Button
                                  variant="outline" 
                                  size="icon" 
                                  className="bg-white rounded-full w-8 h-8 p-1 shadow-sm"
                                  onClick={() => {
                                    if (confirm("Are you sure you want to delete this tree?")) {
                                      deleteTree(tree.id!);
                                    }
                                  }}
                                >
                                  <Trash2 size={16} className="text-red-500" />
                                </Button>
                              </div>
                            </div>
                            <CardHeader className="py-3 px-4">
                              <CardTitle className="text-lg">{tree.name}</CardTitle>
                              <CardDescription className="text-sm">
                                Created on {new Date(tree.created_at!).toLocaleDateString()}
                                <span className="ml-2">
                                  {tree.is_shared ? (
                                    <span className="text-blue-500 text-xs bg-blue-50 px-2 py-0.5 rounded-full">Shared</span>
                                  ) : (
                                    <span className="text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded-full">Private</span>
                                  )}
                                </span>
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4">
                              <div className="flex flex-wrap gap-1 mb-4">
                                {tree.branches.map(branch => (
                                  <span 
                                    key={branch.id}
                                    className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full"
                                  >
                                    {branch.name}: {branch.leaves.length} {branch.leaves.length === 1 ? 'leaf' : 'leaves'}
                                  </span>
                                ))}
                              </div>
                              
                              {canReflect && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full mt-2 bg-gradient-to-r from-[#F5DF4D]/10 to-[#3DFDFF]/10 border-[#F5DF4D]"
                                  onClick={() => startReflectionForTree(tree)}
                                >
                                  <Leaf size={14} className="mr-2" />
                                  Reflect on this Tree
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reflections">
              <PastReflections />
            </TabsContent>
          </Tabs>
          
          {/* Branch Dialog */}
          <Dialog open={showBranchDialog} onOpenChange={setShowBranchDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a Branch</DialogTitle>
                <DialogDescription>
                  Add a branch for each family member or close influence (e.g. mom, dad, sibling, friend).
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="branch-name">Name or Relationship</Label>
                  <Input
                    id="branch-name"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="E.g. Mom, Dad, Sister, Best Friend"
                    className="col-span-3"
                    autoFocus
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBranchDialog(false)}>Cancel</Button>
                <Button 
                  onClick={addBranch}
                  className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white"
                >
                  Add Branch
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Leaf Dialog */}
          <Dialog open={showLeafDialog} onOpenChange={setShowLeafDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a Leaf to {selectedBranch?.name}</DialogTitle>
                <DialogDescription>
                  What's one thing they've said/done that affected your confidence?
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="leaf-text">Memory or Influence</Label>
                  <Textarea
                    id="leaf-text"
                    value={newLeafText}
                    onChange={(e) => setNewLeafText(e.target.value)}
                    placeholder="E.g. Believed in me when I was struggling"
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>How did this make you feel?</Label>
                  <RadioGroup 
                    defaultValue="positive" 
                    value={newLeafType}
                    onValueChange={(value) => setNewLeafType(value as 'positive' | 'negative' | 'mixed')}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="positive" id="positive" className="border-green-500" />
                      <Label htmlFor="positive" className="flex items-center">
                        <span className="inline-block w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                        Positive 🍃
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="negative" id="negative" className="border-amber-700" />
                      <Label htmlFor="negative" className="flex items-center">
                        <span className="inline-block w-4 h-4 bg-amber-700 rounded-full mr-2"></span>
                        Hurtful 🍂
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mixed" id="mixed" className="border-orange-400" />
                      <Label htmlFor="mixed" className="flex items-center">
                        <span className="inline-block w-4 h-4 bg-[#D2691E] rounded-full mr-2"></span>
                        Mixed 🍁
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowLeafDialog(false)}>Cancel</Button>
                <Button 
                  onClick={addLeaf}
                  className={`text-white ${
                    newLeafType === 'positive' ? 'bg-green-500 hover:bg-green-600' : 
                    newLeafType === 'negative' ? 'bg-amber-700 hover:bg-amber-800' : 
                    'bg-[#D2691E] hover:bg-[#A0522D]'
                  }`}
                >
                  Add Leaf
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Reflection Dialog */}
          <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Reflection</DialogTitle>
                <DialogDescription className="text-base mt-2">
                  {reflectionPrompts[promptIndex]}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {promptIndex === 0 && (
                  <div className="mb-4">
                    <Label className="block mb-2 text-sm">Select a branch:</Label>
                    <div className="space-y-2 mb-4">
                      {currentTree.branches.map(branch => (
                        <div key={branch.id} className="flex items-center">
                          <input
                            type="radio"
                            id={`branch-${branch.id}`}
                            name="branch-selection"
                            value={branch.id}
                            checked={selectedBranchForReflection === branch.id}
                            onChange={() => setSelectedBranchForReflection(branch.id)}
                            className="mr-2"
                          />
                          <label htmlFor={`branch-${branch.id}`} className="flex-1">
                            <div className="flex justify-between items-center">
                              <span>{branch.name}</span>
                              <span className="text-xs text-gray-500">
                                {branch.leaves.length} {branch.leaves.length === 1 ? 'leaf' : 'leaves'}
                              </span>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="Write your thoughts here..."
                  rows={4}
                  className="w-full mb-4"
                />
                
                {promptIndex === 1 && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Select any brown leaves you want to let go of:</p>
                    <ScrollArea className="h-32 pr-4">
                      <div className="flex flex-wrap gap-2">
                        {currentTree.branches.map(branch => 
                          branch.leaves
                            .filter(leaf => leaf.type === 'negative')
                            .map(leaf => (
                              <Button 
                                key={leaf.id} 
                                variant="outline"
                                size="sm"
                                className={`text-xs border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 mb-2 flex items-center gap-1
                                  ${selectedLeafToRelease?.id === leaf.id ? 'ring-2 ring-amber-500' : ''}`}
                                onClick={() => setSelectedLeafToRelease(
                                  selectedLeafToRelease?.id === leaf.id ? null : leaf
                                )}
                              >
                                <span className="inline-block w-3 h-3 bg-amber-700 rounded-full mr-1"></span>
                                {leaf.text.length > 15 ? `${leaf.text.substring(0, 15)}...` : leaf.text}
                                {selectedLeafToRelease?.id === leaf.id && (
                                  <X size={12} className="ml-1" />
                                )}
                              </Button>
                            ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}
                
                {promptIndex === 2 && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Select leaves you want to grow more of:</p>
                    <ScrollArea className="h-32 pr-4">
                      <div className="flex flex-wrap gap-2">
                        {currentTree.branches.map(branch => 
                          branch.leaves
                            .filter(leaf => leaf.type === 'positive')
                            .map(leaf => (
                              <Button 
                                key={leaf.id} 
                                variant="outline"
                                size="sm"
                                className={`text-xs border border-green-200 bg-green-50 hover:bg-green-100 text-green-800 mb-2 flex items-center gap-1
                                  ${leaf.starred ? 'ring-2 ring-green-500' : ''}`}
                                onClick={() => {
                                  // Mark leaf for growth (star it)
                                  handleLeafAction(branch.id, leaf.id, 'star')
                                }}
                              >
                                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                                {leaf.text.length > 15 ? `${leaf.text.substring(0, 15)}...` : leaf.text}
                                {leaf.starred && (
                                  <Star size={12} className="ml-1 fill-green-500" />
                                )}
                              </Button>
                            ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (promptIndex > 0) {
                      setPromptIndex(promptIndex - 1);
                      setReflectionText('');
                    } else {
                      setShowPromptDialog(false);
                    }
                  }}
                >
                  {promptIndex > 0 ? 'Previous' : 'Cancel'}
                </Button>
                <Button 
                  onClick={submitReflection}
                  disabled={savingReflection}
                  className={`${promptIndex < reflectionPrompts.length - 1 
                    ? 'bg-gradient-to-r from-[#F5DF4D] to-[#3DFDFF] text-black' 
                    : 'bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-black'}`}
                >
                  {savingReflection ? 'Saving...' : promptIndex < reflectionPrompts.length - 1 ? 'Next' : 'Finish Reflection'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Tree Name Dialog */}
          <Dialog open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Name Your Tree</DialogTitle>
                <DialogDescription>
                  Give your confidence tree a meaningful name before saving.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  value={currentTree.name}
                  onChange={(e) => setCurrentTree({...currentTree, name: e.target.value})}
                  placeholder="My Confidence Tree"
                  className="w-full"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNameDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={() => {
                    setNameDialogOpen(false);
                    saveTree();
                  }}
                  disabled={saving}
                  className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white"
                >
                  {saving ? 'Saving...' : 'Save Tree'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Feedback Dialog */}
          <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>How was this activity?</DialogTitle>
                <DialogDescription>
                  Your feedback helps us improve the experience for everyone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3 py-4">
                <Button
                  onClick={() => handleFeedback('positive')}
                  disabled={isSubmitting}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  😊 Great! I enjoyed it
                </Button>
                <Button
                  onClick={() => handleFeedback('neutral')}
                  disabled={isSubmitting}
                  variant="outline"
                >
                  😐 It was okay
                </Button>
                <Button
                  onClick={() => handleFeedback('negative')}
                  disabled={isSubmitting}
                  variant="outline"
                >
                  😞 I didn't like it
                </Button>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setShowFeedback(false)}>
                  Skip
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default ConfidenceTreeActivity;
