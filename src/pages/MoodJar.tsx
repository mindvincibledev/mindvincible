import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paintbrush, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';
import JarCanvas from '@/components/jar/JarCanvas';
import ColorPalette from '@/components/jar/ColorPalette';
import { getBase64FromCanvas, generateJarFilename } from '@/utils/jarUtils';

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

  const drawJarOutline = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Drawing the jar outline in black
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Jar neck
    const neckWidth = width * 0.3;
    const neckHeight = height * 0.2;
    ctx.moveTo(width/2 - neckWidth/2, height * 0.1);
    ctx.lineTo(width/2 - neckWidth/2, height * 0.1 + neckHeight);
    ctx.lineTo(width * 0.2, height * 0.3); // Left shoulder
    ctx.lineTo(width * 0.2, height * 0.8); // Left side
    ctx.quadraticCurveTo(width * 0.2, height * 0.9, width * 0.5, height * 0.9); // Bottom curve left
    ctx.quadraticCurveTo(width * 0.8, height * 0.9, width * 0.8, height * 0.8); // Bottom curve right
    ctx.lineTo(width * 0.8, height * 0.3); // Right side
    ctx.lineTo(width/2 + neckWidth/2, height * 0.1 + neckHeight); // Right shoulder
    ctx.lineTo(width/2 + neckWidth/2, height * 0.1); // Top right of neck
    ctx.closePath();
    ctx.stroke();
    
    // Jar lid
    ctx.beginPath();
    ctx.arc(width/2, height * 0.07, neckWidth * 0.7, 0, Math.PI * 2);
    ctx.stroke();
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
      
      // First, verify the user exists in the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (userError || !userData) {
        console.error("User verification error:", userError);
        throw new Error("Could not verify user in database");
      }
      
      // Generate a unique filename
      const fileName = generateJarFilename(userId);
      
      // Upload the image to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase
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

      // Get the public URL for the uploaded image
      const { data: urlData } = supabase
        .storage
        .from('mood_jars')
        .getPublicUrl(fileName);

      if (!urlData.publicUrl) {
        throw new Error("Failed to get public URL for uploaded image");
      }

      // Insert into mood_jar_table with the verified user ID
      const { error: dbError } = await supabase
        .from('mood_jar_table')
        .insert({
          user_id: userId,
          image_path: urlData.publicUrl
        });

      if (dbError) {
        console.error("Database error:", dbError);
        throw dbError;
      }

      toast({
        title: "Mood Jar Saved",
        description: "Your mood jar has been saved successfully!",
      });
      
      // Navigate to dashboard after successful save
      navigate("/dashboard");
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

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col gap-6 items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              Feelings Jar Activity
            </h1>
            
            <div className="w-full max-w-2xl bg-black/60 backdrop-blur-lg p-6 rounded-xl border border-[#3DFDFF]/30 shadow-xl">
              <div className="flex flex-col gap-6">
                <p className="text-white text-center text-lg">
                  Check-in with yourself to understand your feelings.
                </p>
                
                <ColorPalette 
                  colors={colors} 
                  onSelectColor={handleColorSelect} 
                  selectedColor={selectedColor} 
                />
                
                <div className="flex justify-center">
                  <JarCanvas 
                    ref={canvasRef}
                    drawJarOutline={drawJarOutline}
                    selectedEmotion={selectedEmotion}
                    selectedColor={selectedColor}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                  <Button
                    className="bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-sm
                             transition-all duration-300 hover:scale-105 group"
                    onClick={handleReset}
                  >
                    <RotateCcw size={18} className="group-hover:rotate-180 transition-transform duration-500"/>
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
                    <Save size={18} className="group-hover:scale-110 transition-transform duration-300"/>
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
