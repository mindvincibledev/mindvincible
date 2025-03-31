
import React, { useState, useEffect } from 'react';

const affirmations = [
  "You're allowed to feel exactly how you feel.",
  "You're more than your struggles.",
  "You're growing, even on the hard days.",
  "You're not alone, and you never have to be.",
  "You're doing better than you think.",
  "You're worthy of love and kindness—especially from yourself.",
  "You're enough, exactly as you are."
];

const Affirmation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % affirmations.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="affirmation-container">
      {affirmations.map((affirmation, index) => (
        <div
          key={index}
          className={`affirmation ${index === currentIndex ? 'active' : ''}`}
        >
          <p className="text-lg md:text-xl lg:text-2xl font-medium text-foreground italic">
            "{affirmation}"
          </p>
        </div>
      ))}
    </div>
  );
};

export default Affirmation;
