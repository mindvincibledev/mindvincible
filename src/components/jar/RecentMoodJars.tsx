
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { getSignedUrl } from '@/utils/jarUtils';

interface MoodJar {
  id: string;
  image_path: string;
  created_at: string;
  signed_url?: string;
}

const RecentMoodJars = () => {
  const [moodJars, setMoodJars] = useState<MoodJar[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchMoodJars = async () => {
      try {
        setLoading(true);
        
        const { data: jars, error } = await supabase
          .from('mood_jar_table')
          .select('id, image_path, created_at')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) {
          console.error('Error fetching mood jars:', error);
          throw error;
        }
        
        if (jars) {
          // Get signed URLs for all images
          const jarsWithUrls = await Promise.all(
            jars.map(async (jar) => {
              try {
                console.log(`Getting signed URL for jar ${jar.id} with path: ${jar.image_path}`);
                const signedUrl = await getSignedUrl(jar.image_path);
                console.log(`Received signed URL: ${signedUrl.substring(0, 50)}...`);
                return { ...jar, signed_url: signedUrl };
              } catch (error) {
                console.error(`Error getting signed URL for jar ${jar.id}:`, error);
                return jar;
              }
            })
          );
          setMoodJars(jarsWithUrls);
        }
      } catch (err) {
        console.error('Error processing mood jar data:', err);
        toast({
          variant: "destructive",
          title: "Failed to load mood jars",
          description: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMoodJars();
  }, [user, toast, navigate]);

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-lg rounded-lg border border-gray-200 shadow-lg p-6">
        <p className="text-center text-gray-500">Loading mood jars...</p>
      </div>
    );
  }

  if (moodJars.length === 0) {
    return (
      <Card className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800">Your Mood Jars</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-6">
          <p className="text-gray-600 mb-4">You haven't created any mood jars yet.</p>
          <Link to="/mood-jar">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-[#3DFDFF] to-[#2AC20E] hover:opacity-90 text-black">
              <PlusCircle size={18} />
              <span>Create Your First Mood Jar</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-gray-800">Your Recent Mood Jars</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full">
          <CarouselContent>
            {moodJars.map((jar) => (
              <CarouselItem key={jar.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <div className="bg-white rounded-lg overflow-hidden flex flex-col items-center p-2 shadow-md border border-gray-100">
                    {jar.signed_url ? (
                      <img 
                        src={jar.signed_url} 
                        alt="Mood Jar" 
                        className="w-full h-48 object-contain mb-2 rounded"
                        onError={(e) => {
                          console.error("Error loading image");
                          const target = e.target as HTMLImageElement;
                          target.src = "placeholder.svg";
                          target.alt = "Failed to load mood jar image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center bg-gray-100 mb-2 rounded">
                        <p className="text-gray-400">Image not available</p>
                      </div>
                    )}
                    <p className="text-sm text-gray-600">
                      {new Date(jar.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4">
            <CarouselPrevious className="relative static left-0 right-0 mx-2 translate-y-0" />
            <CarouselNext className="relative static left-0 right-0 mx-2 translate-y-0" />
          </div>
        </Carousel>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link to="/mood-jar">
          <Button className="flex items-center gap-2 bg-gradient-to-r from-[#FF8A48] to-[#FC68B3] hover:opacity-90 text-white">
            <PlusCircle size={18} />
            <span>Create New Mood Jar</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecentMoodJars;
