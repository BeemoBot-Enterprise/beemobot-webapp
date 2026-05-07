/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { cn } from "@/lib/design/cn";

export type Tier =
  | "iron"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "emerald"
  | "diamond"
  | "master"
  | "grandmaster"
  | "challenger";

export type Division = "I" | "II" | "III" | "IV";

export interface RankBadgeProps {
  tier: Tier;
  division?: Division;
  lp?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_PX = { sm: 56, md: 80, lg: 120 } as const;

const EMBLEM_BASE =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem";

export function RankBadge({ tier, division, lp, size = "md", className }: RankBadgeProps) {
  const px = SIZE_PX[size];
  const hasDivision = !["master", "grandmaster", "challenger"].includes(tier);
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${EMBLEM_BASE}/emblem-${tier}.png`}
        alt={`Rank emblem ${tier}`}
        width={px}
        height={px}
        loading="lazy"
        className="object-contain"
      />
      <div className="text-hf-eyebrow uppercase tracking-[0.15em] font-bold text-hf-navy">
        {tier}
        {hasDivision && division ? ` ${division}` : ""}
      </div>
      {typeof lp === "number" ? (
        <div className="text-hf-body-sm text-hf-navy-soft tabular-nums">{lp} LP</div>
      ) : null}
    </div>
  );
}
