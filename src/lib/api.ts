/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import { API_URL } from "@/lib/env";

export interface Profile {
  puuid: string;
  gameName: string | null;
  tagLine: string | null;
  linked: boolean;
  counts: { respects: number; shrooms: number };
  weighted: { respects: number; shrooms: number };
  honey: number;
  recentEvents: Array<{
    id: number;
    type: "shroom" | "respect";
    giver_puuid: string;
    match_id: string;
    weight: number;
    created_at: string;
  }>;
}

export async function fetchProfileByRiotId(gameName: string, tagLine: string): Promise<Profile | null> {
  const summoner = await fetch(
    `${API_URL}/lol/summoner/${encodeURIComponent(gameName)}-${encodeURIComponent(tagLine)}`,
    { cache: "no-store" }
  );
  if (!summoner.ok) return null;
  const sum = await summoner.json();

  const profile = await fetch(`${API_URL}/profile/${sum.puuid}`, { cache: "no-store" });
  if (!profile.ok) return null;
  return profile.json();
}
