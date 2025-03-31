
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [colorIndex, setColorIndex] = useState(0);
  const colors = [
    "from-[#FF8A48]", // orange
    "from-[#D5D5F1]", // lavender
    "from-[#3DFDFF]", // cyan
    "from-[#F5DF4D]", // yellow
    "from-[#FC68B3]", // pink
    "from-[#2AC20E]", // green
  ];

  const toColors = [
    "to-[#FF8A48]", // orange
    "to-[#D5D5F1]", // lavender
    "to-[#3DFDFF]", // cyan
    "to-[#F5DF4D]", // yellow
    "to-[#FC68B3]", // pink
    "to-[#2AC20E]", // green
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [colors.length]);

  // Create wave animation with the lamp glow
  const waveVariants = {
    animate: {
      x: [0, -20, 0],
      y: [0, -5, 0],
      transition: {
        x: {
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        },
        y: {
          repeat: Infinity,
          duration: 3.5,
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black/95 w-full rounded-md z-0",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          animate="animate"
          variants={waveVariants}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className={`absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic ${colors[colorIndex]} via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]`}
        >
          <div className="absolute w-[100%] left-0 bg-black/95 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-[100%] left-0 bg-black/95 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          animate="animate"
          variants={waveVariants}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className={`absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent ${toColors[(colorIndex + 2) % colors.length]} text-white [--conic-position:from_290deg_at_center_top]`}
        >
          <div className="absolute w-40 h-[100%] right-0 bg-black/95 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-black/95 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-black/95 blur-2xl"></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className={`absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-[${colors[colorIndex].slice(5, -1)}] opacity-50 blur-3xl`}></div>
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          animate={{
            boxShadow: [
              `0 0 20px 5px ${colors[colorIndex].slice(5, -1)}`,
              `0 0 40px 10px ${colors[colorIndex].slice(5, -1)}`,
              `0 0 20px 5px ${colors[colorIndex].slice(5, -1)}`
            ],
          }}
          transition={{
            boxShadow: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            },
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className={`absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full ${colors[colorIndex].replace("from-", "bg-")} blur-2xl`}
        ></motion.div>
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          animate={{
            boxShadow: [
              `0 0 10px 2px ${colors[colorIndex].slice(5, -1)}`,
              `0 0 20px 5px ${colors[colorIndex].slice(5, -1)}`,
              `0 0 10px 2px ${colors[colorIndex].slice(5, -1)}`
            ],
          }}
          transition={{
            boxShadow: {
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut"
            },
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className={`absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] ${colors[colorIndex].replace("from-", "bg-")}`}
        ></motion.div>

        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-black/95"></div>
      </div>

      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
};
