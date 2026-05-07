/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { cn } from "@/lib/design/cn";

const DDRAGON_VERSION = "15.1.1";

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
        className={cn("relative overflow-hidden rounded-hf-card-lg border border-hf-line", className)}
        style={{ width: w, aspectRatio: "16 / 9" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${name}_0.jpg`}
          alt={`Splash art ${name}`}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    );
  }
  const px = SQUARE_PX[size];
  const radius = variant === "circle" ? "rounded-full" : "rounded-md";
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${name}.png`}
      alt={`Portrait ${name}`}
      width={px}
      height={px}
      loading="lazy"
      className={cn(radius, "object-cover border border-hf-line", className)}
    />
  );
}
