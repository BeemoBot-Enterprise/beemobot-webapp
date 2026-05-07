/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { cn } from "@/lib/design/cn";
import { ChampionPortrait } from "./ChampionPortrait";

export interface MatchCardProps {
  outcome: "win" | "loss";
  champion: string;
  role?: string;
  kda: { k: number; d: number; a: number };
  durationMin: number;
  queue?: string;
  when?: string;
  className?: string;
}

export function MatchCard({
  outcome,
  champion,
  role,
  kda,
  durationMin,
  queue,
  when,
  className,
}: MatchCardProps) {
  const ratio = ((kda.k + kda.a) / Math.max(1, kda.d)).toFixed(2);
  const winLossClass = outcome === "win" ? "border-l-hf-win" : "border-l-hf-loss";
  const outcomeText = outcome === "win" ? "VICTOIRE" : "DÉFAITE";
  const outcomeColor = outcome === "win" ? "text-hf-win" : "text-hf-loss";
  return (
    <div
      className={cn(
        "rounded-hf-card border border-hf-line bg-hf-surface border-l-[4px] p-4 flex items-center gap-4",
        winLossClass,
        className,
      )}
    >
      <ChampionPortrait name={champion} variant="square" size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className={cn("text-hf-eyebrow uppercase font-bold tracking-[0.15em]", outcomeColor)}>
            {outcomeText}
          </span>
          {queue ? <span className="text-hf-body-sm text-hf-navy-soft">· {queue}</span> : null}
        </div>
        <div className="font-display text-hf-display-3 text-hf-navy">
          {champion}
          {role ? <span className="text-hf-navy-soft text-hf-body ml-2 font-body font-normal">{role}</span> : null}
        </div>
      </div>
      <div className="text-right">
        <div className="font-display text-hf-display-3 tabular-nums">
          {kda.k}<span className="text-hf-navy-soft">/</span>{kda.d}<span className="text-hf-navy-soft">/</span>{kda.a}
        </div>
        <div className="text-hf-body-sm text-hf-navy-soft">
          {ratio} KDA · {durationMin} min{when ? ` · ${when}` : ""}
        </div>
      </div>
    </div>
  );
}
