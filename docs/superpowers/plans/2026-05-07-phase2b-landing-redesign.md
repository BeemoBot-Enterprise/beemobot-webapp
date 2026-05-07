# Phase 2B — Landing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refonte complète de la landing `/` avec 7 sections cousues main avec les composants Honey Friendly de Phase 1 (HeaderHF/FooterHF déjà mis en place globalement en Phase 2A). Le résultat doit avoir du cachet, une cartouche unique répétée, et faire envie d'ajouter Beemobot à son serveur.

**Architecture:** Approche additive : 7 nouveaux composants section dans `src/components/_design/landing/`, chacun responsable d'une section et utilisant exclusivement les primitives `_design/` (Button, Card, Eyebrow, Pill, StatNumber, SectionShell, TeemoMascot, RankBadge, ChampionPortrait, MatchCard). Le fichier `src/app/page.tsx` est réécrit pour les composer. Les anciennes sections `src/components/organisms/HeroSection.tsx`, `StatsSection.tsx`, `FeatureShowcase.tsx`, `IntegrationsSection.tsx`, `LeaderboardTeaser.tsx`, `TeamSection.tsx`, `CTASection.tsx`, `FaqSection.tsx` restent sur disque pour Phase 5 cleanup.

**Tech Stack:** Next.js 15 App Router, React 19, primitives Honey Friendly (`_design/`), `@radix-ui/react-accordion` (déjà installé) pour la FAQ, assets Riot via `next/image` (DDragon CDN whitelistée).

**Spec source:** `docs/superpowers/specs/2026-05-07-redesign-webapp-honey-friendly-design.md` — section "Pages publiques cœur · Landing".

**Hors scope:** wire des données dynamiques (top 3 leaderboard reste hardcodé avec 3 joueurs de démo, à brancher sur l'API en Phase 3 quand on refera le Leaderboard), refonte du profil (Phase 2C), refonte des autres pages (Phases 3-5).

---

## File Structure

```
src/
├── components/
│   └── _design/
│       └── landing/                                (CREATE — namespace landing-only)
│           ├── HeroLanding.tsx                     (CREATE)
│           ├── StatsLanding.tsx                    (CREATE)
│           ├── FeaturesLanding.tsx                 (CREATE)
│           ├── IntegrationsLanding.tsx             (CREATE)
│           ├── LeaderboardTeaserLanding.tsx        (CREATE)
│           ├── FaqLanding.tsx                      (CREATE)
│           ├── CtaLanding.tsx                      (CREATE)
│           └── index.ts                            (CREATE — barrel)
└── app/
    └── page.tsx                                    (MODIFY — rewrite to compose new sections)
```

The 7 landing section components live in their own subfolder (`_design/landing/`) so they don't pollute the root `_design/` namespace. The barrel export keeps imports concise in `page.tsx`.

---

## Task 1 — `<HeroLanding>`

**Files:**
- Create: `src/components/_design/landing/HeroLanding.tsx`
- Create: `src/components/_design/landing/index.ts`

The hero is the first impression. TeemoMascot on the right (xl size), eyebrow pill "Bot live · 320 serveurs", H1 in Bricolage display-1 with a honey-soft surligneur on "League", lead in body-lg, two CTAs (Discord blurple primary + outline "Voir la démo"), social proof footer with 4 avatars + "+12 000 joueurs ont lié leur compte Riot."

- [ ] **Step 1: Create the file**

Create `src/components/_design/landing/HeroLanding.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { RiDiscordFill, RiArrowRightLine } from "@remixicon/react";
import { Button } from "../Button";
import { Pill } from "../Pill";
import { TeemoMascot } from "../TeemoMascot";
import { BOT_INVITE_URL } from "@/lib/env";

export function HeroLanding() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-32 size-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, var(--hf-honey-glow) 0%, transparent 60%)" }}
      />
      <div className="relative mx-auto max-w-[1100px] px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <Pill variant="live" className="mb-7">Bot live · 320 serveurs</Pill>
            <h1 className="font-display text-hf-display-1 text-hf-navy mb-6">
              Le bot Discord que ta guilde{" "}
              <span className="bg-[linear-gradient(180deg,transparent_64%,var(--hf-honey-soft)_64%)] px-1 -mx-1">
                League
              </span>{" "}
              mérite.
            </h1>
            <p className="text-hf-body-lg text-hf-navy-soft max-w-xl mb-8">
              Stats Riot, leaderboards, mini-jeux et un peu de honey à gagner. Setup en 2 minutes,
              sans config.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <a href={BOT_INVITE_URL} target="_blank" rel="noreferrer" className="inline-flex">
                <Button size="lg" variant="primary">
                  <RiDiscordFill className="size-5" />
                  Ajouter à Discord
                </Button>
              </a>
              <a href="#features" className="inline-flex">
                <Button size="lg" variant="outline">
                  Voir la démo
                  <RiArrowRightLine className="size-4" />
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex shrink-0">
                <Avatar gradient="linear-gradient(135deg, #5865F2, #785AF0)" />
                <Avatar gradient="linear-gradient(135deg, #FFD93D, #E5A422)" />
                <Avatar gradient="linear-gradient(135deg, #2DA66B, #1A7A4F)" />
                <Avatar gradient="linear-gradient(135deg, #FF6B6B, #C93838)" />
              </div>
              <p className="text-hf-body-sm text-hf-navy-soft">
                <span className="text-hf-navy font-semibold">+12 000 joueurs</span> ont lié leur compte Riot.
              </p>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <TeemoMascot size="xl" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Avatar({ gradient }: { gradient: string }) {
  return (
    <span
      aria-hidden
      className="inline-block size-7 rounded-full border-2 border-hf-bg -ml-2 first:ml-0"
      style={{ background: gradient }}
    />
  );
}
```

- [ ] **Step 2: Create the barrel**

Create `src/components/_design/landing/index.ts`:

```ts
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 *
 * Honey Friendly landing sections — composed in src/app/page.tsx.
 * Sections added incrementally as they're built.
 */
export { HeroLanding } from "./HeroLanding";
```

- [ ] **Step 3: Verify TS**

```bash
cd /Users/jeremy/Documents/Code/ynov/ydays/beemobot-webapp
pnpm tsc --noEmit
```

Should pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/_design/landing/HeroLanding.tsx src/components/_design/landing/index.ts
git commit -m "feat(webapp): HeroLanding — Teemo mascotte + halo + CTAs Honey Friendly"
```

---

## Task 2 — `<StatsLanding>`

**Files:**
- Create: `src/components/_design/landing/StatsLanding.tsx`
- Modify: `src/components/_design/landing/index.ts`

A clean banner of 3 big stats right after the hero. Each stat lives in a `<Card>` containing a `<StatNumber>`. No SectionShell — this is meant to be punchy and minimal.

- [ ] **Step 1: Create the file**

Create `src/components/_design/landing/StatsLanding.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { Card } from "../Card";
import { StatNumber } from "../StatNumber";

const STATS = [
  { value: "320", unit: "+", label: "Serveurs Discord actifs" },
  { value: "85", unit: "k", label: "Parties LoL indexées" },
  { value: "+87", unit: "%", label: "Engagement serveur" },
] as const;

export function StatsLanding() {
  return (
    <section className="border-y border-hf-line bg-hf-surface">
      <div className="mx-auto max-w-[1100px] px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <StatNumber value={stat.value} unit={stat.unit} label={stat.label} />
          </Card>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Append barrel**

Append to `src/components/_design/landing/index.ts`:

```ts
export { StatsLanding } from "./StatsLanding";
```

- [ ] **Step 3: Verify TS**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/_design/landing/StatsLanding.tsx src/components/_design/landing/index.ts
git commit -m "feat(webapp): StatsLanding — 3 cards stats sous le hero"
```

---

## Task 3 — `<FeaturesLanding>`

**Files:**
- Create: `src/components/_design/landing/FeaturesLanding.tsx`
- Modify: `src/components/_design/landing/index.ts`

Three feature cards in the standard SectionShell cartouche : eyebrow "— Fonctionnalités", title "Tout pour ta communauté.", lead, then a 3-col grid of `<Card variant="interactive">` (each: honey icon background + title + description).

- [ ] **Step 1: Create the file**

Create `src/components/_design/landing/FeaturesLanding.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { RiBarChartFill, RiTrophyFill, RiGamepadFill, type RemixiconComponentType } from "@remixicon/react";
import { Card } from "../Card";
import { SectionShell } from "../SectionShell";

type Feature = {
  icon: RemixiconComponentType;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: RiBarChartFill,
    title: "Profils Riot",
    description: "Rank, KDA, masteries, last games — toutes les stats de tes invocateurs depuis l'API officielle.",
  },
  {
    icon: RiTrophyFill,
    title: "Leaderboards",
    description: "Top shrooms, top respects, top honey — par serveur ou global. Ton classement bouge avec tes games.",
  },
  {
    icon: RiGamepadFill,
    title: "Mini-jeux",
    description: "Trivia LoL, Memory, Minesweeper Teemo, Dodge Skillshot — gagne du honey, dépense-le au shop.",
  },
];

export function FeaturesLanding() {
  return (
    <section id="features">
      <SectionShell
        eyebrow="— Fonctionnalités"
        title="Tout pour ta communauté."
        lead="Les outils dont ta guilde a besoin, sans usine à gaz. Tu invites le bot, tu joues, le reste suit."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} variant="interactive">
                <div className="size-12 rounded-hf-card bg-hf-honey-glow text-hf-honey-text flex items-center justify-center mb-5">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-display text-hf-display-3 text-hf-navy mb-2">{feature.title}</h3>
                <p className="text-hf-body-sm text-hf-navy-soft">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </SectionShell>
    </section>
  );
}
```

- [ ] **Step 2: Append barrel**

```ts
export { FeaturesLanding } from "./FeaturesLanding";
```

- [ ] **Step 3: Verify TS**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/_design/landing/FeaturesLanding.tsx src/components/_design/landing/index.ts
git commit -m "feat(webapp): FeaturesLanding — 3 cards interactives en SectionShell"
```

---

## Task 4 — `<IntegrationsLanding>`

**Files:**
- Create: `src/components/_design/landing/IntegrationsLanding.tsx`
- Modify: `src/components/_design/landing/index.ts`

A horizontal strip with the 4 partner/tech logos (Discord, Riot Games, OP.GG, GitHub), preceded by a small label. Uses the existing `BEEMO`/`LOGO` exports from `src/assets/images`.

- [ ] **Step 1: Create the file**

Create `src/components/_design/landing/IntegrationsLanding.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import Image, { type StaticImageData } from "next/image";
import * as React from "react";
import { LOGO } from "@/assets/images";

const LOGOS: { src: StaticImageData; alt: string }[] = [
  { src: LOGO.discord, alt: "Discord" },
  { src: LOGO.riotGames, alt: "Riot Games" },
  { src: LOGO.opgg, alt: "OP.GG" },
  { src: LOGO.github, alt: "GitHub" },
];

export function IntegrationsLanding() {
  return (
    <section className="bg-hf-surface-alt border-y border-hf-line">
      <div className="mx-auto max-w-[1100px] px-6 py-10">
        <p className="text-hf-eyebrow uppercase tracking-[0.15em] font-bold text-hf-navy-soft text-center mb-6">
          Construit avec et pour
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 grayscale opacity-70">
          {LOGOS.map((logo) => (
            <div key={logo.alt} className="relative h-10 w-28">
              <Image src={logo.src} alt={logo.alt} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Append barrel**

```ts
export { IntegrationsLanding } from "./IntegrationsLanding";
```

- [ ] **Step 3: Verify TS**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/_design/landing/IntegrationsLanding.tsx src/components/_design/landing/index.ts
git commit -m "feat(webapp): IntegrationsLanding — strip de logos partenaires"
```

---

## Task 5 — `<LeaderboardTeaserLanding>`

**Files:**
- Create: `src/components/_design/landing/LeaderboardTeaserLanding.tsx`
- Modify: `src/components/_design/landing/index.ts`

A SectionShell showing the top 3 honey-collectors. Each podium card has rank number, ChampionPortrait (the player's main), gameName#tagLine, RankBadge (small), honey count. Hardcoded sample data for Phase 2B — gets wired to real API in Phase 3 (Leaderboard page).

- [ ] **Step 1: Create the file**

Create `src/components/_design/landing/LeaderboardTeaserLanding.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import Link from "next/link";
import * as React from "react";
import { RiArrowRightLine } from "@remixicon/react";
import { Card } from "../Card";
import { ChampionPortrait } from "../ChampionPortrait";
import { RankBadge, type Tier, type Division } from "../RankBadge";
import { SectionShell } from "../SectionShell";

type TopPlayer = {
  rank: 1 | 2 | 3;
  gameName: string;
  tagLine: string;
  championMain: string;
  tier: Tier;
  division: Division;
  honey: number;
};

const TOP3: TopPlayer[] = [
  { rank: 1, gameName: "Nunch", tagLine: "N7789", championMain: "Yasuo", tier: "diamond", division: "II", honey: 2450 },
  { rank: 2, gameName: "Kassa", tagLine: "EUW", championMain: "Ahri", tier: "platinum", division: "I", honey: 1890 },
  { rank: 3, gameName: "Lyo", tagLine: "FR42", championMain: "LeeSin", tier: "gold", division: "III", honey: 1520 },
];

export function LeaderboardTeaserLanding() {
  return (
    <SectionShell
      eyebrow="— Top joueurs"
      title="Les plus honey de la saison."
      lead="Joue, fais respecter ton ID Riot, gagne du honey. Voilà le top 3 cette semaine."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {TOP3.map((p) => (
          <Card key={p.rank} className="flex items-center gap-4">
            <div className="font-display text-hf-display-2 text-hf-honey-text tabular-nums w-10 text-center">
              {p.rank}
            </div>
            <ChampionPortrait name={p.championMain} variant="circle" size="md" />
            <div className="flex-1 min-w-0">
              <div className="font-display text-hf-display-3 text-hf-navy truncate">
                {p.gameName}
                <span className="text-hf-navy-soft font-body font-normal text-hf-body"> #{p.tagLine}</span>
              </div>
              <div className="text-hf-body-sm text-hf-navy-soft uppercase tracking-[0.1em] font-semibold mt-1">
                {p.tier} {p.division}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-display text-hf-display-3 text-hf-navy tabular-nums">{p.honey.toLocaleString("fr-FR")}</div>
              <div className="text-hf-body-sm text-hf-honey-text font-semibold">honey</div>
            </div>
          </Card>
        ))}
      </div>
      <Link
        href="/leaderboard"
        className="inline-flex items-center gap-2 text-hf-body font-semibold text-hf-navy hover:text-hf-honey-text transition-colors"
      >
        Voir le leaderboard complet
        <RiArrowRightLine className="size-4" />
      </Link>
    </SectionShell>
  );
}
```

Note: this hardcodes 3 sample players for Phase 2B. The Leaderboard page (Phase 3) will introduce a `usePublicLeaderboard()` hook fetched from the API; at that point this component will accept a `players` prop and consume it. We don't pre-build that interface here — YAGNI.

- [ ] **Step 2: Append barrel**

```ts
export { LeaderboardTeaserLanding } from "./LeaderboardTeaserLanding";
```

- [ ] **Step 3: Verify TS**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/_design/landing/LeaderboardTeaserLanding.tsx src/components/_design/landing/index.ts
git commit -m "feat(webapp): LeaderboardTeaserLanding — top 3 honey avec ChampionPortrait + rank"
```

---

## Task 6 — `<FaqLanding>`

**Files:**
- Create: `src/components/_design/landing/FaqLanding.tsx`
- Modify: `src/components/_design/landing/index.ts`

FAQ accordion using `@radix-ui/react-accordion` (already installed). 6 questions covering account linking, bot invitation, honey/respects mechanics, regions, and pricing. Single accordion (any item open at a time).

- [ ] **Step 1: Create the file**

Create `src/components/_design/landing/FaqLanding.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
"use client";
import * as Accordion from "@radix-ui/react-accordion";
import { RiAddLine } from "@remixicon/react";
import * as React from "react";
import { SectionShell } from "../SectionShell";

const FAQ = [
  {
    id: "link-riot",
    question: "Comment je lie mon compte Riot ?",
    answer:
      "Connecte-toi via Discord, va sur /auth/link, entre ton Riot ID (GameName#Tag), choisis ta région. On te demande de changer ton icône d'invocateur pour celle qu'on affiche — c'est la vérif anti-usurpation. Tu remets ton ancienne icône après.",
  },
  {
    id: "free",
    question: "C'est gratuit ?",
    answer:
      "Oui. Le bot et toutes les fonctionnalités sont gratuits. Le shop te demande du honey gagné en jouant, jamais d'euros.",
  },
  {
    id: "regions",
    question: "Quelles régions Riot sont supportées ?",
    answer:
      "Toutes : EUW, EUNE, NA, BR, JP, KR, LA, LAS, OC, TR, RU. La Riot API est requêtée avec le bon routing à chaque fois.",
  },
  {
    id: "shroom-respect",
    question: "C'est quoi un shroom et un respect ?",
    answer:
      "Un respect = un autre joueur lié reconnaît une bonne game à toi. Un shroom = l'inverse, façon Teemo. Les deux remontent ton profil et alimentent les leaderboards. Le honey est la monnaie globale qui en découle.",
  },
  {
    id: "permissions",
    question: "Pourquoi le bot demande la permission Administrateur ?",
    answer:
      "Parce qu'il gère ses propres rôles (top shrooms, top respects), envoie dans les channels que tu choisis, et écoute les events pour les commandes slash. Tu peux affiner les permissions après l'invitation si tu veux.",
  },
  {
    id: "data",
    question: "Quelles données vous stockez sur moi ?",
    answer:
      "Ton ID Discord, ton avatar, ton Riot PUUID, ton GameName#Tag, et l'historique de tes shrooms/respects/honey. Pas d'email sauf si tu le donnes explicitement. Suppression sur demande dans /settings.",
  },
];

export function FaqLanding() {
  return (
    <SectionShell eyebrow="— FAQ" title="Questions fréquentes." lead="Les trucs qu'on nous demande le plus souvent.">
      <Accordion.Root type="single" collapsible className="flex flex-col gap-3 max-w-3xl">
        {FAQ.map((item) => (
          <Accordion.Item
            key={item.id}
            value={item.id}
            className="rounded-hf-card-lg border border-hf-line bg-hf-surface overflow-hidden"
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex items-center justify-between w-full px-6 py-5 text-left font-display text-hf-display-3 text-hf-navy hover:bg-hf-surface-alt transition-colors">
                <span>{item.question}</span>
                <RiAddLine
                  aria-hidden
                  className="size-6 text-hf-honey-text shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-45"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
              <div className="px-6 pb-5 text-hf-body text-hf-navy-soft leading-relaxed">{item.answer}</div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </SectionShell>
  );
}
```

Note: `accordion-down` and `accordion-up` keyframes come from `tailwindcss-animate` (installed in Phase 2A). They're enabled out of the box.

- [ ] **Step 2: Append barrel**

```ts
export { FaqLanding } from "./FaqLanding";
```

- [ ] **Step 3: Verify TS**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/_design/landing/FaqLanding.tsx src/components/_design/landing/index.ts
git commit -m "feat(webapp): FaqLanding — 6 questions avec Radix Accordion"
```

---

## Task 7 — `<CtaLanding>`

**Files:**
- Create: `src/components/_design/landing/CtaLanding.tsx`
- Modify: `src/components/_design/landing/index.ts`

Final CTA banner before footer. Honey-glow background, TeemoMascot lg on the side, big H2, lead, primary Discord button.

- [ ] **Step 1: Create the file**

Create `src/components/_design/landing/CtaLanding.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { RiDiscordFill } from "@remixicon/react";
import { Button } from "../Button";
import { TeemoMascot } from "../TeemoMascot";
import { BOT_INVITE_URL } from "@/lib/env";

export function CtaLanding() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -bottom-32 size-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, var(--hf-honey-glow) 0%, transparent 60%)" }}
      />
      <div className="relative mx-auto max-w-[1100px] px-6 py-20 lg:py-28">
        <div className="rounded-hf-card-lg border border-hf-line bg-hf-surface px-8 py-12 lg:px-14 lg:py-16 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <h2 className="font-display text-hf-display-2 text-hf-navy mb-4">
              Prêt à booster ta guilde ?
            </h2>
            <p className="text-hf-body-lg text-hf-navy-soft max-w-lg mb-7">
              Setup en 2 minutes. Aucune config. Ton serveur va kiffer, et toi aussi.
            </p>
            <a href={BOT_INVITE_URL} target="_blank" rel="noreferrer" className="inline-flex">
              <Button size="lg" variant="primary">
                <RiDiscordFill className="size-5" />
                Ajouter à Discord
              </Button>
            </a>
          </div>
          <div className="flex justify-center lg:justify-end">
            <TeemoMascot size="lg" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Append barrel**

```ts
export { CtaLanding } from "./CtaLanding";
```

- [ ] **Step 3: Verify TS**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/_design/landing/CtaLanding.tsx src/components/_design/landing/index.ts
git commit -m "feat(webapp): CtaLanding — banner finale avec Teemo + Discord CTA"
```

---

## Task 8 — Replace `app/page.tsx` with new sections

**Files:**
- Modify: `src/app/page.tsx`

Compose the 7 new section components in the right order. The old organisms imports go away; old organism files stay on disk for Phase 5 cleanup.

- [ ] **Step 1: Replace page.tsx content**

Replace ENTIRE content of `src/app/page.tsx` with:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import {
  HeroLanding,
  StatsLanding,
  FeaturesLanding,
  IntegrationsLanding,
  LeaderboardTeaserLanding,
  FaqLanding,
  CtaLanding,
} from "@/components/_design/landing";

export default function HomePage() {
  return (
    <>
      <HeroLanding />
      <StatsLanding />
      <FeaturesLanding />
      <IntegrationsLanding />
      <LeaderboardTeaserLanding />
      <FaqLanding />
      <CtaLanding />
    </>
  );
}
```

Notes:
- The page is now a Server Component (no `"use client"`). `FaqLanding` is the only `"use client"` section (Radix Accordion). Other sections are server-renderable.
- The old organisms (`HeroSection`, `StatsSection`, `FeatureShowcase`, `IntegrationsSection`, `LeaderboardTeaser`, `TeamSection`, `FaqSection`, `CTASection`) are no longer imported. They stay on disk — Phase 5 will delete them.

- [ ] **Step 2: Verify TS**

```bash
cd /Users/jeremy/Documents/Code/ynov/ydays/beemobot-webapp
pnpm tsc --noEmit
```

Should pass.

- [ ] **Step 3: Smoke test the route**

```bash
# Assume dev server running on port 3000. Otherwise start it first.
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
```

Expected: `200`.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(webapp): rewrite landing page with Honey Friendly sections"
```

---

## Task 9 — Final verification + screenshots

**Files:**
- None modified — verification only.

- [ ] **Step 1: Build passes**

```bash
cd /Users/jeremy/Documents/Code/ynov/ydays/beemobot-webapp
pnpm build 2>&1 | tail -25
```

Expected: clean build, no errors. The `/` route should now show as a small static page (the heavy work is in the section components, but they're tree-shaken efficiently).

- [ ] **Step 2: No-emoji check on the new files**

```bash
python3 - <<'PY'
import re, pathlib, sys
emoji = re.compile(r'[\U0001F300-\U0001FAFF☀-➿]')
hits = [(str(p), i, m.group())
  for root in ('src/components/_design/landing', 'src/app/page.tsx')
  for path in [pathlib.Path(root)]
  for p in (path.rglob('*') if path.is_dir() else [path] if path.is_file() else [])
  if p.is_file()
  for i, l in enumerate(p.read_text(errors='ignore').splitlines(), 1)
  for m in [emoji.search(l)] if m]
if hits:
    for h in hits: print('{}:{}: {!r}'.format(*h))
    sys.exit(1)
print('OK no emoji')
PY
```

Expected: `OK no emoji`.

- [ ] **Step 3: Restart dev server cleanly to flush stale `.next` from `pnpm build`**

```bash
lsof -i :3000 -t 2>/dev/null | xargs -r kill 2>/dev/null
sleep 2
rm -rf /Users/jeremy/Documents/Code/ynov/ydays/beemobot-webapp/.next
(cd /Users/jeremy/Documents/Code/ynov/ydays/beemobot-webapp && pnpm dev > /tmp/beemobot-dev.log 2>&1 &)
sleep 12
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
```

Expected: `200`.

- [ ] **Step 4: Screenshot — desktop**

Use Playwright MCP. Set viewport to 1280×900, navigate to `http://localhost:3000/`. Scroll to bottom (forces lazy images to load — Teemo images, champion portraits), then back to top. Wait ~5 s for everything to load. Take a full-page screenshot, save as `docs/superpowers/plans/screenshots/phase2b-landing-desktop.png`.

- [ ] **Step 5: Screenshot — mobile**

Set viewport to 375×812, navigate to `http://localhost:3000/`. Scroll, wait, screenshot full page → `docs/superpowers/plans/screenshots/phase2b-landing-mobile.png`.

- [ ] **Step 6: Open the FAQ accordion (visual proof of Radix + tailwindcss-animate working)**

In Playwright at desktop viewport: navigate to `/`, scroll until the FAQ section is visible, click the first accordion trigger. Wait 0.5 s for animation. Screenshot full page → `docs/superpowers/plans/screenshots/phase2b-faq-open.png`.

- [ ] **Step 7: Commit screenshots**

```bash
cd /Users/jeremy/Documents/Code/ynov/ydays/beemobot-webapp
git add docs/superpowers/plans/screenshots/phase2b-*.png
git commit -m "docs(webapp): Phase 2B visual validation screenshots"
```

---

## Definition of Done

- 7 new section components live in `src/components/_design/landing/`, exported via `index.ts`
- `src/app/page.tsx` composes those 7 sections in order: Hero → Stats → Features → Integrations → LeaderboardTeaser → FAQ → CTA
- Old `src/components/organisms/HeroSection.tsx` (and the other 7 old landing organisms) are no longer imported. Their files remain on disk for Phase 5 cleanup.
- `pnpm build` passes cleanly
- No emoji in `src/components/_design/landing/` or `src/app/page.tsx`
- `/` returns 200 and renders without console errors
- 3 screenshots committed: `phase2b-landing-desktop.png`, `phase2b-landing-mobile.png`, `phase2b-faq-open.png`

## What's NOT in this plan (future phases)

- Wiring `LeaderboardTeaserLanding` to the real `/game/top/honey` API (Phase 3, when full Leaderboard page is built — at that point introduce a hook + accept `players` prop here)
- Profile page redesign (Phase 2C)
- Other public pages (Search, Game, Shop, etc. — Phases 3-5)
- Removing the legacy organisms (`HeroSection.tsx`, `TeamSection.tsx`, `FaqSection.tsx`, etc.) — Phase 5 cleanup
- i18n / multi-language support (out of scope, fr-FR only)
- Analytics events on the CTAs (out of scope, deferred)
