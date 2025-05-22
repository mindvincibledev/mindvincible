
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from '@/components/Navbar';
import BackgroundWithEmojis from '@/components/BackgroundWithEmojis';

const SelfAwarenessVideos = () => {
  // YouTube video data
  const storyVideos = [
    {
      id: 'story-1',
      title: 'When Stars Are Scattered – Victoria Jamieson & Omar Mohamed',
      caption: 'A moving true story about resilience, hope, and the refugee experience.',
      videoId: '_ryW25DpTmc'
    },
    {
      id: 'story-2',
      title: 'The Prince and the Dressmaker – Jen Wang',
      caption: 'A story about identity, self-expression, and unconditional friendship.',
      videoId: 'xBUMNJ6T5Kk'
    }
  ];
  
  const awarenessVideos = [
    {
      id: 'awareness-1',
      title: 'Do I control my thoughts, or do they control me?',
      caption: 'Understanding the relationship between your thoughts and yourself',
      videoId: 'bq9yWrKcB5Y'
    },
    {
      id: 'awareness-2',
      title: 'Self-awareness continued',
      caption: 'More insights on self-awareness and mindfulness',
      videoId: 'gd65sMGERrU'
    }
  ];

  const renderYouTubeVideo = (videoId: string) => (
    <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-lg">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-[300px] md:h-[400px] rounded-lg"
        title="YouTube video player"
      />
    </div>
  );

  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen relative">
        <Navbar />
        
        <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
          <div className="mb-8">
            <Link to="/resources">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Resources
              </Button>
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent mb-4">
                Self Awareness Videos
              </h1>
              <p className="text-black text-lg max-w-2xl mx-auto">
                Explore these videos to deepen your self-awareness journey
              </p>
            </motion.div>
          </div>
          
          <Tabs defaultValue="story" className="w-full max-w-4xl mx-auto">
            <TabsList className="w-full grid grid-cols-2 mb-8">
              <TabsTrigger value="story">Story Videos</TabsTrigger>
              <TabsTrigger value="awareness">Awareness Videos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="story" className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-md border border-[#D5D5F1]/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-black">Stories for Self-Awareness</CardTitle>
                  <CardDescription>
                    Stories that help us understand ourselves and others better
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {storyVideos.map((video) => (
                      <AccordionItem key={video.id} value={video.id} className="border-b border-[#D5D5F1]/30">
                        <AccordionTrigger className="text-lg font-medium hover:text-[#FC68B3]">
                          {video.title}
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <p className="text-gray-700">{video.caption}</p>
                          {renderYouTubeVideo(video.videoId)}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="awareness" className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-md border border-[#3DFDFF]/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-black">Awareness Videos</CardTitle>
                  <CardDescription>
                    Deepen your understanding of the self and thought patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {awarenessVideos.map((video) => (
                      <AccordionItem key={video.id} value={video.id} className="border-b border-[#3DFDFF]/30">
                        <AccordionTrigger className="text-lg font-medium hover:text-[#3DFDFF]">
                          {video.title}
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <p className="text-gray-700">{video.caption}</p>
                          {renderYouTubeVideo(video.videoId)}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default SelfAwarenessVideos;
