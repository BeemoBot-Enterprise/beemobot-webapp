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
    "relative font-semibold rounded-lg transition-all duration-200 overflow-hidden";

  const variantStyles = {
    blue: "bg-[#00A0FF] hover:bg-[#1AADFF] text-white",
    gold: "bg-[#FFD700] hover:bg-[#FFDD33] text-[#0A0A0F]",
    honey: "bg-[#F5A623] hover:bg-[#F7B34C] text-[#0A0A0F]",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const glowStyles = {
    blue: glow ? "shadow-md hover:shadow-lg" : "",
    gold: glow ? "shadow-md hover:shadow-lg" : "",
    honey: glow ? "shadow-md hover:shadow-lg" : "",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        glowStyles[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
