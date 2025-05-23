
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
