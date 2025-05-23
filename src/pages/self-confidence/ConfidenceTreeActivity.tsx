
// Function updated to include visibility field
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
          prompt: reflectionPrompts[promptIndex],
          is_visible_to_clinicians: true // Default to visible
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
