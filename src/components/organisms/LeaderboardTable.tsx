/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import Link from "next/link";

interface Row {
  puuid: string;
  gameName: string | null;
  tagLine: string | null;
  count?: number;
  weighted?: number;
  honey?: number;
}

export function LeaderboardTable({ rows, type }: { rows: Row[]; type: "respects" | "shrooms" | "honey" }) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="text-gray-400 border-b border-gray-700/30">
          <th className="py-3">#</th>
          <th>Joueur</th>
          <th className="text-right">{type === "honey" ? "🍯 Honey" : type === "respects" ? "⭐ Respects" : "🍄 Shrooms"}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.puuid} className="border-b border-gray-800/30 hover:bg-[#1a1d28]/50">
            <td className="py-2 text-gray-500">{i + 1}</td>
            <td>
              {r.gameName ? (
                <Link href={`/u/${r.gameName}-${r.tagLine}`} className="text-white hover:text-blue-400">
                  {r.gameName}#{r.tagLine}
                </Link>
              ) : (
                <span className="text-gray-500">Compte non lié</span>
              )}
            </td>
            <td className="text-right text-yellow-300">
              {type === "honey" ? Number(r.honey) : Number(r.weighted ?? r.count).toFixed(1)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
