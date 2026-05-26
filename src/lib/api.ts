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

export interface LolRank {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  winRate: string;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
}

export interface LolChampion {
  championId: number;
  championName: string;
  championImage: string;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
}

export interface LolMatchParticipant {
  championName: string;
  championId: number;
  kills: number;
  deaths: number;
  assists: number;
  totalDamageDealtToChampions: number;
  goldEarned: number;
  champLevel: number;
  totalMinionsKilled: number;
  visionScore: number;
  win: boolean;
  items: number[];
  teamPosition: string;
}

export interface LolMatch {
  matchId: string;
  gameMode: string;
  gameCreation: number;
  gameDuration: number;
  participant: LolMatchParticipant;
}

export interface LolProfile {
  summoner: {
    puuid: string;
    gameName: string;
    tagLine: string;
    profileIconId: number;
    summonerLevel: number;
    revisionDate: number;
  };
  ranks: LolRank[];
  topChampions: LolChampion[];
  recentMatches: LolMatch[];
  totalMatches: number;
}

export type FullProfile = Profile & { lol: LolProfile | null };

// Profil BeemoBot (shrooms/respects/honey) — par PUUID. Tolerant aux 404.
async function fetchBeemoProfile(puuid: string): Promise<Profile | null> {
  const r = await fetch(`${API_URL}/profile/${encodeURIComponent(puuid)}`, {
    cache: "no-store",
  });
  if (!r.ok) return null;
  return r.json();
}

// Profil LoL (summoner + ranks + matches + topChampions) — endpoint Riot.
// Tolerant aux 404 (compte tout neuf qui n'a jamais joué de partie ranked).
async function fetchLolProfile(
  riotId: string,
  region: string,
): Promise<LolProfile | null> {
  const r = await fetch(
    `${API_URL}/lol/summoner/${encodeURIComponent(riotId)}/profile?region=${region}`,
    { cache: "no-store" },
  );
  if (!r.ok) return null;
  return r.json();
}

// Récupère summoner→puuid (pour résoudre le profil BeemoBot) ET les data LoL
// en parallèle. Région par défaut = euw1 si non précisée — TODO : la lire
// depuis le user lié si profile.linked. Pour la soutenance euw1 suffit.
export async function fetchProfileByRiotId(
  gameName: string,
  tagLine: string,
  region = "euw1",
): Promise<FullProfile | null> {
  const riotId = `${gameName}-${tagLine}`;

  // 1) Résoudre le PUUID d'abord — sans lui pas de profil BeemoBot.
  const summonerRes = await fetch(
    `${API_URL}/lol/summoner/${encodeURIComponent(riotId)}?region=${region}`,
    { cache: "no-store" },
  );
  if (!summonerRes.ok) return null;
  const summoner = await summonerRes.json();

  // 2) Beemo + LoL profile en parallèle (le LoL profile re-fetchera le summoner,
  //    c'est négligeable et ça nous évite de dupliquer la composition côté front).
  const [beemo, lol] = await Promise.all([
    fetchBeemoProfile(summoner.puuid),
    fetchLolProfile(riotId, region),
  ]);

  if (!beemo) return null;
  return { ...beemo, lol };
}
