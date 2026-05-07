/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { API_URL } from "@/lib/env";
import Eyebrow from "@/components/atoms/Eyebrow";
import {
  LeaderboardTable,
  type LeaderboardRow,
  type LeaderboardType,
} from "@/components/organisms/LeaderboardTable";

const TYPES: { value: LeaderboardType; label: string }[] = [
  { value: "respects", label: "Respects" },
  { value: "shrooms", label: "Shrooms" },
  { value: "honey", label: "Honey" },
];

const PERIODS: { value: "week" | "month" | "all"; label: string }[] = [
  { value: "week", label: "Cette semaine" },
  { value: "month", label: "Ce mois" },
  { value: "all", label: "All-time" },
];

export default function LeaderboardPage() {
  const [type, setType] = useState<LeaderboardType>("respects");
  const [period, setPeriod] = useState<"week" | "month" | "all">("week");
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/leaderboard?period=${period}&type=${type}&scope=global`)
      .then((r) => r.json())
      .then((d) => setRows(d.rows ?? []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [period, type]);

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="flex flex-col gap-3 mb-10">
        <Eyebrow>Leaderboard</Eyebrow>
        <h1 className="text-title-h4 md:text-title-h3 text-text-strong-950 !font-[600]">
          Top des joueurs de la communauté
        </h1>
        <p className="text-paragraph-md text-text-sub-600 max-w-2xl">
          Suis qui sème le chaos, qui collectionne les respects, et qui
          accumule du honey — mis à jour en temps réel.
        </p>
      </div>

      <div className="border-b border-stroke-soft-200 mb-6 flex gap-1">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={twMerge(
              "px-4 py-2.5 text-label-sm transition-colors -mb-px border-b-2",
              type === t.value
                ? "text-text-strong-950 border-primary-base"
                : "text-text-sub-600 hover:text-text-strong-950 border-transparent",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-8">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={twMerge(
              "px-3 py-1.5 rounded-full text-label-xs transition-colors border",
              period === p.value
                ? "bg-bg-weak-50 text-text-strong-950 border-stroke-soft-200"
                : "bg-transparent text-text-sub-600 border-transparent hover:text-text-strong-950 hover:bg-bg-weak-50",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-20 border border-stroke-soft-200 bg-bg-weak-50 p-12 text-center">
          <p className="text-paragraph-sm text-text-sub-600">Chargement…</p>
        </div>
      ) : (
        <LeaderboardTable rows={rows} type={type} />
      )}
    </main>
  );
}
