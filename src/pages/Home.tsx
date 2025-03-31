
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Affirmation from '@/components/Affirmation';
import WaveBackground from '@/components/WaveBackground';
import { LampDemo } from '@/components/ui/lamp';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, BookOpen, Video, MessageSquare } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <WaveBackground />
      
      {/* Hero Section with Lamp Effect */}
      <section className="relative z-10">
        <LampDemo />
        
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center mt-[-3rem] md:mt-[-5rem] z-20 relative">
          <p className="text-lg max-w-2xl mx-auto mb-8 text-foreground/80">
            Bridging communication gaps between teens, parents, and educators while building resilience.
          </p>
          
          <Affirmation />
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link to="/login">
              <Button size="lg">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="section-padding bg-white/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Our Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card hover:shadow-xl transition-shadow">
              <div className="p-4 bg-orange/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Brain className="text-orange h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mood Meter</h3>
              <p className="text-foreground/70">Track and understand your emotional states with our interactive mood meter.</p>
              <Link to="/features/mood-meter" className="inline-block mt-4 text-primary hover:underline">
                Learn more
              </Link>
            </div>
            
            <div className="card hover:shadow-xl transition-shadow">
              <div className="p-4 bg-cyan/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <BookOpen className="text-cyan h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Journaling Corner</h3>
              <p className="text-foreground/70">A private space to reflect on your thoughts and feelings with emotion tagging.</p>
              <Link to="/features/journaling" className="inline-block mt-4 text-primary hover:underline">
                Learn more
              </Link>
            </div>
            
            <div className="card hover:shadow-xl transition-shadow">
              <div className="p-4 bg-yellow/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Video className="text-yellow h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Resources</h3>
              <p className="text-foreground/70">Access videos, puzzles, worksheets, and other curated content to support your journey.</p>
              <Link to="/features/resources" className="inline-block mt-4 text-primary hover:underline">
                Learn more
              </Link>
            </div>
            
            <div className="card hover:shadow-xl transition-shadow">
              <div className="p-4 bg-pink/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <MessageSquare className="text-pink h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Chat Support</h3>
              <p className="text-foreground/70">Get 24/7 guidance and support from our AI-powered chatbot.</p>
              <Link to="/features/chat" className="inline-block mt-4 text-primary hover:underline">
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="section-padding">
        <div className="container mx-auto">
          <div className="bg-white/50 backdrop-blur-md rounded-lg shadow-lg p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Our Mission</h2>
            <p className="text-lg text-center max-w-3xl mx-auto">
              At M(in)dvincible, we believe in providing 24/7 support to foster understanding between teens, parents, and educators.
              Our platform equips youth with tools to navigate challenges, build resilience, and thrive in their journey.
            </p>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-orange/30 to-pink/30">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Start your journey toward better communication, understanding, and resilience today.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
