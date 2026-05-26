/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import { fetchProfileByRiotId, type LolMatch, type LolRank } from "@/lib/api";
import { notFound } from "next/navigation";
import { Card } from "@/components/_design/Card";
import { Pill } from "@/components/_design/Pill";
import { Eyebrow } from "@/components/_design/Eyebrow";
import { championIconUrl, profileIconUrl } from "@/lib/ddragon";

interface Props {
  params: Promise<{ riotId: string }>;
}

const QUEUE_LABEL: Record<string, string> = {
  RANKED_SOLO_5x5: "Solo/Duo",
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
  return new Date(timestamp).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function kdaRatio(k: number, d: number, a: number): string {
  if (d === 0) return "Perfect";
  return ((k + a) / d).toFixed(2);
}

function RankCard({ rank }: { rank: LolRank }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-2">
        <Eyebrow tone="navy">{QUEUE_LABEL[rank.queueType] ?? rank.queueType}</Eyebrow>
        {rank.hotStreak && <Pill variant="honey">🔥 Hot streak</Pill>}
      </div>
      <div className="font-display text-hf-display-3 text-hf-navy">
        {rank.tier} {rank.rank}
      </div>
      <div className="text-hf-body-sm text-hf-navy-soft mt-1">
        {rank.leaguePoints} LP · {rank.wins}V {rank.losses}D ·{" "}
        <span className="text-hf-navy font-semibold">{rank.winRate}% WR</span>
      </div>
    </Card>
  );
}

function MatchRow({ match }: { match: LolMatch }) {
  const { participant: p } = match;
  const winColor = p.win ? "hf-win" : "hf-loss";
  const cs = p.totalMinionsKilled;
  const csPerMin = (cs / (match.gameDuration / 60)).toFixed(1);

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-hf-card border bg-hf-surface border-l-4 ${
        p.win ? "border-l-hf-win border-hf-line" : "border-l-hf-loss border-hf-line"
      }`}
    >
      {/* Champion icon */}
      <div className="relative shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={championIconUrl(p.championName)}
          alt={p.championName}
          width={56}
          height={56}
          className="rounded-hf-card block"
        />
        <span className="absolute -bottom-1 -right-1 rounded-full bg-hf-navy text-white text-[10px] font-bold size-5 flex items-center justify-center border-2 border-hf-surface">
          {p.champLevel}
        </span>
      </div>

      {/* KDA + champion */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-hf-navy">{p.championName}</span>
          <span className={`text-hf-body-sm font-semibold text-${winColor}`}>
            {p.win ? "Victoire" : "Défaite"}
          </span>
          {POSITION_LABEL[p.teamPosition] && (
            <Pill variant="default" className="text-xs py-0.5 px-2">
              {POSITION_LABEL[p.teamPosition]}
            </Pill>
          )}
        </div>
        <div className="text-hf-body-sm text-hf-navy-soft mt-0.5">
          <span className="text-hf-navy font-semibold">
            {p.kills}/{p.deaths}/{p.assists}
          </span>{" "}
          · KDA {kdaRatio(p.kills, p.deaths, p.assists)} · {cs} CS ({csPerMin}/min)
        </div>
      </div>

      {/* Meta */}
      <div className="hidden sm:flex flex-col items-end text-right shrink-0">
        <div className="text-hf-body-sm font-semibold text-hf-navy">
          {GAME_MODE_LABEL[match.gameMode] ?? match.gameMode}
        </div>
        <div className="text-hf-body-sm text-hf-navy-soft">{formatDuration(match.gameDuration)}</div>
        <div className="text-xs text-hf-navy-soft mt-0.5">{formatRelative(match.gameCreation)}</div>
      </div>
    </div>
  );
}

export default async function PublicProfilePage({ params }: Props) {
  const { riotId } = await params;
  const decoded = decodeURIComponent(riotId);
  const sep = decoded.lastIndexOf("-");
  if (sep < 1) return notFound();
  const gameName = decoded.slice(0, sep);
  const tagLine = decoded.slice(sep + 1);

  const profile = await fetchProfileByRiotId(gameName, tagLine);
  if (!profile) return notFound();

  const lol = profile.lol;
  // Si le compte n'est pas lié dans Beemo, profile.gameName est null — on
  // tombe sur le Riot ID résolu côté LoL pour quand même afficher le nom.
  const displayName = profile.gameName ?? lol?.summoner.gameName ?? gameName;
  const displayTag = profile.tagLine ?? lol?.summoner.tagLine ?? tagLine;
  const netRep = profile.counts.respects - profile.counts.shrooms;
  const netLabel = netRep >= 0 ? `+${netRep}` : `${netRep}`;
  const last4 = (lol?.recentMatches ?? []).slice(0, 4);
  const soloRank = lol?.ranks.find((r) => r.queueType === "RANKED_SOLO_5x5");
  const flexRank = lol?.ranks.find((r) => r.queueType === "RANKED_FLEX_SR");
  const ranks = [soloRank, flexRank].filter(Boolean) as LolRank[];

  return (
    <main className="max-w-[1100px] mx-auto px-6 py-12 flex flex-col gap-10">
      {/* Header */}
      <header className="flex items-start justify-between flex-wrap gap-6">
        <div className="flex items-center gap-5">
          {lol?.summoner && (
            <div className="relative shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profileIconUrl(lol.summoner.profileIconId)}
                alt={`Icône de ${displayName}`}
                width={88}
                height={88}
                className="rounded-hf-card-lg border border-hf-line bg-hf-surface-alt block"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-hf-navy text-white text-xs font-bold px-2 py-0.5 whitespace-nowrap border-2 border-hf-bg">
                Niv. {lol.summoner.summonerLevel}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-1.5 min-w-0">
            <Eyebrow>Profil public</Eyebrow>
            <h1 className="font-display text-hf-display-2 text-hf-navy">
              {displayName}
              <span className="text-hf-navy-soft"> #{displayTag}</span>
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              {profile.linked ? (
                <Pill variant="honey">Compte lié</Pill>
              ) : (
                <Pill variant="default">Compte non lié</Pill>
              )}
              {lol?.totalMatches !== undefined && (
                <span className="text-hf-body-sm text-hf-navy-soft">
                  {lol.totalMatches} matchs trackés
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          <Eyebrow tone="navy">Score net</Eyebrow>
          <div
            className={`font-display text-hf-display-2 mt-1 ${
              netRep > 0 ? "text-hf-win" : netRep < 0 ? "text-hf-loss" : "text-hf-navy"
            }`}
          >
            {netLabel}
          </div>
          <div className="text-hf-body-sm text-hf-navy-soft">respects − shrooms</div>
        </div>
      </header>

      {/* Stats reputation */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <Eyebrow tone="navy">Respects</Eyebrow>
          <div className="font-display text-hf-display-3 text-hf-navy mt-2 tabular-nums">
            {profile.counts.respects}
          </div>
        </Card>
        <Card className="p-5">
          <Eyebrow tone="navy">Shrooms</Eyebrow>
          <div className="font-display text-hf-display-3 text-hf-navy mt-2 tabular-nums">
            {profile.counts.shrooms}
          </div>
        </Card>
        <Card className="p-5 col-span-2 md:col-span-1">
          <Eyebrow tone="navy">Honey</Eyebrow>
          <div className="font-display text-hf-display-3 text-hf-honey-text mt-2 tabular-nums">
            {profile.honey}
          </div>
        </Card>
      </section>

      {/* Ranks */}
      {ranks.length > 0 && (
        <section>
          <h2 className="font-display text-hf-display-3 text-hf-navy mb-4">Classements</h2>
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
          <h2 className="font-display text-hf-display-3 text-hf-navy mb-4">4 derniers matchs</h2>
          <div className="flex flex-col gap-2">
            {last4.map((m) => (
              <MatchRow key={m.matchId} match={m} />
            ))}
          </div>
        </section>
      ) : (
        <Card className="p-6">
          <p className="text-hf-body-sm text-hf-navy-soft">
            Aucun match récent. Joue une partie pour faire apparaître ton historique.
          </p>
        </Card>
      )}

      {/* Récents évènements rep */}
      {profile.recentEvents.length > 0 && (
        <section>
          <h2 className="font-display text-hf-display-3 text-hf-navy mb-4">
            Réputation reçue récemment
          </h2>
          <Card className="p-5">
            <ul className="flex flex-col gap-2">
              {profile.recentEvents.slice(0, 10).map((e) => (
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
                    ×{e.weight} · {formatRelative(new Date(e.created_at).getTime())}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </main>
  );
}
