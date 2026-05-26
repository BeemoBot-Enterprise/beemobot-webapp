/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import {
  RiTrophyFill,
  RiMedalFill,
  RiAwardFill,
  RiArrowRightSLine,
} from "@remixicon/react";
import PlayerAvatar from "@/components/molecules/PlayerAvatar";

export type LeaderboardType = "respects" | "shrooms" | "honey";

export interface LeaderboardRow {
  puuid: string;
  gameName: string | null;
  tagLine: string | null;
  username?: string | null;
  avatarUrl?: string | null;
  discordId?: string | null;
  count?: number;
  weighted?: number;
  honey?: number;
}

const SCORE_LABEL: Record<LeaderboardType, string> = {
  respects: "Respects",
  shrooms: "Shrooms",
  honey: "Honey",
};

const SCORE_TONE: Record<LeaderboardType, string> = {
  respects: "text-hf-win",
  shrooms: "text-hf-loss",
  honey: "text-hf-honey-text",
};

function getScore(row: LeaderboardRow, type: LeaderboardType): string {
  if (type === "honey") {
    return Number(row.honey ?? 0).toLocaleString("fr-FR");
  }
  const value = Number(row.weighted ?? row.count ?? 0);
  return value.toFixed(1);
}

const PODIUM = [
  {
    icon: RiTrophyFill,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    ring: "ring-yellow-500/30",
  },
  {
    icon: RiMedalFill,
    color: "text-zinc-300",
    bg: "bg-zinc-400/10",
    ring: "ring-zinc-400/30",
  },
  {
    icon: RiAwardFill,
    color: "text-amber-700",
    bg: "bg-amber-700/10",
    ring: "ring-amber-700/30",
  },
];

function RankCell({ rank }: { rank: number }) {
  if (rank <= 3) {
    const p = PODIUM[rank - 1];
    const Icon = p.icon;
    return (
      <span
        className={twMerge(
          "inline-flex size-9 items-center justify-center rounded-full ring-1",
          p.bg,
          p.ring,
        )}
      >
        <Icon className={twMerge("size-4", p.color)} />
      </span>
    );
  }
  return (
    <span className="inline-flex size-9 items-center justify-center rounded-full bg-hf-surface-alt text-label-sm text-hf-navy-soft tabular-nums">
      {rank}
    </span>
  );
}

function PlayerRow({
  row,
  rank,
  type,
}: {
  row: LeaderboardRow;
  rank: number;
  type: LeaderboardType;
}) {
  const linked = !!row.gameName;
  const profileHref = linked ? `/u/${row.gameName}-${row.tagLine}` : null;

  const inner = (
    <div className="flex items-center gap-4 px-4 py-3">
      <RankCell rank={rank} />

      <PlayerAvatar
        avatarUrl={row.avatarUrl}
        username={row.username ?? row.gameName ?? undefined}
        fallbackKey={row.puuid}
        size="md"
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {linked ? (
          <span className="text-label-sm text-hf-navy truncate">
            {row.gameName}
            <span className="text-hf-navy-soft">#{row.tagLine}</span>
          </span>
        ) : (
          <span className="text-label-sm text-hf-navy-soft italic">
            Compte non lié
          </span>
        )}
        {row.username && row.username !== row.gameName && (
          <span className="text-paragraph-xs text-hf-navy-soft truncate">
            @{row.username}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span
          className={twMerge(
            "text-label-md tabular-nums",
            SCORE_TONE[type],
          )}
        >
          {getScore(row, type)}
        </span>
        <span className="hidden sm:inline text-paragraph-xs text-hf-navy-soft">
          {SCORE_LABEL[type].toLowerCase()}
        </span>
      </div>

      {linked && (
        <RiArrowRightSLine className="hidden sm:block size-4 text-hf-navy-soft transition-transform group-hover:translate-x-0.5 group-hover:text-hf-navy" />
      )}
    </div>
  );

  if (profileHref) {
    return (
      <Link
        href={profileHref}
        className="group block border-b border-hf-line last:border-b-0 hover:bg-hf-surface-alt transition-colors"
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className="border-b border-hf-line last:border-b-0">
      {inner}
    </div>
  );
}

export function LeaderboardTable({
  rows,
  type,
}: {
  rows: LeaderboardRow[];
  type: LeaderboardType;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-hf-card-lg border border-hf-line bg-hf-surface p-12 text-center">
        <p className="text-paragraph-sm text-hf-navy-soft">
          Personne sur le podium pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-hf-card-lg border border-hf-line bg-hf-surface overflow-hidden">
      {rows.map((row, i) => (
        <PlayerRow key={row.puuid} row={row} rank={i + 1} type={type} />
      ))}
    </div>
  );
}

export default LeaderboardTable;
