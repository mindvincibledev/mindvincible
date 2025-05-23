/**
 * Types for the Confidence Tree activity
 */

import { Json } from '@/integrations/supabase/types';

export interface TreeData {
  id?: string;
  user_id?: string;
  name: string;
  branches: Branch[];
  created_at?: string;
  updated_at?: string;
  is_shared?: boolean;
}

export interface Branch {
  id: string;
  name: string;
  leaves: Leaf[];
}

export interface Leaf {
  id: string;
  text: string;
  type: 'positive' | 'negative' | 'mixed';
  starred?: boolean;
}

export interface ConfidenceTreeReflection {
  id?: string;
  tree_id: string;
  user_id: string;
  reflection_text: string;
  prompt: string;
  created_at?: string;
  is_visible_to_clinicians?: boolean;
  confidence_trees?: {
    name: string;
  };
}

export interface TreeStats {
  totalBranches: number;
  totalLeaves: number;
  positiveLeaves: number;
  negativeLeaves: number;
  mixedLeaves: number;
  starredLeaves: number;
}

// Type conversion utilities for Supabase data
export const parseTreeDataFromSupabase = (supabaseData: any): TreeData => {
  return {
    ...supabaseData,
    branches: Array.isArray(supabaseData.branches) 
      ? supabaseData.branches 
      : typeof supabaseData.branches === 'string'
        ? JSON.parse(supabaseData.branches)
        : []
  };
};

export const prepareTreeDataForSupabase = (treeData: TreeData): any => {
  return {
    ...treeData,
    branches: treeData.branches
  };
};

// Generate a unique ID for branches and leaves
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
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

// Check if a branch has reached the maximum number of leaves
export const hasReachedMaxLeaves = (branch: Branch, maxLeaves: number = 15): boolean => {
  return branch.leaves.length >= maxLeaves;
};
