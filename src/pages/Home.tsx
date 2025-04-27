import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Rocket } from 'lucide-react';
import BackgroundWithEmojis from "@/components/BackgroundWithEmojis";

const Home = () => {
  return (
    <BackgroundWithEmojis>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="w-full max-w-md"
        >
          <div className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-xl p-8 shadow-xl">
            <h1 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] bg-clip-text text-transparent">
              Welcome to M(in)dvincible
            </h1>
            <p className="text-gray-700 text-center mb-8">
              Your safe space to track your mood, journal your thoughts, and discover emotional well-being.
            </p>
            <div className="space-y-4">
              <Link to="/login" className="w-full flex items-center justify-center bg-gradient-to-r from-[#FC68B3] to-[#FF8A48] hover:from-[#FF8A48] hover:to-[#FC68B3] text-white font-semibold rounded-lg py-3 transition-colors duration-300">
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started
              </Link>
              {/* Removed Register link */}
              <p className="text-center text-gray-500">
                Empowering your emotional journey, one step at a time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </BackgroundWithEmojis>
  );
};

export default Home;
