"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowOrbProps {
  className?: string;
  variant?: "blue" | "gold" | "honey" | "cyan" | "purple";
  size?: "sm" | "md" | "lg" | "xl";
  blur?: boolean;
  animate?: boolean;
}

export function GlowOrb({
  className,
  variant = "blue",
  size = "md",
  blur = true,
  animate = true,
}: GlowOrbProps) {
  const sizeStyles = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96",
    xl: "w-[500px] h-[500px]",
  };

  const colorStyles = {
    blue: "bg-[#00A0FF]",
    gold: "bg-[#FFD700]",
    honey: "bg-[#F5A623]",
    cyan: "bg-[#00E5CC]",
    purple: "bg-[#9B59E6]",
  };

  const baseClasses = cn(
    "absolute rounded-full opacity-30 pointer-events-none",
    sizeStyles[size],
    colorStyles[variant],
    blur && "blur-3xl",
    className
  );

  if (animate) {
    return (
      <motion.div
        className={baseClasses}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
      />
    );
  }

  return <div className={baseClasses} />;
}
