
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { WavyBackground } from '@/components/ui/wavy-background';
import { Typewriter } from '@/components/ui/typewriter';
import { Button } from '@/components/ui/button';

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
        className="max-w-4xl mx-auto flex flex-col items-center justify-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-[#FF8A48] to-[#FC68B3] py-4 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent md:text-7xl"
        >
          Welcome to <span className="text-primary">M(in)dvincible</span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-6 max-w-2xl mx-auto text-center"
        >
          <div className="text-xl md:text-2xl text-white backdrop-blur-sm bg-black/30 p-4 rounded-lg">
            <span className="text-[#F5DF4D]">You're </span>
            <Typewriter 
              text={[
                "allowed to feel exactly how you feel.",
                "more than your struggles.",
                "growing, even on the hard days.",
                "not alone, and you never have to be.",
                "doing better than you think.",
                "worthy of love and kindness—especially from yourself.",
                "enough, exactly as you are."
              ]}
              speed={70}
              className="text-[#3DFDFF]"
              waitTime={1500}
              deleteSpeed={40}
              cursorChar="|"
              cursorClassName="text-[#FC68B3] ml-1"
            />
          </div>
          <p className="mt-4 text-lg text-white bg-black/30 backdrop-blur-sm p-3 rounded-lg">
            Bridging communication gaps between teens, parents, and educators while building resilience.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.7,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-8"
          >
            <Link to="/login">
              <Button
                className="bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:from-[#FF8A48] hover:to-[#FC68B3] text-white px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </WavyBackground>
    </div>
  );
};

export default Home;
