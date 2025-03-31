
import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { LampContainer } from '@/components/ui/lamp';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      
      {/* Hero Section with Lamp */}
      <LampContainer>
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center text-center"
        >
          <motion.h1
            initial={{ opacity: 0.5 }}
            whileInView={{ opacity: 1 }}
            transition={{
              delay: 0.4,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-8 bg-gradient-to-br from-white to-gray-400 py-4 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent md:text-7xl"
          >
            Welcome to <span className="text-primary">M(in)dvincible</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-6 max-w-2xl text-lg text-gray-300"
          >
            Bridging communication gaps between teens, parents, and educators while building resilience.
          </motion.p>
        </motion.div>
      </LampContainer>
    </div>
  );
};

export default Home;
