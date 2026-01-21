"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DiamondBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "blue" | "gold" | "honey";
  size?: "sm" | "md" | "lg";
}

export function DiamondBadge({
  children,
  className,
  variant = "blue",
  size = "md",
}: DiamondBadgeProps) {
  const sizeStyles = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const bgColors = {
    blue: "bg-[var(--hextech-blue)]",
    gold: "bg-[var(--hextech-gold)]",
    honey: "bg-[var(--beemo-honey)]",
  };

  const textColors = {
    blue: "text-white",
    gold: "text-[var(--bg-void)]",
    honey: "text-[var(--bg-void)]",
  };

  const glowStyles = {
    blue: "shadow-hextech",
    gold: "shadow-gold",
    honey: "shadow-honey",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className={cn(
        "relative flex items-center justify-center clip-diamond",
        sizeStyles[size],
        bgColors[variant],
        textColors[variant],
        glowStyles[variant],
        className
      )}
    >
      <span className="rotate-0 font-bold text-center">{children}</span>
    </motion.div>
  );
}
