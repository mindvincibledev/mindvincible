
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface RoadLabelsScreenProps {
  onNext: (paths: { consideration_path: string; other_path: string }) => void;
  initialValues?: {
    consideration_path: string;
    other_path: string;
  };
}

const RoadLabelsScreen: React.FC<RoadLabelsScreenProps> = ({ 
  onNext, 
  initialValues = { consideration_path: '', other_path: '' } 
}) => {
  const [paths, setPaths] = useState(initialValues);
  const [errors, setErrors] = useState({ consideration_path: false, other_path: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      consideration_path: paths.consideration_path.trim().length === 0,
      other_path: paths.other_path.trim().length === 0
    };
    
    if (newErrors.consideration_path || newErrors.other_path) {
      setErrors(newErrors);
      return;
    }
    
    onNext(paths);
  };

  const handleChange = (field: 'consideration_path' | 'other_path', value: string) => {
    setPaths(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        Label Your Roads
      </h2>
      
      <p className="text-gray-600 mb-8 text-center">
        Give each path a clear name so we can explore them further.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Road A */}
        <Card className="bg-gradient-to-br from-white to-[#D5D5F1]/10 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <div className="text-3xl">🛣️</div>
              <h3 className="text-xl font-medium ml-2">Road A</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="pathA" className={errors.consideration_path ? "text-red-500" : ""}>
                  What's one path you're considering?
                </Label>
                <Input
                  id="pathA"
                  value={paths.consideration_path}
                  onChange={(e) => handleChange('consideration_path', e.target.value)}
                  placeholder="Example: Join soccer team"
                  className={`${errors.consideration_path ? "border-red-500" : ""}`}
                />
                {errors.consideration_path && (
                  <p className="text-sm text-red-500 mt-1">
                    Please name this path
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Road B */}
        <Card className="bg-gradient-to-br from-white to-[#3DFDFF]/10 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <div className="text-3xl">🪧</div>
              <h3 className="text-xl font-medium ml-2">Road B</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="pathB" className={errors.other_path ? "text-red-500" : ""}>
                  What's the other option?
                </Label>
                <Input
                  id="pathB"
                  value={paths.other_path}
                  onChange={(e) => handleChange('other_path', e.target.value)}
                  placeholder="Example: Stay with art club"
                  className={`${errors.other_path ? "border-red-500" : ""}`}
                />
                {errors.other_path && (
                  <p className="text-sm text-red-500 mt-1">
                    Please name this path
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mt-8">
        <Button 
          onClick={handleSubmit}
          className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] text-white hover:opacity-90 px-8 py-2"
        >
          Let's Explore My Options
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default RoadLabelsScreen;
