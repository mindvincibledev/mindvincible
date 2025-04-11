
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Star, Smile } from 'lucide-react';

const affirmations = [
  {text: "You're allowed to feel exactly how you feel.", emoji: "💭"},
  {text: "You're more than your struggles.", emoji: "✨"},
  {text: "You're growing, even on the hard days.", emoji: "🌱"},
  {text: "You're not alone, and you never have to be.", emoji: "🤗"},
  {text: "You're doing better than you think.", emoji: "👏"},
  {text: "You're worthy of love and kindness—especially from yourself.", emoji: "💖"},
  {text: "You're enough, exactly as you are.", emoji: "⭐"}
];

const Affirmation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % affirmations.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getRandomIcon = () => {
    const icons = [
      <Sparkles key="sparkles" className="h-5 w-5 text-[#F5DF4D]" />,
      <Heart key="heart" className="h-5 w-5 text-[#FC68B3]" />,
      <Star key="star" className="h-5 w-5 text-[#FF8A48]" />,
      <Smile key="smile" className="h-5 w-5 text-[#3DFDFF]" />
    ];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  return (
    <div className="affirmation-container relative w-full max-w-600px min-h-[140px] flex items-center justify-center">
      <AnimatePresence mode="wait">
        {affirmations.map((affirmation, index) => (
          index === currentIndex && (
            <motion.div
              key={index}
              initial={{ 
                opacity: 0, 
                scale: 0.8, 
                y: 20 
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.8, 
                y: -20,
                transition: { duration: 0.3 }
              }}
              className="bubble-message bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm p-6 rounded-[30px] shadow-lg border border-white/20 max-w-md mx-auto relative"
            >
              <div className="absolute -top-3 -left-3">{getRandomIcon()}</div>
              <div className="absolute -bottom-3 -right-3">{getRandomIcon()}</div>
              
              {/* Small decorative bubbles */}
              <motion.div 
                className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-[#FF8A48]/30"
                animate={{
                  y: [0, -10, 0],
                  transition: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                }}
              />
              <motion.div 
                className="absolute -bottom-2 -left-2 h-3 w-3 rounded-full bg-[#FC68B3]/30"
                animate={{
                  y: [0, 8, 0],
                  transition: { duration: 2.5, repeat: Infinity, repeatType: "reverse" }
                }}
              />
              
              <div className="flex flex-col items-center space-y-3">
                <p className="text-lg md:text-xl lg:text-2xl font-medium text-foreground italic text-center">
                  "{affirmation.text}"
                </p>
                <span className="text-3xl mt-2">{affirmation.emoji}</span>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Affirmation;
