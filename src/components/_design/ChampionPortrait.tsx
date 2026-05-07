/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import Image from "next/image";
import * as React from "react";
import { cn } from "@/lib/design/cn";
import { championIconUrl, championSplashUrl } from "@/lib/ddragon";

export interface ChampionPortraitProps {
  /** Champion key, PascalCase, e.g. "Yasuo", "LeeSin", "MissFortune". */
  name: string;
  variant?: "square" | "circle" | "splash";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SQUARE_PX = { sm: 48, md: 72, lg: 96 } as const;
const SPLASH_W = { sm: 320, md: 480, lg: 640 } as const;

export function ChampionPortrait({
  name,
  variant = "square",
  size = "md",
  className,
}: ChampionPortraitProps) {
  if (variant === "splash") {
    const w = SPLASH_W[size];
    return (
      <div
        className={cn("relative overflow-hidden rounded-hf-card-lg border border-hf-line bg-hf-surface-alt", className)}
        style={{ width: w, aspectRatio: "16 / 9" }}
      >
        <Image
          src={championSplashUrl(name)}
          alt={`Splash art ${name}`}
          fill
          sizes={`${w}px`}
          className="object-cover"
        />
      </div>
    );
  }
  const px = SQUARE_PX[size];
  const radius = variant === "circle" ? "rounded-full" : "rounded-md";
  return (
    <div
      className={cn(radius, "relative overflow-hidden border border-hf-line bg-hf-surface-alt", className)}
      style={{ width: px, height: px }}
    >
      <Image
        src={championIconUrl(name)}
        alt={`Portrait ${name}`}
        fill
        sizes={`${px}px`}
        className="object-cover"
      />
    </div>
  );
}
