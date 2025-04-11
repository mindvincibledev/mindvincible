
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const affirmations = [
  "You're allowed to feel exactly how you feel.",
  "You're more than your struggles.",
  "You're growing, even on the hard days.",
  "You're not alone, and you never have to be.",
  "You're doing better than you think.",
  "You're worthy of love and kindness—especially from yourself.",
  "You're enough, exactly as you are."
];

// Emojis that represent positivity and encouragement
const emojis = ["✨", "💫", "🌟", "⭐", "🌈", "💖", "🍀", "🦋", "🌻"];

const Affirmation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentEmoji, setCurrentEmoji] = useState(emojis[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % affirmations.length);
      setCurrentEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="affirmation-container">
      <AnimatePresence mode="wait">
        {affirmations.map((affirmation, index) => (
          index === currentIndex && (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full text-center"
            >
              <div className="relative p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#D5D5F1]/30">
                <div className="absolute -top-3 -left-3">
                  <motion.span
                    className="text-2xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    {currentEmoji}
                  </motion.span>
                </div>
                <div className="absolute -bottom-3 -right-3">
                  <motion.span
                    className="text-2xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                  >
                    {currentEmoji}
                  </motion.span>
                </div>
                <motion.p 
                  className="text-lg md:text-xl lg:text-2xl font-medium text-foreground italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  "{affirmation}"
                </motion.p>
                <motion.div 
                  className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#FC68B3] to-[#FF8A48]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Affirmation;
