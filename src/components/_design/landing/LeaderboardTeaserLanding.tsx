/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import Link from "next/link";
import * as React from "react";
import { RiArrowRightLine } from "@remixicon/react";
import { Card } from "../Card";
import { ChampionPortrait } from "../ChampionPortrait";
import { type Tier, type Division } from "../RankBadge";
import { SectionShell } from "../SectionShell";

type TopPlayer = {
  rank: 1 | 2 | 3;
  gameName: string;
  tagLine: string;
  championMain: string;
  tier: Tier;
  division: Division;
  honey: number;
};

const TOP3: TopPlayer[] = [
  { rank: 1, gameName: "Nunch", tagLine: "N7789", championMain: "Yasuo", tier: "diamond", division: "II", honey: 2450 },
  { rank: 2, gameName: "Kassa", tagLine: "EUW", championMain: "Ahri", tier: "platinum", division: "I", honey: 1890 },
  { rank: 3, gameName: "Lyo", tagLine: "FR42", championMain: "LeeSin", tier: "gold", division: "III", honey: 1520 },
];

export function LeaderboardTeaserLanding() {
  return (
    <SectionShell
      eyebrow="— Top joueurs"
      title="Les plus honey de la saison."
      lead="Joue, fais respecter ton ID Riot, gagne du honey. Voilà le top 3 cette semaine."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {TOP3.map((p) => (
          <Card key={p.rank} className="flex items-center gap-4">
            <div className="font-display text-hf-display-2 text-hf-honey-text tabular-nums w-10 text-center">
              {p.rank}
            </div>
            <ChampionPortrait name={p.championMain} variant="circle" size="md" />
            <div className="flex-1 min-w-0">
              <div className="font-display text-hf-display-3 text-hf-navy truncate">
                {p.gameName}
                <span className="text-hf-navy-soft font-body font-normal text-hf-body"> #{p.tagLine}</span>
              </div>
              <div className="text-hf-body-sm text-hf-navy-soft uppercase tracking-[0.1em] font-semibold mt-1">
                {p.tier} {p.division}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-display text-hf-display-3 text-hf-navy tabular-nums">{p.honey.toLocaleString("fr-FR")}</div>
              <div className="text-hf-body-sm text-hf-honey-text font-semibold">honey</div>
            </div>
          </Card>
        ))}
      </div>
      <Link
        href="/leaderboard"
        className="inline-flex items-center gap-2 text-hf-body font-semibold text-hf-navy hover:text-hf-honey-text transition-colors"
      >
        Voir le leaderboard complet
        <RiArrowRightLine className="size-4" />
      </Link>
    </SectionShell>
  );
}
