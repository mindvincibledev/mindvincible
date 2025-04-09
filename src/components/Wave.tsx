
// components/Wave.tsx
import React from 'react';

const Wave = () => {
  return (
    <div className="waves-container fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <svg
        className="waves h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
      >
        <defs>
          <path
            id="wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="wave-parallax">
          <use xlinkHref="#wave" x="48" y="0" fill="rgba(255, 138, 72, 0.08)" className="animate-wave1"/>
          <use xlinkHref="#wave" x="48" y="3" fill="rgba(213, 213, 241, 0.06)" className="animate-wave2"/>
          <use xlinkHref="#wave" x="48" y="5" fill="rgba(61, 253, 255, 0.04)" className="animate-wave3"/>
          <use xlinkHref="#wave" x="48" y="7" fill="rgba(245, 223, 77, 0.03)" className="animate-wave4"/>
          <use xlinkHref="#wave" x="48" y="9" fill="rgba(252, 104, 179, 0.02)" className="animate-wave1" style={{ animationDelay: '0.5s' }}/>
          <use xlinkHref="#wave" x="48" y="11" fill="rgba(42, 194, 14, 0.01)" className="animate-wave2" style={{ animationDelay: '0.75s' }}/>
        </g>
      </svg>
    </div>
  );
};

export default Wave;
