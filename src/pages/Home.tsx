
import React from 'react';
import Navbar from '@/components/Navbar';
import Affirmation from '@/components/Affirmation';
import WaveBackground from '@/components/WaveBackground';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <WaveBackground />
      
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 px-4 flex flex-col items-center justify-center text-center relative z-10 min-h-[calc(100vh-4rem)]">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
          Welcome to <span className="text-primary">M(in)dvincible</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-8 text-foreground/80">
          Bridging communication gaps between teens, parents, and educators while building resilience.
        </p>
        
        <Affirmation />
      </section>
    </div>
  );
};

export default Home;
