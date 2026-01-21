"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HexButtonProps {
  variant?: "blue" | "gold" | "honey";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function HexButton({
  variant = "blue",
  size = "md",
  glow = true,
  className,
  children,
  onClick,
  disabled,
  type = "button",
}: HexButtonProps) {
  const baseStyles =
    "relative font-semibold rounded-lg transition-all duration-300 overflow-hidden";

  const variantStyles = {
    blue: "bg-[#00A0FF] hover:bg-[#33B3FF] text-white",
    gold: "bg-[#FFD700] hover:bg-[#FFE54C] text-[#0A0A0F]",
    honey: "bg-[#F5A623] hover:bg-[#FFE066] text-[#0A0A0F]",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const glowStyles = {
    blue: glow ? "shadow-hextech hover:shadow-hextech-lg" : "",
    gold: glow ? "shadow-gold hover:shadow-gold-lg" : "",
    honey: glow ? "shadow-honey hover:shadow-gold-lg" : "",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        glowStyles[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
}
