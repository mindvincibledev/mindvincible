
import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { WavyBackground } from '@/components/ui/wavy-background';
import { ArrowDown } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      
      {/* Hero Section with Wavy Background */}
      <WavyBackground 
        colors={["#FF8A48", "#D5D5F1", "#3DFDFF", "#F5DF4D", "#FC68B3", "#2AC20E"]}
        waveWidth={50}
        backgroundFill="black"
        blur={10}
        speed="fast"
        waveOpacity={0.5}
        className="max-w-4xl mx-auto"
      >
        <div className="p-4 backdrop-blur-md bg-black/40 rounded-xl border border-white/10 shadow-xl max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-8 bg-gradient-to-br from-[#F5DF4D] to-[#FF8A48] py-4 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent md:text-7xl"
          >
            Welcome to <span className="text-primary">M(in)dvincible</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-6 max-w-2xl mx-auto text-center text-lg text-white/90 font-medium leading-relaxed px-4"
          >
            Bridging communication gaps between teens, parents, and educators while building resilience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex justify-center mt-8 mb-4"
          >
            <button className="px-6 py-3 bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
              Get Started
              <ArrowDown size={18} />
            </button>
          </motion.div>
        </div>
      </WavyBackground>
    </div>
  );
};

export default Home;
