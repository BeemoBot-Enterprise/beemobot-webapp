/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { API_URL } from "@/lib/env";
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
      <h1 className="text-3xl font-semibold text-text mb-2">Leaderboard</h1>
      <p className="text-text-muted mb-8">
        Top des joueurs de la communauté.
      </p>

      <div className="border-b border-border mb-6 flex gap-1">
        {TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={twMerge(
              "px-4 py-2 text-sm transition-colors",
              type === t.value
                ? "text-text border-b-2 border-accent -mb-px"
                : "text-text-muted hover:text-text",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={twMerge(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors border",
              period === p.value
                ? "bg-surface text-text border-border"
                : "bg-transparent text-text-muted border-transparent hover:text-text hover:bg-surface",
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-text-muted">Chargement…</p>
      ) : (
        <LeaderboardTable rows={rows} type={type} />
      )}
    </main>
  );
}
