
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const CompletionAnimation: React.FC = () => {
  // Starfield configuration
  const starCount = 100;
  const stars = Array.from({ length: starCount }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 5 + 3,
    duration: Math.random() * 10 + 10
  }));

  return (
    <div className="relative h-80 mb-6 overflow-hidden rounded-xl">
      {/* Gradient background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-[#3DFDFF]/30 to-[#FC68B3]/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
      
      {/* Stars effect */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          initial={{ 
            opacity: 0,
            scale: 0,
            filter: "blur(2px)"
          }}
          animate={{ 
            opacity: [0, 0.8, 0.4],
            scale: [0, 1, 0.8],
            filter: ["blur(3px)", "blur(1px)", "blur(2px)"]
          }}
          transition={{ 
            duration: star.duration,
            delay: Math.random() * 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}

      {/* Roots/vines growing effect */}
      <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 400 300">
        {/* Left growing vine */}
        <motion.path
          d="M 50,300 Q 70,250 60,200 Q 50,150 70,100 Q 90,50 120,30"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          stroke="#2AC20E"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Small branches of the left vine */}
        <motion.path
          d="M 60,200 Q 90,190 110,205"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 2.5, ease: "easeInOut" }}
          stroke="#2AC20E"
          strokeWidth="1"
          fill="none"
        />
        
        <motion.path
          d="M 70,100 Q 100,110 120,90"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 3, ease: "easeInOut" }}
          stroke="#2AC20E"
          strokeWidth="1"
          fill="none"
        />
        
        {/* Right growing vine */}
        <motion.path
          d="M 350,300 Q 330,250 340,200 Q 350,150 330,100 Q 310,50 280,30"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          stroke="#2AC20E"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Small branches of the right vine */}
        <motion.path
          d="M 340,200 Q 310,190 290,205"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 2.5, ease: "easeInOut" }}
          stroke="#2AC20E"
          strokeWidth="1"
          fill="none"
        />
        
        <motion.path
          d="M 330,100 Q 300,110 280,90"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 3, ease: "easeInOut" }}
          stroke="#2AC20E"
          strokeWidth="1"
          fill="none"
        />
        
        {/* Center small decorative elements */}
        <motion.circle
          cx="200"
          cy="150"
          r="5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 3 }}
          fill="#FC68B3"
        />
        
        <motion.circle
          cx="170"
          cy="120"
          r="3"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 3.2 }}
          fill="#F5DF4D"
        />
        
        <motion.circle
          cx="230"
          cy="130"
          r="3"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 3.4 }}
          fill="#3DFDFF"
        />
        
        <motion.circle
          cx="200"
          cy="100"
          r="3"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 3.6 }}
          fill="#FF8A48"
        />
      </svg>
      
      {/* Text animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-center max-w-md px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3 }}
        >
          <motion.div 
            className="text-xl font-medium mb-2 text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3.5 }}
          >
            Nice work. You just reconnected with your world and gave your mind a moment to slow down.
          </motion.div>
          <motion.div 
            className="text-lg text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 4 }}
          >
            You're grounded. Not the bad kind—the peaceful kind. 😌
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompletionAnimation;
