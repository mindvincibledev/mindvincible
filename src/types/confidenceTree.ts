
/**
 * Types for the Confidence Tree activity
 */

export interface TreeData {
  id?: string;
  user_id?: string;
  name: string;
  branches: Branch[];
  created_at?: string;
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
