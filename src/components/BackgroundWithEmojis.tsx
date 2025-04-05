
import React from "react";
import Wave from "./Wave";
import AnimatedEmoji from "./AnimatedEmoji";
import { FC, ReactNode } from "react";

interface BackgroundWithEmojisProps {
  children: ReactNode;
}

const BackgroundWithEmojis: FC<BackgroundWithEmojisProps> = ({
  children,
}) => (
  <div className="min-h-screen font-poppins relative overflow-hidden bg-black">
    {/* Waves background with lowered z-index */}
    <Wave />
    
    {/* Floating emojis positioned above waves but below content */}
    <AnimatedEmoji icon="smile" color="#FC68B3" size="md" position={{ top: "10%", left: "7%" }} />
    <AnimatedEmoji icon="sparkles" color="#F5DF4D" size="lg" position={{ top: "15%", right: "10%" }} delay={1.5} />
    <AnimatedEmoji icon="brain" color="#3DFDFF" size="sm" position={{ bottom: "15%", left: "12%" }} delay={2} />
    <AnimatedEmoji icon="message" color="#2AC20E" size="md" position={{ bottom: "20%", right: "15%" }} delay={1} />
    <AnimatedEmoji icon="heart" color="#FF8A48" size="sm" position={{ top: "40%", left: "85%" }} delay={2.5} />
    <AnimatedEmoji icon="sparkles" color="#D5D5F1" size="md" position={{ bottom: "40%", left: "20%" }} delay={3} />
    <AnimatedEmoji icon="brain" color="#2AC20E" size="lg" position={{ top: "70%", right: "7%" }} delay={2.2} />
    
    {/* Main content with higher z-index */}
    <div className="relative z-10">{children}</div>
  </div>
);

export default BackgroundWithEmojis;
