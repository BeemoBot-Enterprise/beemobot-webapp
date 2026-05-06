"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface BeeIconProps {
  className?: string;
  size?: number;
}

export function BeeIcon({ className, size = 24 }: BeeIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge("inline-block", className)}
    >
      {/* Wings */}
      <ellipse
        cx="20"
        cy="22"
        rx="12"
        ry="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <ellipse
        cx="44"
        cy="22"
        rx="12"
        ry="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Body */}
      <ellipse cx="32" cy="38" rx="16" ry="20" fill="currentColor" opacity="0.2" />
      <ellipse
        cx="32"
        cy="38"
        rx="16"
        ry="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Stripes */}
      <rect x="16" y="30" width="32" height="3" fill="currentColor" rx="1.5" />
      <rect x="16" y="38" width="32" height="3" fill="currentColor" rx="1.5" />
      <rect x="16" y="46" width="32" height="3" fill="currentColor" rx="1.5" />
      {/* Antennae */}
      <line
        x1="28"
        y1="18"
        x2="24"
        y2="10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="36"
        y1="18"
        x2="40"
        y2="10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="8" r="2.5" fill="currentColor" />
      <circle cx="40" cy="8" r="2.5" fill="currentColor" />
    </svg>
  );
}
