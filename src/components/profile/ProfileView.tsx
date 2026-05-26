/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 *
 * UI partagée pour le profil joueur. Pure présentation : prend un
 * FullProfile en prop et rend. Réutilisé par /profile (own user) et
 * /profile/[riotId] (public profile). Server-component compatible.
 */

import * as React from "react";
import Link from "next/link";
import type { FullProfile, LolMatch, LolRank } from "@/lib/api";
import { Card } from "@/components/_design/Card";
import { Pill } from "@/components/_design/Pill";
import { Button } from "@/components/_design/Button";
import { Eyebrow } from "@/components/_design/Eyebrow";
import {
  championIconUrl,
  championLoadingUrl,
  profileIconUrl,
} from "@/lib/ddragon";
import { HoneyPot } from "./HoneyPot";
import { CopyProfileLink } from "./CopyProfileLink";

const QUEUE_LABEL: Record<string, string> = {
  RANKED_SOLO_5x5: "Solo / Duo",
  RANKED_FLEX_SR: "Flex 5v5",
};

const POSITION_LABEL: Record<string, string> = {
  TOP: "Top",
  JUNGLE: "Jungle",
  MIDDLE: "Mid",
  BOTTOM: "ADC",
  UTILITY: "Support",
};

const GAME_MODE_LABEL: Record<string, string> = {
  CLASSIC: "Faille",
  ARAM: "ARAM",
  URF: "URF",
  CHERRY: "Arena",
};

// Tier → couleur d'accent (gradient via la classe arbitraire Tailwind).
// On lit du sombre vers le clair pour conserver la lisibilité.
const TIER_ACCENT: Record<string, { from: string; to: string; ink: string }> = {
  IRON: { from: "#3C3437", to: "#6E5F62", ink: "#FFFFFF" },
  BRONZE: { from: "#6E3E15", to: "#A8643A", ink: "#FFFFFF" },
  SILVER: { from: "#6B7280", to: "#C4CBD3", ink: "#0F141A" },
  GOLD: { from: "#A77816", to: "#F0B232", ink: "#0F141A" },
  PLATINUM: { from: "#155E54", to: "#4DC8B4", ink: "#0F141A" },
  EMERALD: { from: "#0F6135", to: "#3BD17E", ink: "#0F141A" },
  DIAMOND: { from: "#1E3A8A", to: "#4FA1FF", ink: "#FFFFFF" },
  MASTER: { from: "#5B21B6", to: "#B569C4", ink: "#FFFFFF" },
  GRANDMASTER: { from: "#7F1D1D", to: "#C8413B", ink: "#FFFFFF" },
  CHALLENGER: { from: "#0EA5E9", to: "#FACC15", ink: "#0F141A" },
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}min ${String(s).padStart(2, "0")}`;
}

function formatRelative(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `il y a ${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `il y a ${diffD}j`;
  return new Date(timestamp).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

function kdaRatio(k: number, d: number, a: number): string {
  if (d === 0) return "Perfect";
  return ((k + a) / d).toFixed(2);
}

function RankCard({ rank }: { rank: LolRank }) {
  const accent = TIER_ACCENT[rank.tier] ?? TIER_ACCENT.GOLD;
  return (
    <div
      className="relative rounded-hf-card-lg p-5 overflow-hidden border border-hf-line"
      style={{
        background: `linear-gradient(135deg, ${accent.from} 0%, ${accent.to} 100%)`,
        color: accent.ink,
      }}
    >
      <div className="absolute -right-8 -bottom-8 size-32 rounded-full bg-white/10 pointer-events-none" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div
            className="text-xs uppercase tracking-widest font-bold opacity-80"
          >
            {QUEUE_LABEL[rank.queueType] ?? rank.queueType}
          </div>
          <div className="font-display text-2xl md:text-3xl font-extrabold mt-1">
            {rank.tier} {rank.rank}
          </div>
          <div className="text-sm opacity-90 mt-2">
            <span className="font-semibold">{rank.leaguePoints} LP</span>
            <span className="opacity-60"> · </span>
            <span>{rank.wins}V {rank.losses}D</span>
            <span className="opacity-60"> · </span>
            <span className="font-semibold">{rank.winRate}% WR</span>
          </div>
        </div>
        {rank.hotStreak && (
          <span className="rounded-full px-2 py-0.5 text-xs font-bold bg-white/20 backdrop-blur-sm">
            🔥 Streak
          </span>
        )}
      </div>
    </div>
  );
}

function MatchRow({ match }: { match: LolMatch }) {
  const { participant: p } = match;
  const winColor = p.win ? "hf-win" : "hf-loss";
  const cs = p.totalMinionsKilled;
  const csPerMin = (cs / (match.gameDuration / 60)).toFixed(1);

  return (
    <div
      className={
        "group relative flex items-center gap-4 p-4 rounded-hf-card border bg-hf-surface " +
        "transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-hf-card-hover " +
        (p.win
          ? "border-l-4 border-l-hf-win border-hf-line"
          : "border-l-4 border-l-hf-loss border-hf-line")
      }
    >
      {/* Champion icon */}
      <div className="relative shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={championIconUrl(p.championName)}
          alt={p.championName}
          width={56}
          height={56}
          className="rounded-hf-card block ring-2 ring-hf-line"
        />
        <span className="absolute -bottom-1 -right-1 rounded-full bg-hf-navy text-white text-[10px] font-bold size-5 flex items-center justify-center border-2 border-hf-surface">
          {p.champLevel}
        </span>
      </div>

      {/* KDA + champion */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-hf-navy">{p.championName}</span>
          <span className={`text-hf-body-sm font-bold text-${winColor}`}>
            {p.win ? "Victoire" : "Défaite"}
          </span>
          {POSITION_LABEL[p.teamPosition] && (
            <span className="text-xs font-semibold text-hf-navy-soft uppercase tracking-wide">
              · {POSITION_LABEL[p.teamPosition]}
            </span>
          )}
        </div>
        <div className="text-hf-body-sm text-hf-navy-soft mt-1">
          <span className="text-hf-navy font-bold tabular-nums">
            {p.kills}/{p.deaths}/{p.assists}
          </span>{" "}
          <span className="text-hf-navy-soft">
            · KDA {kdaRatio(p.kills, p.deaths, p.assists)} · {cs} CS ({csPerMin}/min)
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="hidden sm:flex flex-col items-end text-right shrink-0">
        <div className="text-hf-body-sm font-semibold text-hf-navy">
          {GAME_MODE_LABEL[match.gameMode] ?? match.gameMode}
        </div>
        <div className="text-hf-body-sm text-hf-navy-soft">
          {formatDuration(match.gameDuration)}
        </div>
        <div className="text-xs text-hf-navy-soft mt-0.5">
          {formatRelative(match.gameCreation)}
        </div>
      </div>
    </div>
  );
}

interface StatBoxProps {
  label: string;
  received: number;
  given: number;
  toneReceived?: "win" | "loss" | "honey";
}

function ReputationStat({ label, received, given, toneReceived }: StatBoxProps) {
  const receivedColor =
    toneReceived === "win"
      ? "text-hf-win"
      : toneReceived === "loss"
        ? "text-hf-loss"
        : "text-hf-navy";
  return (
    <Card className="p-5">
      <Eyebrow tone="navy">{label}</Eyebrow>
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-hf-navy-soft font-semibold">
            Reçus
          </div>
          <div
            className={`font-display text-3xl md:text-4xl font-extrabold mt-1 tabular-nums ${receivedColor}`}
          >
            {received}
          </div>
        </div>
        <div className="border-l border-hf-line pl-4">
          <div className="text-xs uppercase tracking-wide text-hf-navy-soft font-semibold">
            Donnés
          </div>
          <div className="font-display text-3xl md:text-4xl font-extrabold mt-1 tabular-nums text-hf-navy-soft">
            {given}
          </div>
        </div>
      </div>
    </Card>
  );
}

interface ProfileViewProps {
  profile: FullProfile;
  /** Riot ID utilisé pour le routing (gameName-tagLine). Fallback affichage. */
  fallbackGameName?: string;
  fallbackTagLine?: string;
  /** Si défini, prend la place du titre principal (cas du profil "Mon profil"
   *  où on connaît le pseudo Discord du visiteur). Le Riot ID passe en
   *  sous-texte. Sur un profil public on n'a pas cette info → on garde le
   *  Riot ID en titre principal. */
  discordName?: string;
  discordAvatarUrl?: string | null;
  /** Affiché en haut à droite si défini ; sert pour les CTA "Paramètres" ou "Lier". */
  ownerActions?: React.ReactNode;
}

export function ProfileView({
  profile,
  fallbackGameName,
  fallbackTagLine,
  discordName,
  discordAvatarUrl,
  ownerActions,
}: ProfileViewProps) {
  // Défense en profondeur : tous les accès passent par des constantes locales
  // avec fallback, parce qu'on a déjà eu un cas où le payload renvoyé par
  // l'API d'un compte tout neuf manquait des champs (e.g. recentEvents).
  const lol = profile.lol;
  const summonerData = lol?.summoner;
  const ranksData = lol?.ranks ?? [];
  const matchesData = lol?.recentMatches ?? [];
  const championsData = lol?.topChampions ?? [];
  const counts = profile.counts ?? { respects: 0, shrooms: 0 };
  const honey = profile.honey ?? 0;
  const recentEvents = profile.recentEvents ?? [];
  const givenRespects = (profile as FullProfile & {
    given?: { respects: number; shrooms: number };
  }).given?.respects ?? 0;
  const givenShrooms = (profile as FullProfile & {
    given?: { respects: number; shrooms: number };
  }).given?.shrooms ?? 0;

  const displayName =
    profile.gameName ?? summonerData?.gameName ?? fallbackGameName ?? "?";
  const displayTag =
    profile.tagLine ?? summonerData?.tagLine ?? fallbackTagLine ?? "?";
  const netRep = counts.respects - counts.shrooms;
  const netLabel = netRep >= 0 ? `+${netRep}` : `${netRep}`;
  const last4 = matchesData.slice(0, 4);
  const soloRank = ranksData.find((r) => r.queueType === "RANKED_SOLO_5x5");
  const flexRank = ranksData.find((r) => r.queueType === "RANKED_FLEX_SR");
  const ranks = [soloRank, flexRank].filter(Boolean) as LolRank[];
  const topChampion = championsData[0];

  return (
    <main className="relative">
      {/* HERO : champion splash blurred en background + dégradé pour la lisibilité */}
      <section className="relative overflow-hidden border-b border-hf-line">
        {topChampion && (
          <div
            aria-hidden
            className="absolute inset-0 opacity-30 dark:opacity-25"
            style={{
              backgroundImage: `url(${championLoadingUrl(topChampion.championName)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(28px) saturate(1.2)",
              transform: "scale(1.15)",
            }}
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, var(--hf-bg) 100%)",
          }}
        />
        <div className="relative max-w-[1100px] mx-auto px-6 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
            <div className="flex items-end gap-5">
              {summonerData ? (
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profileIconUrl(summonerData.profileIconId)}
                    alt={`Icône de ${displayName}`}
                    width={104}
                    height={104}
                    className="rounded-hf-card-lg border-4 border-hf-bg shadow-hf-card block bg-hf-surface-alt"
                  />
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-hf-navy text-white text-xs font-bold px-2.5 py-1 whitespace-nowrap border-2 border-hf-bg shadow-hf-card">
                    Niv. {summonerData.summonerLevel}
                  </span>
                </div>
              ) : discordAvatarUrl ? (
                // Pas (encore) lié à Riot : fallback sur l'avatar Discord pour
                // éviter un hero amputé.
                <div className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={discordAvatarUrl}
                    alt={`Avatar Discord de ${discordName ?? "user"}`}
                    width={104}
                    height={104}
                    className="rounded-hf-card-lg border-4 border-hf-bg shadow-hf-card block bg-hf-surface-alt"
                  />
                </div>
              ) : null}
              <div className="flex flex-col gap-2 min-w-0">
                <Eyebrow>Profil BeemoBot</Eyebrow>
                {discordName ? (
                  // Mon profil : pseudo Discord en titre principal, Riot ID
                  // optionnel en sous-texte (un user n'est pas forcément lié).
                  <>
                    <h1 className="font-display font-extrabold text-hf-display-2 leading-none text-hf-navy">
                      {discordName}
                    </h1>
                    {profile.linked && (
                      <p className="text-hf-body-lg font-semibold text-hf-navy-soft">
                        {displayName}
                        <span className="opacity-70"> #{displayTag}</span>
                      </p>
                    )}
                  </>
                ) : (
                  // Profil public : pas de pseudo Discord exposé par l'API,
                  // on garde le Riot ID en titre.
                  <h1 className="font-display font-extrabold text-hf-display-2 leading-none text-hf-navy">
                    {displayName}
                    <span className="text-hf-navy-soft font-semibold"> #{displayTag}</span>
                  </h1>
                )}
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  {profile.linked ? (
                    <Pill variant="honey">✓ Compte lié</Pill>
                  ) : (
                    <Pill variant="default">Compte non lié</Pill>
                  )}
                  {lol?.totalMatches !== undefined && lol.totalMatches > 0 && (
                    <span className="text-hf-body-sm text-hf-navy-soft">
                      {lol.totalMatches} matchs trackés
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch lg:items-end gap-3">
              <div className="flex flex-wrap items-center gap-2 justify-end">
                <CopyProfileLink riotId={`${displayName}-${displayTag}`} />
                {ownerActions}
              </div>
              {!ownerActions && (
                <div className="rounded-hf-card-lg bg-hf-surface/80 backdrop-blur border border-hf-line px-5 py-3 text-right">
                  <div className="text-xs uppercase tracking-wide text-hf-navy-soft font-bold">
                    Score net
                  </div>
                  <div
                    className={`font-display text-3xl font-extrabold leading-none mt-1 ${
                      netRep > 0
                        ? "text-hf-win"
                        : netRep < 0
                          ? "text-hf-loss"
                          : "text-hf-navy"
                    }`}
                  >
                    {netLabel}
                  </div>
                  <div className="text-xs text-hf-navy-soft mt-1">
                    respects − shrooms
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CORPS */}
      <div className="max-w-[1100px] mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Reputation : 2 stats (respects, shrooms) + 1 honey jar */}
        <section className="grid md:grid-cols-3 gap-4">
          <ReputationStat
            label="Respects"
            received={counts.respects}
            given={givenRespects}
            toneReceived="win"
          />
          <ReputationStat
            label="Shrooms"
            received={counts.shrooms}
            given={givenShrooms}
            toneReceived="loss"
          />
          <Card
            variant="accent"
            className="flex items-center gap-5 !p-5"
          >
            <HoneyPot size={56} />
            <div className="min-w-0">
              <Eyebrow>Honey</Eyebrow>
              <div className="font-display text-4xl md:text-5xl font-extrabold mt-1 leading-none tabular-nums text-hf-honey-text">
                {honey.toLocaleString("fr-FR")}
              </div>
              <div className="text-hf-body-sm text-hf-navy-soft mt-1">
                monnaie du shop
              </div>
            </div>
          </Card>
        </section>

        {/* Net + ratio si pertinent */}
        {counts.respects + counts.shrooms > 0 && (
          <section>
            <Card className="p-5">
              <div className="flex items-center justify-between gap-4 mb-3">
                <Eyebrow tone="navy">Ratio de respect</Eyebrow>
                <span className="text-xs text-hf-navy-soft">
                  {counts.respects}/
                  {counts.respects + counts.shrooms} évènements
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-hf-surface-alt overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(counts.respects /
                        (counts.respects + counts.shrooms)) *
                        100
                        }%`,
                      background:
                        "linear-gradient(90deg, var(--hf-win) 0%, var(--hf-honey) 100%)",
                    }}
                  />
                </div>
                <span className="font-display text-xl font-extrabold text-hf-navy tabular-nums w-14 text-right">
                  {Math.round(
                    (counts.respects /
                      (counts.respects + counts.shrooms)) *
                    100,
                  )}
                  %
                </span>
              </div>
            </Card>
          </section>
        )}

        {/* Ranks */}
        {ranks.length > 0 && (
          <section>
            <h2 className="font-display text-hf-display-3 text-hf-navy mb-4">
              Classements
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {ranks.map((r) => (
                <RankCard key={r.queueType} rank={r} />
              ))}
            </div>
          </section>
        )}

        {/* 4 derniers matchs */}
        {last4.length > 0 ? (
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-display text-hf-display-3 text-hf-navy">
                4 derniers matchs
              </h2>
              {lol?.totalMatches !== undefined && (
                <span className="text-hf-body-sm text-hf-navy-soft">
                  sur {lol.totalMatches} trackés
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {last4.map((m) => (
                <MatchRow key={m.matchId} match={m} />
              ))}
            </div>
          </section>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-hf-body-sm text-hf-navy-soft">
              Aucun match récent. Joue une partie pour faire apparaître ton historique.
            </p>
          </Card>
        )}

        {/* Recent rep */}
        {recentEvents.length > 0 && (
          <section>
            <h2 className="font-display text-hf-display-3 text-hf-navy mb-4">
              Réputation reçue récemment
            </h2>
            <Card className="p-5">
              <ul className="flex flex-col gap-2">
                {recentEvents.slice(0, 10).map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-3 border-b border-hf-line last:border-b-0 pb-2 last:pb-0"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <Pill variant={e.type === "respect" ? "honey" : "default"}>
                        {e.type}
                      </Pill>
                      <code className="text-hf-navy-soft font-mono text-xs truncate">
                        {e.match_id}
                      </code>
                    </span>
                    <span className="text-hf-navy-soft text-xs whitespace-nowrap">
                      ×{e.weight} ·{" "}
                      {formatRelative(new Date(e.created_at).getTime())}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        )}

      </div>
    </main>
  );
}
