
/**
 * Data types and interfaces for the Confidence Tree activity
 */

export interface Branch {
  id: string;
  name: string;
  leaves: Leaf[];
}

export interface Leaf {
  id: string;
  text: string;
  type: 'positive' | 'negative' | 'mixed';
  starred: boolean;
}

export interface TreeData {
  id?: string;
  name: string;
  branches: Branch[];
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TreeStats {
  totalBranches: number;
  totalLeaves: number;
  positiveLeaves: number;
  negativeLeaves: number;
  mixedLeaves: number;
  starredLeaves: number;
}

export interface ConfidenceTreeReflection {
  id?: string;
  tree_id?: string;
  user_id?: string;
  reflection_text?: string;
  prompt?: string;
  created_at?: string;
  is_visible_to_clinicians?: boolean;
  confidence_trees?: Partial<TreeData>; // Updated to Partial<TreeData> to allow for partial tree data
}

// Helper function to parse tree data from Supabase
export const parseTreeDataFromSupabase = (data: any): TreeData => {
  return {
    id: data.id,
    name: data.name,
    branches: data.branches,
    user_id: data.user_id,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

// Helper function to prepare tree data for Supabase
export const prepareTreeDataForSupabase = (tree: TreeData): any => {
  return {
    name: tree.name,
    branches: tree.branches
  };
};

// Generate a unique ID for branches and leaves
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
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

// Check if a branch has reached the maximum number of leaves
export const hasReachedMaxLeaves = (branch: Branch, maxLeaves: number = 15): boolean => {
  return branch.leaves.length >= maxLeaves;
};
