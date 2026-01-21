"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowingTextProps {
  children: React.ReactNode;
  variant?: "blue" | "gold" | "honey";
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  animate?: boolean;
}

export function GlowingText({
  children,
  variant = "blue",
  as: Component = "span",
  className,
  animate = true,
}: GlowingTextProps) {
  const glowStyles = {
    blue: "text-[var(--hextech-blue)] text-glow-blue",
    gold: "text-[var(--hextech-gold)] text-glow-gold",
    honey: "text-[var(--beemo-honey)] text-glow-honey",
  };

  if (animate) {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(glowStyles[variant], "animate-glow-pulse", className)}
      >
        <Component className={cn(glowStyles[variant], className)}>
          {children}
        </Component>
      </motion.span>
    );
  }

  return (
    <Component className={cn(glowStyles[variant], className)}>
      {children}
    </Component>
  );
}
