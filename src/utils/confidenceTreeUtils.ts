
/**
 * Utility functions for the Confidence Tree activity
 */

import { Branch, Leaf, TreeData, TreeStats } from '@/types/confidenceTree';

// Generate a unique ID for branches and leaves
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Calculate statistics for a tree
export const calculateTreeStats = (tree: TreeData): TreeStats => {
  if (!tree || !tree.branches) {
    return {
      totalBranches: 0,
      totalLeaves: 0,
      positiveLeaves: 0,
      negativeLeaves: 0,
      mixedLeaves: 0,
      starredLeaves: 0
    };
  }

  let totalLeaves = 0;
  let positiveLeaves = 0;
  let negativeLeaves = 0;
  let mixedLeaves = 0;
  let starredLeaves = 0;

  tree.branches.forEach(branch => {
    totalLeaves += branch.leaves.length;
    
    branch.leaves.forEach(leaf => {
      if (leaf.type === 'positive') positiveLeaves++;
      if (leaf.type === 'negative') negativeLeaves++;
      if (leaf.type === 'mixed') mixedLeaves++;
      if (leaf.starred) starredLeaves++;
    });
  });

  return {
    totalBranches: tree.branches.length,
    totalLeaves,
    positiveLeaves,
    negativeLeaves,
    mixedLeaves,
    starredLeaves
  };
};

// Create a new empty tree
export const createNewTree = (name: string = "My Confidence Tree"): TreeData => {
  return {
    name,
    branches: []
  };
};

// Create a new branch
export const createNewBranch = (name: string): Branch => {
  return {
    id: generateId('branch'),
    name,
    leaves: []
  };
};

// Create a new leaf
export const createNewLeaf = (text: string, type: 'positive' | 'negative' | 'mixed'): Leaf => {
  return {
    id: generateId('leaf'),
    text,
    type,
    starred: false
  };
};

// Check if a tree should enter reflection mode
export const shouldEnterReflectionMode = (tree: TreeData): boolean => {
  if (!tree || !tree.branches) return false;
  
  const hasBranches = tree.branches.length >= 3;
  const hasLeavesOnEachBranch = tree.branches.every(branch => branch.leaves.length > 0);
  
  return hasBranches && hasLeavesOnEachBranch;
};

// Get suggestions for reflection based on tree data
export const getReflectionSuggestions = (tree: TreeData) => {
  const stats = calculateTreeStats(tree);
  const suggestions = [];
  
  if (stats.positiveLeaves > stats.negativeLeaves) {
    suggestions.push("You have more positive influences than negative ones. How does this support your confidence?");
  } else if (stats.negativeLeaves > stats.positiveLeaves) {
    suggestions.push("You have more negative influences than positive ones. How might you balance this?");
  }
  
  if (stats.mixedLeaves > 0) {
    suggestions.push("You have some mixed feelings about certain influences. What are some ways to focus on the positive aspects?");
  }
  
  if (stats.starredLeaves === 0) {
    suggestions.push("Consider starring leaves that represent areas you want to grow.");
  }
  
  // Add branch-specific suggestions if we have enough branches
  if (tree.branches.length >= 3) {
    suggestions.push("Look at your different branches. Which area provides you with the most confidence?");
    suggestions.push("Which branch would you like to add more positive leaves to in the future?");
  }
  
  // Limit to 3 random suggestions
  if (suggestions.length > 3) {
    const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }
  
  return suggestions;
};

// Export tree data as a simple text format
export const exportTreeAsText = (tree: TreeData): string => {
  if (!tree || !tree.branches) return '';
  
  let output = `# ${tree.name}\n\n`;
  
  tree.branches.forEach(branch => {
    output += `## ${branch.name}\n`;
    
    branch.leaves.forEach(leaf => {
      const leafSymbol = leaf.type === 'positive' ? '🍃' : leaf.type === 'negative' ? '🍂' : '🍁';
      const starSymbol = leaf.starred ? ' ⭐' : '';
      output += `- ${leafSymbol} ${leaf.text}${starSymbol}\n`;
    });
    
    output += '\n';
  });
  
  return output;
};

// Check if a branch has reached the maximum number of leaves
export const hasReachedMaxLeaves = (branch: Branch, maxLeaves: number = 15): boolean => {
  return branch.leaves.length >= maxLeaves;
};
