
import React from "react";
import Wave from "./Wave";
import AnimatedEmoji from "./AnimatedEmoji";
import { FC, ReactNode } from "react";

interface BackgroundWithEmojisProps {
  children: ReactNode;
  showWaves?: boolean;
  showBlobs?: boolean;
}

const BackgroundWithEmojis: FC<BackgroundWithEmojisProps> = ({
  children,
  showWaves = true,
  showBlobs = true,
}) => {
  return (
    <div className="min-h-screen font-poppins relative galaxy-bg overflow-hidden">
      {/* Animated Blobs */}
      {showBlobs && (
        <>
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </>
      )}

      {/* Floating Emoji Icons */}
      <AnimatedEmoji
        icon="smile"
        color="#FC68B3"
        size="md"
        position={{ top: "40px", left: "7%" }}
      />
      <AnimatedEmoji
        icon="sparkles"
        color="#F5DF4D"
        size="lg"
        position={{ top: "60px", right: "10%" }}
        delay={1.5}
      />
      <AnimatedEmoji
        icon="brain"
        color="#3DFDFF"
        size="sm"
        position={{ bottom: "32px", left: "15%" }}
        delay={2}
      />
      <AnimatedEmoji
        icon="message"
        color="#2AC20E"
        size="md"
        position={{ bottom: "80px", right: "18%" }}
        delay={1}
      />

      {/* Wave Background */}
      {showWaves && <Wave />}

      {/* Main Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundWithEmojis;
