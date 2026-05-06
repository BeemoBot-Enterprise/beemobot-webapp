/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import Link from "next/link";
import { Card } from "@/components/atoms/Card";
import { twMerge } from "tailwind-merge";

export type LeaderboardType = "respects" | "shrooms" | "honey";

export interface LeaderboardRow {
  puuid: string;
  gameName: string | null;
  tagLine: string | null;
  count?: number;
  weighted?: number;
  honey?: number;
}

const SCORE_LABEL: Record<LeaderboardType, string> = {
  respects: "Respects",
  shrooms: "Shrooms",
  honey: "Honey",
};

function getScore(row: LeaderboardRow, type: LeaderboardType): string {
  if (type === "honey") {
    return Number(row.honey ?? 0).toLocaleString("fr-FR");
  }
  const value = Number(row.weighted ?? row.count ?? 0);
  return value.toFixed(1);
}

export function LeaderboardTable({
  rows,
  type,
}: {
  rows: LeaderboardRow[];
  type: LeaderboardType;
}) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-text-muted">
            <th className="w-16 text-left p-3 font-medium">#</th>
            <th className="text-left p-3 font-medium">Joueur</th>
            <th className="text-right p-3 font-medium">{SCORE_LABEL[type]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const rank = i + 1;
            return (
              <tr
                key={row.puuid}
                className="border-b border-border last:border-0 hover:bg-surface-hover"
              >
                <td
                  className={twMerge(
                    "p-3 font-semibold",
                    rank <= 3 ? "text-accent-gold" : "text-text-muted",
                  )}
                >
                  {rank}
                </td>
                <td className="p-3">
                  {row.gameName ? (
                    <Link
                      href={`/u/${row.gameName}-${row.tagLine}`}
                      className="text-text hover:text-accent transition-colors"
                    >
                      {row.gameName}
                      <span className="text-text-muted">#{row.tagLine}</span>
                    </Link>
                  ) : (
                    <span className="text-text-muted">Compte non lié</span>
                  )}
                </td>
                <td className="p-3 text-right text-text">
                  {getScore(row, type)}
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={3} className="p-6 text-center text-text-muted">
                Aucun résultat.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}

export default LeaderboardTable;
