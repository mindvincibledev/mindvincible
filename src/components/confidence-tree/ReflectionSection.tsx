
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import TreeCanvas from './TreeCanvas';
import { Branch, Leaf, TreeData } from '@/types/confidenceTree';

type ReflectionSectionProps = {
  treeData: TreeData;
  treeId: string;
  onShowPrompt: () => void;
  showPromptDialog: boolean;
  setShowPromptDialog: (show: boolean) => void;
  reflectionPrompts: string[];
  promptIndex: number;
  reflectionText: string;
  setReflectionText: (text: string) => void;
  submitReflection: () => void;
  savingReflection: boolean;
  selectedBranchForReflection: string;
  setSelectedBranchForReflection: (branchId: string) => void;
  selectedLeafToRelease: { id: string; text: string; } | null;
  setSelectedLeafToRelease: (leaf: { id: string; text: string; } | null) => void;
};

const ReflectionSection = ({
  treeData,
  treeId,
  onShowPrompt,
  showPromptDialog,
  setShowPromptDialog,
  reflectionPrompts,
  promptIndex,
  reflectionText,
  setReflectionText,
  submitReflection,
  savingReflection,
  selectedBranchForReflection,
  setSelectedBranchForReflection,
  selectedLeafToRelease,
  setSelectedLeafToRelease
}: ReflectionSectionProps) => {
  
  // Get all negative leaves from the tree
  const getNegativeLeaves = () => {
    const negativeLeaves: { id: string; text: string; branchName: string }[] = [];
    
    treeData.branches.forEach(branch => {
      branch.leaves
        .filter(leaf => leaf.type === 'negative')
        .forEach(leaf => {
          negativeLeaves.push({
            id: leaf.id,
            text: leaf.text,
            branchName: branch.name
          });
        });
    });
    
    return negativeLeaves;
  };

  // Get all leaves from the tree grouped by type for the "grow more" section
  const getLeavesByType = () => {
    const leaves: { id: string; text: string; type: string; branchName: string }[] = [];
    
    treeData.branches.forEach(branch => {
      branch.leaves.forEach(leaf => {
        leaves.push({
          id: leaf.id,
          text: leaf.text,
          type: leaf.type,
          branchName: branch.name
        });
      });
    });
    
    return leaves;
  };
  
  const renderPromptContent = () => {
    switch (promptIndex) {
      case 0: // "Which branch is the strongest?"
        return (
          <>
            <DialogDescription className="mb-4">
              Look at your confidence tree. Which area of your life provides you with the most strength?
            </DialogDescription>
            
            <div className="mb-4">
              <Select 
                value={selectedBranchForReflection} 
                onValueChange={setSelectedBranchForReflection}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {treeData.branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <Textarea
              value={reflectionText}
              onChange={e => setReflectionText(e.target.value)}
              placeholder="Why do you consider this branch your strongest? What makes it special to you?"
              className="min-h-[150px]"
            />
          </>
        );
        
      case 1: // "Which wilted leaves would you like to release?"
        return (
          <>
            <DialogDescription className="mb-4">
              Sometimes we need to let go of negative influences to make room for growth. 
              Which negative factor would you like to release from your tree?
            </DialogDescription>
            
            <div className="mb-4">
              <RadioGroup 
                value={selectedLeafToRelease?.id || ''} 
                onValueChange={(value) => {
                  const leaf = getNegativeLeaves().find(l => l.id === value);
                  if (leaf) {
                    setSelectedLeafToRelease({ id: leaf.id, text: leaf.text });
                  }
                }}
              >
                {getNegativeLeaves().length > 0 ? (
                  getNegativeLeaves().map(leaf => (
                    <div key={leaf.id} className="flex items-start space-x-2 mb-2">
                      <RadioGroupItem value={leaf.id} id={leaf.id} className="mt-1" />
                      <div>
                        <Label htmlFor={leaf.id} className="font-medium text-gray-800">
                          {leaf.text}
                        </Label>
                        <p className="text-sm text-gray-500">From: {leaf.branchName}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-md">
                    No negative leaves to release.
                  </div>
                )}
              </RadioGroup>
            </div>
            
            <Textarea
              value={reflectionText}
              onChange={e => setReflectionText(e.target.value)}
              placeholder="Why would you like to release this influence? How might releasing it help you grow?"
              className="min-h-[100px]"
            />
          </>
        );
        
      case 2: // "Which leaves would you like to see grow more?"
        return (
          <>
            <DialogDescription className="mb-4">
              Looking forward, which aspects of your confidence would you like to nurture and see grow?
            </DialogDescription>
            
            <div className="grid gap-4 mb-4">
              {['positive', 'mixed', 'negative'].map(type => (
                <div key={type} className="space-y-2">
                  <h4 className="font-medium capitalize">
                    {type === 'positive' 
                      ? '🍃 Positive influences' 
                      : type === 'negative' 
                        ? '🍂 Hurtful/damaging influences' 
                        : '🍁 Mixed feelings'}
                  </h4>
                  
                  <div className="bg-gray-50 p-3 rounded-md max-h-[150px] overflow-y-auto">
                    {getLeavesByType()
                      .filter(leaf => leaf.type === type)
                      .map(leaf => (
                        <div key={leaf.id} className="text-sm mb-2 p-2 bg-white rounded shadow-sm">
                          <p className="font-medium">{leaf.text}</p>
                          <p className="text-xs text-gray-500">Branch: {leaf.branchName}</p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
            
            <Textarea
              value={reflectionText}
              onChange={e => setReflectionText(e.target.value)}
              placeholder="Which leaves would you like to grow stronger, and how might you nurture them?"
              className="min-h-[100px]"
            />
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-b from-[#D5D5F1]/30 to-transparent p-6 rounded-lg">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#FF8A48] mb-4">Reflect on Your Confidence Tree</h2>
          <p className="mb-6">
            Your tree represents different areas of your confidence. Take some time to look at
            the balance of positive and negative influences and reflect on what you can learn.
          </p>
          
          <div className="h-[300px] bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            {treeData && <TreeCanvas treeData={treeData} interactiveMode="view" />}
          </div>
          
          <Button 
            className="w-full sm:w-auto bg-[#3DFDFF] hover:bg-[#3DFDFF]/80 text-black"
            onClick={onShowPrompt}
          >
            Start Reflection Journal
          </Button>
        </div>
      </div>
      
      {/* Reflection Dialog */}
      <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#FF8A48]">
              {reflectionPrompts[promptIndex]}
            </DialogTitle>
          </DialogHeader>
          
          {renderPromptContent()}
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowPromptDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-[#FF8A48] hover:bg-[#FF8A48]/80"
              disabled={savingReflection}
              onClick={submitReflection}
            >
              {savingReflection ? 'Saving...' : 'Save Reflection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReflectionSection;
