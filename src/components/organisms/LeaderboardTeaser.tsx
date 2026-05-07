/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  RiTrophyFill,
  RiMedalFill,
  RiAwardFill,
} from "@remixicon/react";
import * as Button from "@/components/ui/button";
import Eyebrow from "@/components/atoms/Eyebrow";
import PlayerAvatar from "@/components/molecules/PlayerAvatar";
import { API_URL } from "@/lib/env";
import type {
  LeaderboardRow,
  LeaderboardType,
} from "@/components/organisms/LeaderboardTable";

const PODIUM = [
  { icon: RiTrophyFill, color: "text-yellow-400", bg: "bg-yellow-500/10", ring: "ring-yellow-500/30" },
  { icon: RiMedalFill, color: "text-zinc-300", bg: "bg-zinc-400/10", ring: "ring-zinc-400/30" },
  { icon: RiAwardFill, color: "text-amber-700", bg: "bg-amber-700/10", ring: "ring-amber-700/30" },
];

const SCORE_TONE: Record<LeaderboardType, string> = {
  respects: "text-success-base",
  shrooms: "text-error-base",
  honey: "text-warning-base",
};

function score(row: LeaderboardRow, type: LeaderboardType): string {
  if (type === "honey") return Number(row.honey ?? 0).toLocaleString("fr-FR");
  const value = Number(row.weighted ?? row.count ?? 0);
  return value.toFixed(1);
}

function PodiumRow({
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
  const p = PODIUM[rank - 1];
  const Icon = p.icon;

  const inner = (
    <div className="flex items-center gap-3 px-4 py-3">
      <span
        className={twMerge(
          "inline-flex size-8 shrink-0 items-center justify-center rounded-full ring-1",
          p.bg,
          p.ring,
        )}
      >
        <Icon className={twMerge("size-3.5", p.color)} />
      </span>

      <PlayerAvatar
        avatarUrl={row.avatarUrl}
        username={row.username ?? row.gameName ?? undefined}
        fallbackKey={row.puuid}
        size="sm"
      />

      <span className="flex-1 min-w-0 text-label-sm truncate">
        {linked ? (
          <>
            <span className="text-text-strong-950">{row.gameName}</span>
            <span className="text-text-soft-400">#{row.tagLine}</span>
          </>
        ) : (
          <span className="text-text-soft-400 italic">Compte non lié</span>
        )}
      </span>

      <span className={twMerge("text-label-sm tabular-nums", SCORE_TONE[type])}>
        {score(row, type)}
      </span>
    </div>
  );

  if (profileHref) {
    return (
      <Link
        href={profileHref}
        className="block border-b border-stroke-soft-200 last:border-b-0 hover:bg-bg-soft-200 transition-colors"
      >
        {inner}
      </Link>
    );
  }
  return (
    <div className="border-b border-stroke-soft-200 last:border-b-0">
      {inner}
    </div>
  );
}

function Top3({
  title,
  subtitle,
  type,
  rows,
  loading,
}: {
  title: string;
  subtitle: string;
  type: LeaderboardType;
  rows: LeaderboardRow[];
  loading: boolean;
}) {
  return (
    <div className="rounded-20 border border-stroke-soft-200 bg-bg-weak-50 overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-stroke-soft-200">
        <h3 className="text-label-md text-text-strong-950">{title}</h3>
        <p className="text-paragraph-xs text-text-sub-600">{subtitle}</p>
      </div>
      {loading && (
        <div className="px-4 py-6 text-center">
          <p className="text-paragraph-sm text-text-soft-400">Chargement…</p>
        </div>
      )}
      {!loading && rows.length === 0 && (
        <div className="px-4 py-6 text-center">
          <p className="text-paragraph-sm text-text-soft-400">
            Personne sur le podium pour le moment.
          </p>
        </div>
      )}
      {!loading &&
        rows
          .slice(0, 3)
          .map((row, i) => (
            <PodiumRow key={row.puuid} row={row} rank={i + 1} type={type} />
          ))}
    </div>
  );
}

export const LeaderboardTeaser = () => {
  const [shrooms, setShrooms] = useState<LeaderboardRow[]>([]);
  const [respects, setRespects] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`${API_URL}/leaderboard?period=all&type=shrooms&scope=global`)
        .then((r) => r.json())
        .catch(() => ({ rows: [] })),
      fetch(`${API_URL}/leaderboard?period=all&type=respects&scope=global`)
        .then((r) => r.json())
        .catch(() => ({ rows: [] })),
    ]).then(([s, r]) => {
      if (cancelled) return;
      setShrooms(s.rows ?? []);
      setRespects(r.rows ?? []);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="border-b border-stroke-soft-200">
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="max-w-2xl mb-10 flex flex-col gap-3">
          <Eyebrow>Le podium</Eyebrow>
          <h2 className="text-title-h4 md:text-title-h3 text-text-strong-950 !font-[600]">
            Découvre qui domine la communauté{" "}
            <span className="text-primary-base">— et qui la pourrit</span>.
          </h2>
          <p className="text-paragraph-md text-text-sub-600">
            Les héros qu'on respecte d'un côté, les trolls qu'on shroome de
            l'autre. Tes amis y sont peut-être déjà — top 3 all-time, mis à
            jour en temps réel.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Top3
            title="Top respects"
            subtitle="Ceux qu'on aime voir en game"
            type="respects"
            rows={respects}
            loading={loading}
          />
          <Top3
            title="Top shroomers"
            subtitle="Ceux qui sèment le chaos"
            type="shrooms"
            rows={shrooms}
            loading={loading}
          />
        </div>

        <div className="flex justify-center">
          <Button.Root variant="neutral" mode="stroke" size="medium" asChild>
            <Link href="/leaderboard">Voir le classement complet</Link>
          </Button.Root>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardTeaser;
