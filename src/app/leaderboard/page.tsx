/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/env";
import { LeaderboardTable } from "@/components/organisms/LeaderboardTable";

const PERIODS = [
  { v: "week", l: "Cette semaine" },
  { v: "month", l: "Ce mois" },
  { v: "all", l: "All-time" },
];
const TYPES = [
  { v: "respects", l: "⭐ Respects" },
  { v: "shrooms", l: "🍄 Shrooms" },
  { v: "honey", l: "🍯 Honey" },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState("week");
  const [type, setType] = useState<"respects" | "shrooms" | "honey">("respects");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/leaderboard?period=${period}&type=${type}&scope=global`)
      .then((r) => r.json())
      .then((d) => setRows(d.rows ?? []))
      .finally(() => setLoading(false));
  }, [period, type]);

  return (
    <main className="min-h-screen bg-[#0f1117] py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🏆 Hall of Fame mondial</h1>
        <div className="flex gap-2 mb-2">
          {PERIODS.map((p) => (
            <button
              key={p.v}
              onClick={() => setPeriod(p.v)}
              className={`px-3 py-1 rounded ${period === p.v ? "bg-blue-600 text-white" : "bg-[#1a1d28] text-gray-400"}`}
            >
              {p.l}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-6">
          {TYPES.map((t) => (
            <button
              key={t.v}
              onClick={() => setType(t.v as any)}
              className={`px-3 py-1 rounded ${type === t.v ? "bg-blue-600 text-white" : "bg-[#1a1d28] text-gray-400"}`}
            >
              {t.l}
            </button>
          ))}
        </div>
        <div className="bg-[#1a1d28] p-6 rounded-xl border border-gray-700/30">
          {loading ? <p className="text-gray-400">Chargement...</p> : <LeaderboardTable rows={rows} type={type} />}
        </div>
      </div>
    </main>
  );
}
