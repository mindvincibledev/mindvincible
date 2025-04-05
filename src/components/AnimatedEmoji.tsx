
import React from "react";
import { Brain, Heart, MessageCircle, Smile, Sparkles } from "lucide-react";

interface AnimatedEmojiProps {
  icon: "smile" | "brain" | "heart" | "sparkles" | "message";
  color?: string;
  size?: "sm" | "md" | "lg" | "xl";
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  delay?: number;
}

const AnimatedEmoji: React.FC<AnimatedEmojiProps> = ({
  icon,
  color = "#FC68B3",
  size = "md",
  position = {},
  delay = 0,
}) => {
  const getIcon = () => {
    switch (icon) {
      case "smile":
        return <Smile className="w-full h-full text-white" />;
      case "brain":
        return <Brain className="w-full h-full text-white" />;
      case "heart":
        return <Heart className="w-full h-full text-white" />;
      case "sparkles":
        return <Sparkles className="w-full h-full text-white" />;
      case "message":
        return <MessageCircle className="w-full h-full text-white" />;
      default:
        return <Smile className="w-full h-full text-white" />;
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "w-16 h-16";
      case "md":
        return "w-20 h-20";
      case "lg":
        return "w-24 h-24";
      case "xl":
        return "w-28 h-28";
      default:
        return "w-20 h-20";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-8 h-8";
      case "md":
        return "w-12 h-12";
      case "lg":
        return "w-14 h-14";
      case "xl":
        return "w-16 h-16";
      default:
        return "w-12 h-12";
    }
  };

  return (
    <div
      className={`absolute emoji z-10 animate-float ${getSizeClass()}`}
      style={{
        ...position,
        animationDelay: `${delay}s`,
      }}
    >
      <div
        className={`${getSizeClass()} rounded-full flex items-center justify-center shadow-lg`}
        style={{ backgroundColor: color }}
      >
        <div className={getIconSize()}>{getIcon()}</div>
      </div>
    </div>
  );
};

export default AnimatedEmoji;
