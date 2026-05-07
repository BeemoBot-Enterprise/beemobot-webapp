# Phase 2C — Profile Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign `/profile` (linked + non-linked states) avec le wow-moment du spec : SummonerHeader avec Beemo qui réagit, GamifStats en gros chiffres, RecentMatches W/L colorés (MatchCard de Phase 1), EventsPanel des shrooms/respects récents, et un fallback friendly si le compte n'est pas encore lié.

**Architecture:** 6 nouveaux composants section dans `src/components/_design/profile/`. Le fichier `src/app/profile/ProfileContent.tsx` est réécrit pour conserver le data flow existant (token + `/profile/me` + `/profile/{puuid}`) et ajouter deux nouveaux fetches Riot quand l'utilisateur est lié : `/lol/summoner/{gameName}-{tagLine}/rank` (current rank) et `/lol/summoner/{gameName}-{tagLine}/matches?count=5` (5 dernières games). Public profile `/u/[id]` reste en l'état pour Phase 2D.

**Tech Stack:** Next.js 15 App Router, primitives `_design/` (incluant le `<MatchCard>`), `next/image` pour Discord avatars (déjà whitelisté `cdn.discordapp.com`), Remixicon.

**Spec source:** `docs/superpowers/specs/2026-05-07-redesign-webapp-honey-friendly-design.md` — section "Profil lié — détail".

**Hors scope:** profil public `/u/[id]` (Phase 2D), quirky stats avec comparaisons inter-joueurs (Phase 2D, calcul côté API à brancher), splash art champion main en background du SummonerHeader (deferred — pour Phase 2D quand on aura confirmé la shape `/lol/summoner/.../profile`).

**Open Question (à résoudre dans Task 7):** la shape exacte des réponses `/lol/summoner/.../rank` et `/lol/summoner/.../matches` du beemobot-api. Le plan définit des interfaces conservatrices et un adapter qui supporte plusieurs shapes courantes (Riot raw vs. wrapped). Si la première run en dev révèle un shape incompatible, ajuster l'adapter — mais le rendu doit dégrader gracieusement (empty state) sans casser la page.

---

## File Structure

```
src/
├── components/
│   └── _design/
│       └── profile/                              (CREATE — namespace profile-only)
│           ├── SummonerHeader.tsx                (CREATE)
│           ├── GamifStats.tsx                    (CREATE)
│           ├── MatchesPanel.tsx                  (CREATE)
│           ├── EventsPanel.tsx                   (CREATE)
│           ├── ProfileActions.tsx                (CREATE)
│           ├── NotLinkedCard.tsx                 (CREATE)
│           └── index.ts                          (CREATE — barrel)
└── app/
    └── profile/
        └── ProfileContent.tsx                    (REWRITE — composes new components, adds 2 Riot fetches)
```

The existing `src/app/profile/page.tsx` (Suspense wrapper around `ProfileContent`) is NOT touched. Old structure of ProfileContent (token bootstrap, fetch `/profile/me` + `/profile/{puuid}`, error handling) is preserved.

---

## Task 1 — `<SummonerHeader>`

**Files:**
- Create: `src/components/_design/profile/SummonerHeader.tsx`
- Create: `src/components/_design/profile/index.ts`

The header banner showing the user's Discord avatar (large), Discord username, Riot ID badge if linked, current rank as compact text (TIER + division + LP), and a Beemo bubble with contextual greeting. Background : honey-glow halo + cream surface.

- [ ] **Step 1: Create SummonerHeader.tsx**

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import Image from "next/image";
import * as React from "react";
import { Pill } from "../Pill";
import { TeemoMascot } from "../TeemoMascot";
import { cn } from "@/lib/design/cn";

export interface SummonerRankInfo {
  tier: string;
  division?: string;
  lp: number;
}

export interface SummonerHeaderProps {
  username: string;
  avatarUrl: string | null;
  gameName: string | null;
  tagLine: string | null;
  rank?: SummonerRankInfo | null;
  /** Ratio of respects in (respects + shrooms) — 0..100. Used to choose Beemo's mood. Pass `undefined` if no events yet. */
  respectRatio?: number;
  className?: string;
}

const FALLBACK_AVATAR = "https://cdn.discordapp.com/embed/avatars/0.png";

function pickBeemoLine(name: string, ratio?: number): string {
  if (ratio === undefined) return `Salut ${name} ! Joue une game pour bouger ton ratio.`;
  if (ratio >= 75) return `Salut ${name} ! T'es vraiment respecté dans le coin.`;
  if (ratio >= 50) return `Yo ${name} ! Tu fais bonne impression.`;
  if (ratio >= 25) return `Eh ${name}, t'as planté quelques champis hein…`;
  return `${name}, jpp tu trolles que dalle.`;
}

export function SummonerHeader({
  username,
  avatarUrl,
  gameName,
  tagLine,
  rank,
  respectRatio,
  className,
}: SummonerHeaderProps) {
  const isLinked = !!gameName && !!tagLine;
  const beemoLine = pickBeemoLine(username, respectRatio);
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-hf-card-lg border border-hf-line bg-hf-surface p-6 lg:p-10",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 size-[420px] rounded-full"
        style={{ background: "radial-gradient(circle, var(--hf-honey-glow) 0%, transparent 60%)" }}
      />
      <div className="relative grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 items-center">
        <div className="size-24 lg:size-28 rounded-full border-2 border-hf-line bg-hf-surface-alt overflow-hidden shrink-0 relative">
          <Image
            src={avatarUrl || FALLBACK_AVATAR}
            alt={`Avatar ${username}`}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-hf-display-2 text-hf-navy truncate">{username}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {isLinked ? (
              <Pill variant="riot">
                {gameName}
                <span className="opacity-60">#{tagLine}</span>
              </Pill>
            ) : (
              <Pill variant="default">Compte Riot non lié</Pill>
            )}
            {rank ? (
              <Pill variant="honey">
                {rank.tier}
                {rank.division ? ` ${rank.division}` : ""} · {rank.lp} LP
              </Pill>
            ) : null}
          </div>
        </div>
        <div className="flex items-end gap-3 lg:flex-col lg:items-end">
          <div className="relative max-w-[220px] rounded-hf-card border border-hf-line bg-hf-surface-alt px-4 py-3 text-hf-body-sm text-hf-navy leading-snug">
            <span className="block">{beemoLine}</span>
            <span
              aria-hidden
              className="absolute -bottom-2 left-6 size-4 rotate-45 border-r border-b border-hf-line bg-hf-surface-alt"
            />
          </div>
          <TeemoMascot size="sm" alt="" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create barrel**

Create `src/components/_design/profile/index.ts`:

```ts
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 *
 * Honey Friendly profile sections — composed in src/app/profile/ProfileContent.tsx.
 */
export { SummonerHeader } from "./SummonerHeader";
export type { SummonerHeaderProps, SummonerRankInfo } from "./SummonerHeader";
```

- [ ] **Step 3: Verify TS**

```bash
cd /Users/jeremy/Documents/Code/ynov/ydays/beemobot-webapp
pnpm tsc --noEmit
```

Should pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/_design/profile/SummonerHeader.tsx src/components/_design/profile/index.ts
git commit -m "feat(webapp): SummonerHeader — Discord avatar + Riot pill + rank + Beemo bubble"
```

---

## Task 2 — `<GamifStats>`

**Files:**
- Create: `src/components/_design/profile/GamifStats.tsx`
- Modify: `src/components/_design/profile/index.ts`

Four stat cards in a 2- or 4-col grid : Honey, Respects, Shrooms, Score net (respects − shrooms, colored win/loss).

- [ ] **Step 1: Create the file**

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { Card } from "../Card";
import { StatNumber } from "../StatNumber";

export interface GamifStatsProps {
  honey: number;
  respects: number;
  shrooms: number;
  className?: string;
}

export function GamifStats({ honey, respects, shrooms, className }: GamifStatsProps) {
  const net = respects - shrooms;
  const netLabel = net >= 0 ? `+${net}` : `${net}`;
  const netTone: "default" | "win" | "loss" = net > 0 ? "win" : net < 0 ? "loss" : "default";
  return (
    <section className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className ?? ""}`}>
      <Card>
        <StatNumber value={honey.toLocaleString("fr-FR")} label="Honey" />
      </Card>
      <Card>
        <StatNumber value={respects} label="Respects reçus" />
      </Card>
      <Card>
        <StatNumber value={shrooms} label="Shrooms reçus" />
      </Card>
      <Card>
        <StatNumber value={netLabel} label="Score net" tone={netTone} />
      </Card>
    </section>
  );
}
```

- [ ] **Step 2: Append barrel**

```ts
export { GamifStats } from "./GamifStats";
export type { GamifStatsProps } from "./GamifStats";
```

- [ ] **Step 3: Verify TS**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/_design/profile/GamifStats.tsx src/components/_design/profile/index.ts
git commit -m "feat(webapp): GamifStats — 4 cards Honey/Respects/Shrooms/Score net"
```

---

## Task 3 — `<MatchesPanel>`

**Files:**
- Create: `src/components/_design/profile/MatchesPanel.tsx`
- Modify: `src/components/_design/profile/index.ts`

Wraps a list of `<MatchCard>` (Phase 1) with a SectionShell-style header. If `matches` is empty or undefined, shows a friendly empty state.

- [ ] **Step 1: Create the file**

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { Card } from "../Card";
import { Eyebrow } from "../Eyebrow";
import { MatchCard } from "../MatchCard";

export interface MatchesPanelMatch {
  matchId: string;
  outcome: "win" | "loss";
  champion: string;
  role?: string;
  kills: number;
  deaths: number;
  assists: number;
  durationMin: number;
  queue?: string;
  when?: string;
}

export interface MatchesPanelProps {
  matches: MatchesPanelMatch[];
  className?: string;
}

export function MatchesPanel({ matches, className }: MatchesPanelProps) {
  return (
    <section className={className}>
      <header className="mb-4 flex items-center justify-between gap-4">
        <div>
          <Eyebrow className="mb-1">— Recent matches</Eyebrow>
          <h2 className="font-display text-hf-display-3 text-hf-navy">5 dernières games</h2>
        </div>
      </header>
      {matches.length === 0 ? (
        <Card>
          <p className="text-hf-body-sm text-hf-navy-soft">
            Pas de games récentes à afficher. Lance une partie et reviens !
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((m) => (
            <MatchCard
              key={m.matchId}
              outcome={m.outcome}
              champion={m.champion}
              role={m.role}
              kda={{ k: m.kills, d: m.deaths, a: m.assists }}
              durationMin={m.durationMin}
              queue={m.queue}
              when={m.when}
            />
          ))}
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Append barrel**

```ts
export { MatchesPanel } from "./MatchesPanel";
export type { MatchesPanelProps, MatchesPanelMatch } from "./MatchesPanel";
```

- [ ] **Step 3: Verify TS**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/_design/profile/MatchesPanel.tsx src/components/_design/profile/index.ts
git commit -m "feat(webapp): MatchesPanel — 5 dernières games avec MatchCard"
```

---

## Task 4 — `<EventsPanel>`

**Files:**
- Create: `src/components/_design/profile/EventsPanel.tsx`
- Modify: `src/components/_design/profile/index.ts`

A scrollable list of recent shrooms/respects events. Each row has a colored Pill (respect = honey, shroom = warning-style), the match id (truncated), the weight, and a relative date.

- [ ] **Step 1: Create the file**

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { Card } from "../Card";
import { Eyebrow } from "../Eyebrow";
import { Pill } from "../Pill";

export interface EventsPanelEvent {
  id: number;
  type: "shroom" | "respect";
  match_id: string;
  weight: number;
  created_at: string;
}

export interface EventsPanelProps {
  events: EventsPanelEvent[];
  className?: string;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  } catch {
    return iso;
  }
}

export function EventsPanel({ events, className }: EventsPanelProps) {
  return (
    <section className={className}>
      <header className="mb-4">
        <Eyebrow className="mb-1">— Activité</Eyebrow>
        <h2 className="font-display text-hf-display-3 text-hf-navy">Évènements récents</h2>
      </header>
      <Card>
        {events.length === 0 ? (
          <p className="text-hf-body-sm text-hf-navy-soft">
            Aucun évènement encore. Joue, fais-toi des amis.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-hf-line max-h-80 overflow-y-auto -my-2">
            {events.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-2">
                <span className="flex items-center gap-2 min-w-0">
                  <Pill variant={e.type === "respect" ? "honey" : "default"}>{e.type}</Pill>
                  <code className="text-hf-body-sm text-hf-navy-soft font-mono truncate">{e.match_id}</code>
                </span>
                <span className="text-hf-body-sm text-hf-navy-soft whitespace-nowrap shrink-0">
                  ×{e.weight} · {formatDate(e.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
```

- [ ] **Step 2: Append barrel**

```ts
export { EventsPanel } from "./EventsPanel";
export type { EventsPanelProps, EventsPanelEvent } from "./EventsPanel";
```

- [ ] **Step 3: Verify TS**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/_design/profile/EventsPanel.tsx src/components/_design/profile/index.ts
git commit -m "feat(webapp): EventsPanel — feed d'évènements shroom/respect récents"
```

---

## Task 5 — `<ProfileActions>`

**Files:**
- Create: `src/components/_design/profile/ProfileActions.tsx`
- Modify: `src/components/_design/profile/index.ts`

A row of three actions in the footer of the profile : "Voir mon profil public" (Link to `/u/{gameName-tagLine}` if linked, hidden otherwise), "Paramètres" (Link to `/settings`), "Modifier mon Riot ID" (Link to `/auth/link` if linked, "Lier mon compte Riot" if not — but the not-linked CTA goes to `<NotLinkedCard>` instead, so this component assumes `linked = true`).

- [ ] **Step 1: Create the file**

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import Link from "next/link";
import * as React from "react";
import { Button } from "../Button";

export interface ProfileActionsProps {
  /** "GameName-TagLine" string. Used to build the public profile URL. */
  riotIdSlug: string;
  className?: string;
}

export function ProfileActions({ riotIdSlug, className }: ProfileActionsProps) {
  return (
    <section className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      <Link href={`/u/${encodeURIComponent(riotIdSlug)}`} className="inline-flex">
        <Button size="md" variant="outline">
          Voir mon profil public
        </Button>
      </Link>
      <Link href="/settings" className="inline-flex">
        <Button size="md" variant="ghost">
          Paramètres
        </Button>
      </Link>
      <Link href="/auth/link" className="inline-flex">
        <Button size="md" variant="ghost">
          Modifier mon Riot ID
        </Button>
      </Link>
    </section>
  );
}
```

- [ ] **Step 2: Append barrel**

```ts
export { ProfileActions } from "./ProfileActions";
export type { ProfileActionsProps } from "./ProfileActions";
```

- [ ] **Step 3: Verify TS**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/_design/profile/ProfileActions.tsx src/components/_design/profile/index.ts
git commit -m "feat(webapp): ProfileActions — row d'actions profil (public, settings, riot ID)"
```

---

## Task 6 — `<NotLinkedCard>`

**Files:**
- Create: `src/components/_design/profile/NotLinkedCard.tsx`
- Modify: `src/components/_design/profile/index.ts`

Empty-state card shown when the user is logged in but hasn't linked a Riot account yet. TeemoMascot md, big H2, lead, primary CTA "Lier mon compte Riot", and 3 mini "ce que tu débloques" hints (stats Riot · honey gagnable · classement).

- [ ] **Step 1: Create the file**

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import Link from "next/link";
import * as React from "react";
import { RiBarChartFill, RiTrophyFill, RiHonourFill, type RemixiconComponentType } from "@remixicon/react";
import { Button } from "../Button";
import { Card } from "../Card";
import { TeemoMascot } from "../TeemoMascot";

const PERKS: { icon: RemixiconComponentType; title: string; description: string }[] = [
  { icon: RiBarChartFill, title: "Stats Riot", description: "Rank, KDA, masteries depuis l'API officielle." },
  { icon: RiTrophyFill, title: "Leaderboard", description: "Apparais dans les tops shrooms / respects / honey." },
  { icon: RiHonourFill, title: "Honey", description: "Gagne du honey en jouant et dépense au shop." },
];

export interface NotLinkedCardProps {
  className?: string;
}

export function NotLinkedCard({ className }: NotLinkedCardProps) {
  return (
    <Card variant="accent" className={className}>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
        <div>
          <h1 className="font-display text-hf-display-2 text-hf-navy mb-3">
            Lie ton compte Riot pour activer ton profil.
          </h1>
          <p className="text-hf-body-lg text-hf-navy-soft max-w-xl mb-6">
            Sans ça, impossible de cumuler des shrooms, respects ou honey. Setup en moins d'une minute.
          </p>
          <Link href="/auth/link" className="inline-flex">
            <Button size="lg" variant="primary">
              Lier mon compte Riot
            </Button>
          </Link>
        </div>
        <div className="flex justify-center md:justify-end">
          <TeemoMascot size="md" alt="" />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
        {PERKS.map((perk) => {
          const Icon = perk.icon;
          return (
            <div key={perk.title} className="flex items-start gap-3 rounded-hf-card border border-hf-line bg-hf-surface px-4 py-3">
              <div className="size-10 rounded-hf-card bg-hf-honey-glow text-hf-honey-text flex items-center justify-center shrink-0">
                <Icon className="size-5" />
              </div>
              <div>
                <div className="font-display text-hf-body font-bold text-hf-navy">{perk.title}</div>
                <div className="text-hf-body-sm text-hf-navy-soft">{perk.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
```

- [ ] **Step 2: Append barrel**

```ts
export { NotLinkedCard } from "./NotLinkedCard";
export type { NotLinkedCardProps } from "./NotLinkedCard";
```

- [ ] **Step 3: Verify TS**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/_design/profile/NotLinkedCard.tsx src/components/_design/profile/index.ts
git commit -m "feat(webapp): NotLinkedCard — empty state pour profil non lié + 3 perks"
```

---

## Task 7 — Rewrite `ProfileContent.tsx` with new components + Riot fetches

**Files:**
- Modify: `src/app/profile/ProfileContent.tsx`

This is the integration task. We preserve the existing data flow (token bootstrap from URL or localStorage, fetch `/profile/me`, fetch `/profile/{puuid}`) and add two new fetches when the user is linked : `/lol/summoner/{gameName}-{tagLine}/rank` and `/lol/summoner/{gameName}-{tagLine}/matches?count=5`. The rank and matches fetches are non-blocking — if they fail or return unexpected shapes, the corresponding sections render an empty state but the rest of the profile still works.

- [ ] **Step 1: Replace ProfileContent.tsx**

Replace ENTIRE content of `src/app/profile/ProfileContent.tsx` with:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/_design/Button";
import { Card } from "@/components/_design/Card";
import {
  SummonerHeader,
  GamifStats,
  MatchesPanel,
  EventsPanel,
  ProfileActions,
  NotLinkedCard,
  type SummonerRankInfo,
  type MatchesPanelMatch,
  type EventsPanelEvent,
} from "@/components/_design/profile";
import { API_URL } from "@/lib/env";

interface DiscordUser {
  id: string;
  username: string;
  avatarUrl: string | null;
  email?: string | null;
  puuid: string | null;
  gameName: string | null;
  tagLine: string | null;
  linked: boolean;
}

interface ApiProfile {
  counts: { respects: number; shrooms: number };
  weighted: { respects: number; shrooms: number };
  honey: number;
  recentEvents: EventsPanelEvent[];
}

const TOKEN_KEY = "beemobot_token";
const USER_KEY = "beemobot_user";

/** Adapter: try several common shapes for the rank endpoint. Returns null if none parse. */
function adaptRank(raw: unknown): SummonerRankInfo | null {
  if (!raw || typeof raw !== "object") return null;
  // Shape A: { soloQueue: { tier, division, lp } }
  const soloA = (raw as { soloQueue?: unknown }).soloQueue;
  if (soloA && typeof soloA === "object") {
    const r = soloA as Record<string, unknown>;
    if (typeof r.tier === "string") {
      return {
        tier: String(r.tier).toUpperCase(),
        division: typeof r.division === "string" ? r.division : typeof r.rank === "string" ? r.rank : undefined,
        lp: Number(r.lp ?? r.leaguePoints ?? 0),
      };
    }
  }
  // Shape B: { tier, division/rank, lp/leaguePoints } directly
  const r = raw as Record<string, unknown>;
  if (typeof r.tier === "string") {
    return {
      tier: String(r.tier).toUpperCase(),
      division: typeof r.division === "string" ? r.division : typeof r.rank === "string" ? r.rank : undefined,
      lp: Number(r.lp ?? r.leaguePoints ?? 0),
    };
  }
  // Shape C: array of league entries — pick the RANKED_SOLO_5x5 one
  if (Array.isArray(raw)) {
    const solo = raw.find((e) => typeof e === "object" && e && (e as { queueType?: string }).queueType === "RANKED_SOLO_5x5");
    if (solo) return adaptRank(solo);
  }
  return null;
}

/** Adapter: best-effort parsing of /lol/.../matches response into MatchesPanelMatch[]. */
function adaptMatches(raw: unknown): MatchesPanelMatch[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((m): MatchesPanelMatch[] => {
    if (!m || typeof m !== "object") return [];
    const r = m as Record<string, unknown>;
    const matchId =
      typeof r.matchId === "string"
        ? r.matchId
        : typeof r.id === "string"
        ? r.id
        : null;
    const championName =
      typeof r.championName === "string"
        ? r.championName
        : typeof r.champion === "string"
        ? r.champion
        : null;
    const win = typeof r.win === "boolean" ? r.win : null;
    if (!matchId || !championName || win === null) return [];
    const kills = Number(r.kills ?? 0);
    const deaths = Number(r.deaths ?? 0);
    const assists = Number(r.assists ?? 0);
    const durationSec = Number(r.gameDuration ?? r.durationSec ?? r.duration ?? 0);
    const ts = Number(r.gameEndTimestamp ?? r.timestamp ?? 0);
    return [
      {
        matchId,
        outcome: win ? "win" : "loss",
        champion: championName,
        role: typeof r.role === "string" ? r.role : typeof r.lane === "string" ? r.lane : undefined,
        kills,
        deaths,
        assists,
        durationMin: Math.max(1, Math.round(durationSec / 60)),
        queue: typeof r.queueLabel === "string" ? r.queueLabel : typeof r.queue === "string" ? r.queue : undefined,
        when: ts > 0 ? formatRelative(ts) : undefined,
      },
    ];
  });
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.round(diff / 60000);
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.round(h / 24);
  if (d < 7) return `il y a ${d}j`;
  return new Date(ts).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export default function ProfileContent() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [rank, setRank] = useState<SummonerRankInfo | null>(null);
  const [matches, setMatches] = useState<MatchesPanelMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      localStorage.setItem(TOKEN_KEY, tokenFromUrl);
      setToken(tokenFromUrl);
      return;
    }
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const userRes = await fetch(`${API_URL}/profile/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!userRes.ok) throw new Error("Token invalide ou expiré.");
        const userData = await userRes.json();
        const nextUser: DiscordUser = {
          id: userData.discordId ?? "0",
          username: userData.username ?? "User",
          avatarUrl: userData.avatarUrl ?? null,
          email: userData.email ?? null,
          puuid: userData.puuid ?? null,
          gameName: userData.gameName ?? null,
          tagLine: userData.tagLine ?? null,
          linked: !!userData.linked,
        };
        setUser(nextUser);
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));

        if (nextUser.puuid) {
          const profileRes = await fetch(`${API_URL}/profile/${encodeURIComponent(nextUser.puuid)}`);
          setProfile(profileRes.ok ? await profileRes.json() : null);
        }

        if (nextUser.linked && nextUser.gameName && nextUser.tagLine) {
          const slug = `${nextUser.gameName}-${nextUser.tagLine}`;
          // Both Riot fetches are best-effort. Failure does not break the page.
          const [rankRes, matchesRes] = await Promise.allSettled([
            fetch(`${API_URL}/lol/summoner/${encodeURIComponent(slug)}/rank`),
            fetch(`${API_URL}/lol/summoner/${encodeURIComponent(slug)}/matches?count=5`),
          ]);
          if (rankRes.status === "fulfilled" && rankRes.value.ok) {
            try { setRank(adaptRank(await rankRes.value.json())); } catch { setRank(null); }
          }
          if (matchesRes.status === "fulfilled" && matchesRes.value.ok) {
            try { setMatches(adaptMatches(await matchesRes.value.json())); } catch { setMatches([]); }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token]);

  if (loading) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 py-12">
        <p className="text-hf-body text-hf-navy-soft">Chargement…</p>
      </main>
    );
  }

  if (!token || !user) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 py-12">
        <Card className="text-center">
          <h1 className="font-display text-hf-display-2 text-hf-navy mb-3">Connexion requise</h1>
          <p className="text-hf-body text-hf-navy-soft mb-6">Connecte-toi avec Discord pour accéder à ton profil.</p>
          <Link
            href={`${API_URL}/auth/discord/redirect`}
            className="inline-flex"
          >
            <Button variant="primary" size="lg">Se connecter avec Discord</Button>
          </Link>
        </Card>
      </main>
    );
  }

  const respects = profile?.counts.respects ?? 0;
  const shrooms = profile?.counts.shrooms ?? 0;
  const honey = profile?.honey ?? 0;
  const totalEvents = respects + shrooms;
  const respectRatio = totalEvents > 0 ? Math.round((respects / totalEvents) * 100) : undefined;
  const events = profile?.recentEvents ?? [];

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-10 lg:py-12 flex flex-col gap-6 lg:gap-8">
      {error ? (
        <Card className="border-hf-loss">
          <p className="text-hf-body text-hf-loss">{error}</p>
        </Card>
      ) : null}

      <SummonerHeader
        username={user.username}
        avatarUrl={user.avatarUrl}
        gameName={user.gameName}
        tagLine={user.tagLine}
        rank={rank}
        respectRatio={respectRatio}
      />

      {!user.linked ? (
        <NotLinkedCard />
      ) : (
        <>
          <GamifStats honey={honey} respects={respects} shrooms={shrooms} />
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-8">
            <MatchesPanel matches={matches} />
            <EventsPanel events={events} />
          </div>
          <ProfileActions riotIdSlug={`${user.gameName}-${user.tagLine}`} />
        </>
      )}
    </main>
  );
}
```

Notes:
- The page is `"use client"` — same as before (token from URL/localStorage, fetches client-side).
- The `useSearchParams` hook is preserved for the OAuth callback flow that ships with `?token=…`.
- Loading and not-logged-in states are simplified Cards with new HF tokens (no AlignUI tokens).
- Error toast renders inline (red border Card) above the SummonerHeader if `error` is set.
- The non-linked branch shows ONLY the NotLinkedCard (no GamifStats / matches / events).
- The two new Riot fetches use `Promise.allSettled` so neither blocks the other and a failure on one doesn't break the page.
- Adapter functions `adaptRank` / `adaptMatches` defensively parse multiple plausible shapes — see the Open Question note in the plan header.

- [ ] **Step 2: Verify TS**

```bash
cd /Users/jeremy/Documents/Code/ynov/ydays/beemobot-webapp
pnpm tsc --noEmit
```

Should pass.

- [ ] **Step 3: Smoke test the route**

```bash
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/profile
```

Expected: `200` (will render the "Connexion requise" Card since dev requests carry no token).

- [ ] **Step 4: Commit**

```bash
git add src/app/profile/ProfileContent.tsx
git commit -m "feat(webapp): rewrite /profile with Honey Friendly sections + Riot rank/matches fetches"
```

---

## Task 8 — Final verification + screenshots

**Files:**
- None modified — verification only.

- [ ] **Step 1: Build passes**

```bash
cd /Users/jeremy/Documents/Code/ynov/ydays/beemobot-webapp
pnpm build 2>&1 | tail -20
```

Expected: clean build, all routes present, no errors.

- [ ] **Step 2: No-emoji check**

```bash
python3 - <<'PY'
import re, pathlib, sys
emoji = re.compile(r'[\U0001F300-\U0001FAFF☀-➿]')
hits = []
roots = ['src/components/_design/profile', 'src/app/profile/ProfileContent.tsx']
for root in roots:
    p = pathlib.Path(root)
    paths = list(p.rglob('*')) if p.is_dir() else ([p] if p.is_file() else [])
    for f in paths:
        if f.is_file():
            for i, l in enumerate(f.read_text(errors='ignore').splitlines(), 1):
                m = emoji.search(l)
                if m:
                    hits.append((str(f), i, m.group()))
if hits:
    for h in hits: print('{}:{}: {!r}'.format(*h))
    sys.exit(1)
print('OK no emoji')
PY
```

Expected: `OK no emoji`.

- [ ] **Step 3: Restart dev cleanly**

```bash
lsof -i :3000 -t 2>/dev/null | xargs -r kill 2>/dev/null
sleep 2
rm -rf /Users/jeremy/Documents/Code/ynov/ydays/beemobot-webapp/.next
(cd /Users/jeremy/Documents/Code/ynov/ydays/beemobot-webapp && pnpm dev > /tmp/beemobot-dev.log 2>&1 &)
sleep 12
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/profile
```

Expected: `200`.

- [ ] **Step 4: Screenshot — not-logged-in state at desktop**

In Playwright at 1280×900: navigate to `/profile`. Screenshot full page → `docs/superpowers/plans/screenshots/phase2c-profile-not-logged.png`.

- [ ] **Step 5: Screenshot — not-linked-but-logged-in state**

To simulate the not-linked branch without a real Riot account: in Playwright at 1280×900, before navigating to `/profile`, inject a fake token + user via DevTools `localStorage` :

```js
localStorage.setItem("beemobot_token", "fake-dev-token");
localStorage.setItem("beemobot_user", JSON.stringify({
  id: "123",
  username: "DemoUser",
  avatarUrl: null,
  email: null,
  puuid: null,
  gameName: null,
  tagLine: null,
  linked: false,
}));
```

The page will hit `/profile/me` with the fake token and get a 401 — that triggers `error` state and clears the token. Then it renders the "Connexion requise" card again. NOT what we want.

Instead, demonstrate the **NotLinkedCard layout** by viewing it in the demo page is out of scope — and the linked layout requires a real account. **Skip this step**: just take 2 screenshots (not-logged-in desktop + linked layout when manually verified by Jeremy with his real account).

If there's no easy way to capture a logged-in screenshot during automated verification, document this as : "verified manually after merge with `dura.jeremy@proton.me` Discord account linked to `Nunch#N7789`."

- [ ] **Step 6: Commit screenshots**

```bash
cd /Users/jeremy/Documents/Code/ynov/ydays/beemobot-webapp
git add docs/superpowers/plans/screenshots/phase2c-*.png
git commit -m "docs(webapp): Phase 2C visual validation screenshots"
```

---

## Definition of Done

- 6 new section components in `src/components/_design/profile/`, exported via the local `index.ts`
- `src/app/profile/ProfileContent.tsx` rewritten — keeps the existing token + `/profile/me` + `/profile/{puuid}` flow, adds non-blocking `/lol/summoner/.../rank` and `/lol/summoner/.../matches?count=5` fetches when `user.linked`
- Linked branch composes : SummonerHeader + GamifStats + MatchesPanel + EventsPanel (side by side on lg) + ProfileActions
- Non-linked branch shows : SummonerHeader + NotLinkedCard
- Not-logged-in state shows : "Connexion requise" Card + Discord button
- `pnpm build` passes
- No emoji in any of the new files
- `/profile` returns 200 in all 3 states (not-logged, linked, not-linked)
- Screenshot of not-logged state committed

## What's NOT in this plan (future phases)

- Public profile `/u/[id]` (Phase 2D — reuses these components but external view, no edit actions)
- Quirky stats panel (Phase 2D — needs API support for peer comparison or client-side calculation from existing data)
- Splash art champion main as background of SummonerHeader (Phase 2D — needs to confirm `/lol/summoner/.../profile` shape returns champion data)
- Integration of the rank-emblem image (`<RankBadge>`) in the header — Phase 2C uses compact text rank in a Pill instead, since RankBadge requires a discrete `Tier` enum (iron|bronze|...|challenger) and the API returns a string we can't always map
- Settings page redesign (Phase 5)
- Other pages (Phases 3-5)
