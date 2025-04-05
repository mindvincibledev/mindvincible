
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoodJar {
  id: string;
  image_path: string;
  created_at: string;
}

const RecentMoodJars = ({ userId }: { userId: string }) => {
  const [moodJars, setMoodJars] = useState<MoodJar[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMoodJars = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('mood_jar_table')
          .select('id, image_path, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) {
          console.error('Error fetching mood jars:', error);
          throw error;
        }
        
        if (data) {
          setMoodJars(data as MoodJar[]);
        }
      } catch (err) {
        console.error('Error processing mood jar data:', err);
        toast({
          variant: "destructive",
          title: "Failed to load mood jars",
          description: "There was an error loading your mood jars.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMoodJars();
    }
  }, [userId, toast]);

  if (loading) {
    return (
      <div className="bg-black/60 backdrop-blur-lg rounded-lg border border-[#3DFDFF]/30 shadow-lg p-6">
        <p className="text-center text-[#D5D5F1]">Loading mood jars...</p>
      </div>
    );
  }

  if (moodJars.length === 0) {
    return (
      <Card className="bg-black/60 backdrop-blur-lg border border-[#3DFDFF]/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#F5DF4D]">Your Mood Jars</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-6">
          <p className="text-[#D5D5F1] mb-4">You haven't created any mood jars yet.</p>
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
    <Card className="bg-black/60 backdrop-blur-lg border border-[#3DFDFF]/30 shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#F5DF4D]">Your Recent Mood Jars</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full">
          <CarouselContent>
            {moodJars.map((jar) => (
              <CarouselItem key={jar.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <div className="bg-white/90 rounded-lg overflow-hidden flex flex-col items-center p-2 shadow-md">
                    <img 
                      src={jar.image_path} 
                      alt="Mood Jar" 
                      className="w-full h-48 object-contain mb-2 rounded"
                    />
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
