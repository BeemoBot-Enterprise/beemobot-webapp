"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HexagonFrameProps {
  children: React.ReactNode;
  className?: string;
  variant?: "blue" | "gold" | "honey";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

export function HexagonFrame({
  children,
  className,
  variant = "blue",
  size = "md",
  glow = false,
}: HexagonFrameProps) {
  const sizeStyles = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const borderColors = {
    blue: "border-[var(--hextech-blue)]",
    gold: "border-[var(--hextech-gold)]",
    honey: "border-[var(--beemo-honey)]",
  };

  const glowStyles = {
    blue: glow ? "shadow-hextech" : "",
    gold: glow ? "shadow-gold" : "",
    honey: glow ? "shadow-honey" : "",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "relative flex items-center justify-center",
        sizeStyles[size],
        className
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className={cn(
          "absolute inset-0 w-full h-full",
          glowStyles[variant]
        )}
      >
        <defs>
          <linearGradient id={`hexGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor={
                variant === "blue"
                  ? "var(--hextech-blue)"
                  : variant === "gold"
                  ? "var(--hextech-gold)"
                  : "var(--beemo-honey)"
              }
            />
            <stop
              offset="100%"
              stopColor={
                variant === "blue"
                  ? "var(--hextech-blue-glow)"
                  : variant === "gold"
                  ? "var(--hextech-gold-light)"
                  : "var(--beemo-honey-light)"
              }
            />
          </linearGradient>
        </defs>
        <polygon
          points="50,2 95,27 95,73 50,98 5,73 5,27"
          fill="var(--bg-surface)"
          stroke={`url(#hexGradient-${variant})`}
          strokeWidth="2"
        />
      </svg>
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </motion.div>
  );
}
