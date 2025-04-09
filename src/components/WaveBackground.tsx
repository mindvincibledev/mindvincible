
import React from 'react';
import { WavyBackground } from './ui/wavy-background';

const WaveBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <WavyBackground 
        colors={['#FF8A4820', '#D5D5F120', '#3DFDFF20', '#F5DF4D20', '#FC68B320']}
        blur={20}
        speed="slow"
        waveWidth={100}
        backgroundFill="#FFFFFF"
        className="h-full w-full"
      />
    </div>
  );
};

export default WaveBackground;
