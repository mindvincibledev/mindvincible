import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paintbrush, Save, RotateCcw, Images, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import JarCanvas from '@/components/jar/JarCanvas';
import ColorPalette from '@/components/jar/ColorPalette';
import { getBase64FromCanvas, generateJarFilename } from '@/utils/jarUtils';
import { drawJarOutline } from '@/utils/canvasDrawingUtils';

const MoodJar = () => {
  const [selectedColor, setSelectedColor] = useState<string>('#F5DF4D');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('Happy');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Define colors with matching emotional associations
  const colors = [
    '#F5DF4D', // Yellow (Happy)
    '#FF8A48', // Orange (Angry)
    '#3DFDFF', // Cyan (Sad)
    '#D5D5F1', // Lavender (Fearful)
    '#2AC20E', // Green (Surprised)
    '#D6F6D5', // Light Green (Disgusted)
    '#FC68B3', // Pink (Love)
  ];

  // Effect to check if user is available and get user ID
  useEffect(() => {
    const checkUser = async () => {
      // If user is available from AuthContext, use that ID
      if (user) {
        setUserId(user.id);
        return;
      }

      // Otherwise, try to get the session directly from supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to use the Mood Jar",
        });
        navigate("/login");
      }
    };

    checkUser();
  }, [user, navigate, toast]);

  const handleColorSelect = (color: string, emotion: string) => {
    setSelectedColor(color);
    setSelectedEmotion(emotion);
  };

  // Draw jar outline wrapper function that uses our utility
  const handleJarOutline = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    drawJarOutline(ctx, width, height);
  };

  const handleReset = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Redraw the empty jar outline
        drawJarOutline(context, canvas.width, canvas.height);
      }
    }
    toast({
      title: "Canvas Reset",
      description: "Your jar canvas has been reset",
    });
  };

  const handleSave = async () => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to save your mood jar",
      });
      navigate("/login");
      return;
    }

    try {
      setIsSaving(true);
      
      // Get blob image data from canvas
      const blobImage = await getBase64FromCanvas(canvasRef.current);
      if (!blobImage) {
        throw new Error("Could not get image data from canvas");
      }
      
      // Generate a unique filename in the user's folder
      const fileName = generateJarFilename(userId);
      
      // Upload the image to Supabase storage
      const { error: uploadError } = await supabase
        .storage
        .from('mood_jars')
        .upload(fileName, blobImage, {
          contentType: 'image/png',
          cacheControl: '3600',
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Insert into mood_jar_table with the file path
      const { error: dbError } = await supabase
        .from('mood_jar_table')
        .insert({
          user_id: userId,
          image_path: fileName
        });

      if (dbError) {
        console.error("Database error:", dbError);
        throw dbError;
      }

      toast({
        title: "Mood Jar Saved",
        description: "Your mood jar has been saved successfully!",
      });
      
      navigate("/home");
    } catch (error) {
      console.error("Error saving mood jar:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your mood jar. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Navigate to the Recent Mood Jars page
  const handleViewJars = () => {
    navigate('/recent-mood-jars');
  };

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col gap-6 items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-black text-center">
              Feelings Jar Activity
            </h1>
            
            <div className="w-full max-w-2xl bg-white/95 backdrop-blur-lg p-6 rounded-xl border border-gray-200 shadow-xl">
              <div className="flex flex-col gap-6">
                <p className="text-gray-800 text-center text-lg font-medium">
                  Check-in with yourself to understand your feelings.
                </p>
                
                {/* Added button to view recent jars */}
                <div className="flex justify-center mb-2">
                  <Button
                    className="bg-gradient-to-r from-[#FC68B3] to-[#3DFDFF] hover:opacity-90 
                             text-black font-medium flex items-center gap-2"
                    onClick={handleViewJars}
                  >
                    <Images size={18} />
                    View Your Mood Jar Gallery
                  </Button>
                </div>
                
                <ColorPalette 
                  colors={colors} 
                  onSelectColor={handleColorSelect} 
                  selectedColor={selectedColor} 
                />
                
                <div className="flex justify-center">
                  <JarCanvas 
                    ref={canvasRef}
                    drawJarOutline={handleJarOutline}
                    selectedEmotion={selectedEmotion}
                    selectedColor={selectedColor}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                  <Button
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 backdrop-blur-sm
                             transition-all duration-300 hover:scale-105 group font-medium"
                    onClick={handleReset}
                  >
                    <RotateCcw size={18} className="group-hover:rotate-180 transition-transform duration-500 mr-2"/>
                    Reset
                  </Button>
                  
                  <Button
                    className="bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] hover:opacity-90
                             text-black font-medium flex items-center gap-2 shadow-lg
                             transition-all duration-300 hover:scale-105 hover:shadow-[#3DFDFF]/20 
                             relative overflow-hidden group"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                  -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <Save size={18} className="group-hover:scale-110 transition-transform duration-300 mr-2"/>
                    {isSaving ? 'Saving...' : 'Complete Activity'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default MoodJar;
