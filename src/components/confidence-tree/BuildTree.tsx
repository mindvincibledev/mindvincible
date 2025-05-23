
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Save } from 'lucide-react';
import TreeCanvas from './TreeCanvas';
import { TreeData, Branch, Leaf, createNewBranch, createNewLeaf, hasReachedMaxLeaves } from '@/types/confidenceTree';
import { toast } from '@/components/ui/use-toast';

type BuildTreeProps = {
  treeData: TreeData;
  onTreeChange: (updatedTree: TreeData) => void;
  onSave: () => void;
  loading: boolean;
};

const BuildTree = ({ treeData, onTreeChange, onSave, loading }: BuildTreeProps) => {
  const [showBranchDialog, setShowBranchDialog] = useState(false);
  const [showLeafDialog, setShowLeafDialog] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newLeafText, setNewLeafText] = useState('');
  const [newLeafType, setNewLeafType] = useState<'positive' | 'negative' | 'mixed'>('positive');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const handleAddBranch = () => {
    if (!newBranchName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a branch name',
        variant: 'destructive'
      });
      return;
    }
    
    const updatedTree = { ...treeData };
    const newBranch = createNewBranch(newBranchName);
    updatedTree.branches = [...updatedTree.branches, newBranch];
    
    onTreeChange(updatedTree);
    setNewBranchName('');
    setShowBranchDialog(false);
    
    toast({ title: 'Success', description: 'Branch added successfully' });
  };

  const handleAddLeaf = () => {
    if (!newLeafText.trim() || !selectedBranch) {
      toast({
        title: 'Error',
        description: 'Please enter leaf text and select a branch',
        variant: 'destructive'
      });
      return;
    }
    
    const updatedTree = { ...treeData };
    const branchIndex = updatedTree.branches.findIndex(b => b.id === selectedBranch.id);
    
    if (branchIndex !== -1) {
      // Check if branch has reached max leaves
      if (hasReachedMaxLeaves(updatedTree.branches[branchIndex])) {
        toast({
          title: 'Branch Full',
          description: 'This branch has reached its maximum number of leaves',
          variant: 'destructive'
        });
        return;
      }
      
      const newLeaf = createNewLeaf(newLeafText, newLeafType);
      updatedTree.branches[branchIndex].leaves.push(newLeaf);
      onTreeChange(updatedTree);
      
      setNewLeafText('');
      setShowLeafDialog(false);
      toast({ title: 'Success', description: 'Leaf added successfully' });
    }
  };

  const handleBranchClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowLeafDialog(true);
  };

  const handleSaveTree = () => {
    if (!treeData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for your tree',
        variant: 'destructive'
      });
      return;
    }
    
    if (treeData.branches.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one branch to your tree',
        variant: 'destructive'
      });
      return;
    }
    
    onSave();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#FF8A48]">Build Your Tree</h2>
          <p className="text-gray-600">Add branches (life areas) and leaves (influences) to create your confidence tree</p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowBranchDialog(true)}
            className="bg-[#F5DF4D] hover:bg-[#F5DF4D]/80 text-black"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Branch
          </Button>
          
          <Button 
            onClick={handleSaveTree} 
            className="bg-[#2AC20E] hover:bg-[#2AC20E]/80 text-white"
            disabled={loading}
          >
            <Save className="mr-2 h-4 w-4" /> Save Tree
          </Button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col items-center">
          <div className="text-center mb-4">
            <h3 className="font-medium text-gray-700">Tree Name:</h3>
            <Input 
              value={treeData.name} 
              onChange={(e) => onTreeChange({ ...treeData, name: e.target.value })}
              className="max-w-xs mx-auto mt-1"
            />
          </div>
          
          <div className="w-full h-[400px] bg-[#D5D5F1]/10 rounded-lg overflow-hidden">
            <TreeCanvas 
              treeData={treeData} 
              interactiveMode="build"
              onBranchClick={handleBranchClick}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-[#F5DF4D]/10 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">How to Build Your Tree:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Start by adding <strong>branches</strong> that represent different areas of your life (e.g., family, school, hobbies)</li>
          <li>Then add <strong>leaves</strong> to each branch that represent influences on your confidence</li>
          <li>🍃 <strong>Green leaves</strong> - Positive influences that boost your confidence</li>
          <li>🍂 <strong>Brown leaves</strong> - Hurtful or damaging influences</li>
          <li>🍁 <strong>Amber leaves</strong> - Mixed feelings or influences</li>
        </ul>
      </div>
      
      {/* Add Branch Dialog */}
      <Dialog open={showBranchDialog} onOpenChange={setShowBranchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Branch</DialogTitle>
            <DialogDescription>
              Branches represent different areas of your life. What area would you like to add?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="branchName">Branch Name</Label>
              <Input
                id="branchName"
                placeholder="e.g., Family, School, Sports"
                value={newBranchName}
                onChange={(e) => setNewBranchName(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBranchDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBranch}>
              Add Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Leaf Dialog */}
      <Dialog open={showLeafDialog} onOpenChange={setShowLeafDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Leaf</DialogTitle>
            <DialogDescription>
              Leaves represent influences on your confidence. How does this influence make you feel?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select 
                value={selectedBranch?.id || ''} 
                onValueChange={(value) => {
                  const branch = treeData.branches.find(b => b.id === value);
                  if (branch) setSelectedBranch(branch);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {treeData.branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leafText">Influence Description</Label>
              <Textarea
                id="leafText"
                placeholder="Describe this influence on your confidence..."
                value={newLeafText}
                onChange={(e) => setNewLeafText(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leafType">How does this influence make you feel?</Label>
              <Select value={newLeafType} onValueChange={(value: 'positive' | 'negative' | 'mixed') => setNewLeafType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">🍃 Positive - Boosts my confidence</SelectItem>
                  <SelectItem value="negative">🍂 Negative - Hurts my confidence</SelectItem>
                  <SelectItem value="mixed">🍁 Mixed - Both positive and negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLeafDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLeaf}>
              Add Leaf
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuildTree;
