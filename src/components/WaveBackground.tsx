
import React from 'react';

const WaveBackground = () => {
  return (
    <div className="wave-container">
      <div className="wave wave1" style={{ clipPath: 'polygon(0% 60%, 17% 65%, 24% 68%, 31% 65%, 37% 60%, 43% 55%, 50% 52%, 57% 55%, 64% 60%, 71% 65%, 77% 68%, 84% 65%, 92% 60%, 100% 57%, 100% 100%, 0% 100%)' }}></div>
      <div className="wave wave2" style={{ clipPath: 'polygon(0% 73%, 5% 68%, 11% 66%, 18% 65%, 23% 63%, 30% 62%, 37% 63%, 43% 66%, 50% 69%, 56% 72%, 63% 71%, 70% 69%, 77% 66%, 83% 63%, 90% 62%, 95% 63%, 100% 65%, 100% 100%, 0% 100%)' }}></div>
      <div className="wave wave3" style={{ clipPath: 'polygon(0% 84%, 7% 81%, 14% 78%, 20% 76%, 27% 75%, 34% 76%, 41% 79%, 48% 82%, 54% 85%, 61% 87%, 68% 86%, 74% 84%, 81% 81%, 88% 78%, 94% 77%, 100% 78%, 100% 100%, 0% 100%)' }}></div>
      <div className="wave wave4" style={{ clipPath: 'polygon(0% 92%, 7% 89%, 13% 87%, 20% 86%, 27% 87%, 33% 89%, 40% 92%, 47% 94%, 53% 95%, 60% 94%, 67% 92%, 73% 89%, 80% 87%, 87% 86%, 93% 87%, 100% 89%, 100% 100%, 0% 100%)' }}></div>
    </div>
  );
};

export default WaveBackground;
