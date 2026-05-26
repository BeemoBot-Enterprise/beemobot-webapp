/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import * as React from "react";

// Petite jarre de miel — affichée à gauche du compteur honey pour donner
// du poids visuel à la monnaie principale du système. SVG pour scaler net
// sur retina sans dépendance externe.
export function HoneyPot({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* Drips */}
      <path
        d="M16 14 C 16 17, 13 17, 13 20"
        stroke="var(--hf-honey)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M32 14 C 32 17, 35 17, 35 20"
        stroke="var(--hf-honey)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Rim */}
      <rect
        x="8"
        y="12"
        width="32"
        height="6"
        rx="2"
        fill="var(--hf-honey)"
        stroke="var(--hf-navy)"
        strokeWidth="1.5"
      />
      {/* Body */}
      <path
        d="M10 18 L 38 18 L 36 40 C 36 41.5, 34.5 43, 33 43 L 15 43 C 13.5 43, 12 41.5, 12 40 Z"
        fill="var(--hf-honey-soft)"
        stroke="var(--hf-navy)"
        strokeWidth="1.5"
      />
      {/* Label HONEY */}
      <rect
        x="14"
        y="26"
        width="20"
        height="9"
        rx="1.5"
        fill="var(--hf-honey)"
        stroke="var(--hf-navy)"
        strokeWidth="1.2"
      />
      <text
        x="24"
        y="33"
        fontSize="6.5"
        fontWeight="800"
        textAnchor="middle"
        fill="var(--hf-navy)"
        fontFamily="ui-sans-serif, system-ui"
        letterSpacing="0.5"
      >
        HONEY
      </text>
      {/* Drop */}
      <ellipse cx="24" cy="9" rx="2.5" ry="3.5" fill="var(--hf-honey)" />
    </svg>
  );
}
