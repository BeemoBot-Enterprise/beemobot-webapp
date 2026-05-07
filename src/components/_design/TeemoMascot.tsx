/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import Image from "next/image";
import * as React from "react";
import { BEEMO } from "@/assets/images";
import { cn } from "@/lib/design/cn";

export interface TeemoMascotProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  alt?: string;
}

const SIZES = {
  sm: 80,
  md: 160,
  lg: 240,
  xl: 320,
} as const;

export function TeemoMascot({ size = "md", className, alt = "" }: TeemoMascotProps) {
  const px = SIZES[size];
  return (
    <div className={cn("relative inline-block", className)} style={{ width: px, height: px }}>
      <Image
        src={BEEMO.character}
        alt={alt}
        fill
        sizes={`${px}px`}
        priority={size === "xl"}
        className="object-contain"
      />
    </div>
  );
}
