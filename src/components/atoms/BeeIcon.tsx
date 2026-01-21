"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BeeIconProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

const BeeContent = () => (
  <>
    {/* Wings */}
    <ellipse
      cx="20"
      cy="22"
      rx="12"
      ry="8"
      fill="rgba(255, 255, 255, 0.6)"
      stroke="#00A0FF"
      strokeWidth="1"
    />
    <ellipse
      cx="44"
      cy="22"
      rx="12"
      ry="8"
      fill="rgba(255, 255, 255, 0.6)"
      stroke="#00A0FF"
      strokeWidth="1"
    />
    {/* Body */}
    <ellipse cx="32" cy="38" rx="16" ry="20" fill="#F5A623" />
    {/* Stripes */}
    <rect x="16" y="30" width="32" height="4" fill="#0A0A0F" rx="2" />
    <rect x="16" y="38" width="32" height="4" fill="#0A0A0F" rx="2" />
    <rect x="16" y="46" width="32" height="4" fill="#0A0A0F" rx="2" />
    {/* Face */}
    <circle cx="26" cy="32" r="3" fill="#0A0A0F" />
    <circle cx="38" cy="32" r="3" fill="#0A0A0F" />
    <circle cx="27" cy="31" r="1" fill="white" />
    <circle cx="39" cy="31" r="1" fill="white" />
    {/* Smile */}
    <path
      d="M 28 36 Q 32 40 36 36"
      stroke="#0A0A0F"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    {/* Antennae */}
    <line
      x1="28"
      y1="18"
      x2="24"
      y2="10"
      stroke="#F5A623"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="36"
      y1="18"
      x2="40"
      y2="10"
      stroke="#F5A623"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="24" cy="8" r="3" fill="#F5A623" />
    <circle cx="40" cy="8" r="3" fill="#F5A623" />
  </>
);

export function BeeIcon({ className, size = 24, animate = true }: BeeIconProps) {
  if (animate) {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("inline-block", className)}
        animate={{
          y: [0, -5, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
      >
        <BeeContent />
      </motion.svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block", className)}
    >
      <BeeContent />
    </svg>
  );
}
