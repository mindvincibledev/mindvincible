
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import EmojiSlider from '@/components/ui/EmojiSlider';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

interface ReflectionData {
  changeA: string;
  feelA: string;
  changeB: string;
  feelB: string;
  challengesA: string;
  challengesB: string;
  strengthsA: string[];
  strengthsB: string[];
  valuesA: string;
  valuesB: string;
  tagA: string[];
  tagB: string[];
  gainA: string;
  gainB: string;
  futureA: string;
  futureB: string;
}

interface ReflectionScreenProps {
  onNext: (data: ReflectionData) => void;
  initialValues: Partial<ReflectionData> & {
    considerationPath: string;
    otherPath: string;
  };
}

// Strength options
const strengthOptions = [
  { id: "resilience", label: "Resilience" },
  { id: "support-system", label: "Support system" },
  { id: "focus", label: "Focus" },
  { id: "adaptability", label: "Adaptability" },
  { id: "creativity", label: "Creativity" },
  { id: "patience", label: "Patience" },
  { id: "confidence", label: "Confidence" },
  { id: "knowledge", label: "Knowledge" },
  { id: "experience", label: "Experience" },
];

// Tag options
const tagOptions = [
  { id: "creative", label: "Creative" },
  { id: "courageous", label: "Courageous" },
  { id: "balanced", label: "Balanced" },
  { id: "growth", label: "Growth" },
  { id: "authentic", label: "Authentic" },
  { id: "safe", label: "Safe" },
  { id: "practical", label: "Practical" },
  { id: "challenging", label: "Challenging" },
  { id: "fulfilling", label: "Fulfilling" },
  { id: "meaningful", label: "Meaningful" },
];

const ReflectionScreen: React.FC<ReflectionScreenProps> = ({ onNext, initialValues }) => {
  const [activeTab, setActiveTab] = useState<string>("daily-impact");
  const [activeRoad, setActiveRoad] = useState<"A" | "B">("A");
  
  const [formData, setFormData] = useState<ReflectionData>({
    changeA: initialValues.changeA || "",
    feelA: initialValues.feelA || "5", // Default to middle of the slider
    changeB: initialValues.changeB || "",
    feelB: initialValues.feelB || "5", // Default to middle of the slider
    challengesA: initialValues.challengesA || "",
    challengesB: initialValues.challengesB || "",
    strengthsA: initialValues.strengthsA || [],
    strengthsB: initialValues.strengthsB || [],
    valuesA: initialValues.valuesA || "",
    valuesB: initialValues.valuesB || "",
    tagA: initialValues.tagA || [],
    tagB: initialValues.tagB || [],
    gainA: initialValues.gainA || "",
    gainB: initialValues.gainB || "",
    futureA: initialValues.futureA || "",
    futureB: initialValues.futureB || "",
  });
  
  // Helper function to update form data
  const updateFormData = (field: keyof ReflectionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper function to handle checkbox changes for strengths
  const handleStrengthChange = (road: "A" | "B", id: string, checked: boolean) => {
    const field = road === "A" ? "strengthsA" : "strengthsB";
    if (checked) {
      updateFormData(field, [...formData[field], id]);
    } else {
      updateFormData(field, formData[field].filter(item => item !== id));
    }
  };

  // Helper function to handle tag selection
  const handleTagToggle = (road: "A" | "B", tag: string) => {
    const field = road === "A" ? "tagA" : "tagB";
    const currentTags = formData[field];
    
    if (currentTags.includes(tag)) {
      updateFormData(field, currentTags.filter(t => t !== tag));
    } else {
      updateFormData(field, [...currentTags, tag]);
    }
  };

  // Navigation between tabs
  const nextTab = () => {
    switch (activeTab) {
      case "daily-impact":
        setActiveTab("obstacles");
        break;
      case "obstacles":
        setActiveTab("alignment");
        break;
      case "alignment":
        setActiveTab("future");
        break;
      case "future":
        onNext(formData);
        break;
    }
  };

  const prevTab = () => {
    switch (activeTab) {
      case "obstacles":
        setActiveTab("daily-impact");
        break;
      case "alignment":
        setActiveTab("obstacles");
        break;
      case "future":
        setActiveTab("alignment");
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center mb-3">
          Reflect on Your Paths
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Let's explore each option to help you gain clarity.
        </p>

        <div className="grid grid-cols-2 gap-2 mb-6">
          <Button
            variant={activeRoad === "A" ? "default" : "outline"}
            onClick={() => setActiveRoad("A")}
            className={`rounded-full ${activeRoad === "A" ? "bg-gradient-to-r from-[#D5D5F1] to-[#3DFDFF]" : ""}`}
          >
            {activeRoad === "A" && <Check className="mr-1 h-4 w-4" />}
            Road A: {initialValues.considerationPath}
          </Button>
          <Button
            variant={activeRoad === "B" ? "default" : "outline"}
            onClick={() => setActiveRoad("B")}
            className={`rounded-full ${activeRoad === "B" ? "bg-gradient-to-r from-[#3DFDFF] to-[#F5DF4D]" : ""}`}
          >
            {activeRoad === "B" && <Check className="mr-1 h-4 w-4" />}
            Road B: {initialValues.otherPath}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="daily-impact" className="text-xs md:text-sm">
              <span className="mr-1">💡</span> Daily Impact
            </TabsTrigger>
            <TabsTrigger value="obstacles" className="text-xs md:text-sm">
              <span className="mr-1">🧱</span> Obstacles
            </TabsTrigger>
            <TabsTrigger value="alignment" className="text-xs md:text-sm">
              <span className="mr-1">🧭</span> Alignment
            </TabsTrigger>
            <TabsTrigger value="future" className="text-xs md:text-sm">
              <span className="mr-1">🔮</span> Future You
            </TabsTrigger>
          </TabsList>

          {/* Daily Life Impact */}
          <TabsContent value="daily-impact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2 text-2xl">💡</span> 
                  Daily Life Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label>
                      What will change in your daily life if you take 
                      {activeRoad === "A" 
                        ? ` ${initialValues.considerationPath}`
                        : ` ${initialValues.otherPath}`}?
                    </Label>
                    <Textarea
                      className="mt-2"
                      placeholder="Think about your routine, time commitments, social circle..."
                      value={activeRoad === "A" ? formData.changeA : formData.changeB}
                      onChange={(e) => updateFormData(
                        activeRoad === "A" ? "changeA" : "changeB", 
                        e.target.value
                      )}
                    />
                  </div>
                  
                  <div>
                    <Label>How might you feel about these changes?</Label>
                    <div className="mt-4">
                      <EmojiSlider
                        value={[parseInt(activeRoad === "A" ? formData.feelA : formData.feelB)]}
                        onValueChange={(value) => updateFormData(
                          activeRoad === "A" ? "feelA" : "feelB", 
                          value[0].toString()
                        )}
                        minEmoji="😬"
                        middleEmoji="😊"
                        maxEmoji="🔥"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Obstacles + Strengths */}
          <TabsContent value="obstacles">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2 text-2xl">🧱</span> 
                  Obstacles + Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label>
                      What challenges might pop up on 
                      {activeRoad === "A" 
                        ? ` ${initialValues.considerationPath}`
                        : ` ${initialValues.otherPath}`}?
                    </Label>
                    <Textarea
                      className="mt-2"
                      placeholder="Consider possible difficulties or obstacles..."
                      value={activeRoad === "A" ? formData.challengesA : formData.challengesB}
                      onChange={(e) => updateFormData(
                        activeRoad === "A" ? "challengesA" : "challengesB", 
                        e.target.value
                      )}
                    />
                  </div>
                  
                  <div>
                    <Label className="block mb-2">What strengths or resources could help you handle them?</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {strengthOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`${activeRoad}-${option.id}`}
                            checked={activeRoad === "A" 
                              ? formData.strengthsA.includes(option.id)
                              : formData.strengthsB.includes(option.id)
                            }
                            onCheckedChange={(checked) => handleStrengthChange(
                              activeRoad, 
                              option.id, 
                              checked === true
                            )}
                          />
                          <label
                            htmlFor={`${activeRoad}-${option.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alignment with Me */}
          <TabsContent value="alignment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2 text-2xl">🧭</span> 
                  Alignment with Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label className="block mb-2">
                      Which of these values does this path match? (Select all that apply)
                    </Label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tagOptions.map((tag) => {
                        const isSelected = activeRoad === "A" 
                          ? formData.tagA.includes(tag.id)
                          : formData.tagB.includes(tag.id);
                        return (
                          <Badge 
                            key={tag.id}
                            variant={isSelected ? "default" : "outline"}
                            className={`cursor-pointer ${isSelected 
                              ? "bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E]" 
                              : "hover:border-[#3DFDFF]"}`}
                            onClick={() => handleTagToggle(activeRoad, tag.id)}
                          >
                            {tag.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <Label>
                      How does 
                      {activeRoad === "A" 
                        ? ` ${initialValues.considerationPath}`
                        : ` ${initialValues.otherPath}`}
                      match your values, interests, or long-term goals?
                    </Label>
                    <Textarea
                      className="mt-2"
                      placeholder="Reflect on whether this path aligns with what matters to you..."
                      value={activeRoad === "A" ? formData.valuesA : formData.valuesB}
                      onChange={(e) => updateFormData(
                        activeRoad === "A" ? "valuesA" : "valuesB", 
                        e.target.value
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Future You Check-In */}
          <TabsContent value="future">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2 text-2xl">🔮</span> 
                  Future You Check-In
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Imagine it's a year from now. What have you gained from 
                      {activeRoad === "A" 
                        ? ` ${initialValues.considerationPath}`
                        : ` ${initialValues.otherPath}`}?
                    </Label>
                    <Textarea
                      className="mt-2"
                      placeholder="New skills? A story to tell? A new friend?"
                      value={activeRoad === "A" ? formData.gainA : formData.gainB}
                      onChange={(e) => updateFormData(
                        activeRoad === "A" ? "gainA" : "gainB", 
                        e.target.value
                      )}
                    />
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Select emojis that represent your future on this path:</Label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center">
                      {["⭐", "💬", "🌱", "🎓", "💪", "💯", "🚀", "💖", "🔄", "💰", "🤝", "🏆"].map((emoji) => {
                        const field = activeRoad === "A" ? "futureA" : "futureB";
                        const isSelected = formData[field] === emoji;
                        
                        return (
                          <div
                            key={emoji}
                            className={`p-3 text-3xl cursor-pointer rounded-lg transition-colors ${
                              isSelected 
                              ? "bg-gradient-to-r from-[#F5DF4D]/30 to-[#3DFDFF]/30 shadow-md" 
                              : "hover:bg-gray-100"
                            }`}
                            onClick={() => updateFormData(field, isSelected ? "" : emoji)}
                          >
                            {emoji}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            disabled={activeTab === "daily-impact"}
            onClick={prevTab}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Button 
            onClick={nextTab}
            className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90"
          >
            {activeTab === "future" ? "Complete Reflection" : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReflectionScreen;
