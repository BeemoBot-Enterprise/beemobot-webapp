# Phase 2A — Polish + Global Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Réagit aux notes du senior review de Phase 1 (mobile nav HeaderHF, contrast honey, helper ddragon, noindex internal, fallbacks d'image), puis remplace `MainLayout` par `HeaderHF` + `FooterHF` globalement dans `app/layout.tsx`. À la fin, toutes les pages chargent le nouveau Header/Footer Honey Friendly ; le contenu interne des pages anciennes reste intact (transitional) en attendant les phases 2B/2C.

**Architecture:** Approche additive comme Phase 1. Une nouvelle CSS var `--hf-honey-text` plus sombre est ajoutée *en plus* de `--hf-honey` (qui reste l'accent décoratif). DDragon URL building centralisé dans `src/lib/ddragon.ts`. Le Header gagne une mobile nav via `@radix-ui/react-dialog` (déjà installé). Le `MainLayout` template est remplacé par un mount direct de `HeaderHF` + `FooterHF` dans `RootLayout`. `MainLayout.tsx` reste sur disque pour l'instant (Phase 5 le supprimera).

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind 3.4, `@radix-ui/react-dialog` (déjà installé), `@remixicon/react`, Playwright MCP pour validation visuelle.

**Spec source:** `docs/superpowers/specs/2026-05-07-redesign-webapp-honey-friendly-design.md`. Senior review notes consigned in PR `feat/phase1-foundation-design-system` (merged).

**Hors scope:** redesign des pages existantes (landing/profil/etc., chacune dans son propre plan ultérieur), suppression d'AlignUI dark, audit complet des emoji dans les pages anciennes.

---

## File Structure

```
src/
├── lib/
│   └── ddragon.ts                              (CREATE — DDragon URL helpers + version)
├── components/
│   └── _design/
│       ├── Header.tsx                          (MODIFY — add mobile nav drawer)
│       ├── RankBadge.tsx                       (MODIFY — onError fallback)
│       └── ChampionPortrait.tsx                (MODIFY — use ddragon helper + onError fallback)
├── styles/
│   └── globals.css                             (MODIFY — add --hf-honey-text token)
├── app/
│   ├── layout.tsx                              (MODIFY — replace MainLayout with HeaderHF/FooterHF, swap body classes)
│   └── internal/
│       └── components/page.tsx                 (MODIFY — add noindex metadata)

tailwind.config.js                              (MODIFY — add hf-honey-text Tailwind token)
```

`MainLayout.tsx` and old `Header.tsx` / `Footer.tsx` (in `organisms/`) are NOT deleted in this phase. Un-importing `MainLayout` removes its global mount, but the file stays for reference until Phase 5 cleanup.

---

## Task 1 — Add `--hf-honey-text` accessible token

**Why:** `--hf-honey` (`#E5A422`) fails WCAG AA on light backgrounds at small text sizes (~2.1:1 contrast). The senior review flagged this for components that show *text* in honey: `<Eyebrow tone="honey">`, `<FooterHF>` column titles, `<StatNumber>` unit, `<Pill variant="honey">`. We add a darker text-only token `--hf-honey-text: #8B6914` (≈5:1 on white) and reserve `--hf-honey` for halos / icons / shadows / pill borders / non-text accents.

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Add CSS var to globals.css**

In `src/styles/globals.css`, inside the existing `:root { ... }` block (immediately after the `--hf-loss: #F43F5E;` line), append:

```css
  --hf-honey-text: #8B6914;
```

The full Honey Friendly section becomes:

```css
  /* Honey Friendly — Phase 1 (additive, doesn't override AlignUI dark) */
  --hf-bg: #FAFAF7;
  ...existing tokens...
  --hf-loss: #F43F5E;
  --hf-honey-text: #8B6914;
```

- [ ] **Step 2: Add Tailwind token in tailwind.config.js**

In `tailwind.config.js`, in the `theme.extend.colors` object, immediately after the `"hf-loss": "var(--hf-loss)",` line, append:

```js
        "hf-honey-text": "var(--hf-honey-text)",
```

- [ ] **Step 3: Verify TS clean**

```bash
cd /Users/jeremy/Documents/Code/ynov/ydays/beemobot-webapp
pnpm tsc --noEmit
```

Should pass.

- [ ] **Step 4: Commit**

```bash
git add src/styles/globals.css tailwind.config.js
git commit -m "feat(webapp): add --hf-honey-text accessible token (#8B6914, ~5:1 on white)"
```

---

## Task 2 — Apply `text-hf-honey-text` to small-text honey usages

**Why:** Eyebrow honey tone, Footer column titles, StatNumber unit, and Pill honey variant currently use `text-hf-honey` which fails contrast. Switch them to `text-hf-honey-text` while leaving non-text honey usage (icon backgrounds, halos, button accents) unchanged.

**Files:**
- Modify: `src/components/_design/Eyebrow.tsx`
- Modify: `src/components/_design/Footer.tsx`
- Modify: `src/components/_design/StatNumber.tsx`
- Modify: `src/components/_design/Pill.tsx`
- Modify: `src/app/internal/components/page.tsx` (the demo page eyebrow uses honey too)

- [ ] **Step 1: Eyebrow — switch honey tone to honey-text**

In `src/components/_design/Eyebrow.tsx`, change the cva tone:

```tsx
      tone: {
        honey: "text-hf-honey",
        navy: "text-hf-navy-soft",
      },
```

to:

```tsx
      tone: {
        honey: "text-hf-honey-text",
        navy: "text-hf-navy-soft",
      },
```

- [ ] **Step 2: Footer — column titles use honey-text**

In `src/components/_design/Footer.tsx`, replace:

```tsx
              <div className="text-hf-eyebrow uppercase tracking-[0.15em] text-hf-honey mb-3">
```

with:

```tsx
              <div className="text-hf-eyebrow uppercase tracking-[0.15em] text-hf-honey-text mb-3">
```

- [ ] **Step 3: StatNumber — unit uses honey-text**

In `src/components/_design/StatNumber.tsx`, replace:

```tsx
        {unit ? <span className="text-hf-honey">{unit}</span> : null}
```

with:

```tsx
        {unit ? <span className="text-hf-honey-text">{unit}</span> : null}
```

- [ ] **Step 4: Pill — honey variant uses honey-text on the bg-hf-honey-glow background**

In `src/components/_design/Pill.tsx`, replace:

```tsx
        honey: "bg-hf-honey-glow text-hf-honey border border-transparent",
```

with:

```tsx
        honey: "bg-hf-honey-glow text-hf-honey-text border border-transparent",
```

- [ ] **Step 5: Demo page — main eyebrow honey color**

In `src/app/internal/components/page.tsx`, the page header has:

```tsx
          <p className="font-display text-hf-eyebrow uppercase tracking-[0.15em] text-hf-honey mb-2">
            Honey Friendly · Phase 1
          </p>
```

Replace `text-hf-honey` with `text-hf-honey-text`:

```tsx
          <p className="font-display text-hf-eyebrow uppercase tracking-[0.15em] text-hf-honey-text mb-2">
```

- [ ] **Step 6: Verify**

```bash
cd /Users/jeremy/Documents/Code/ynov/ydays/beemobot-webapp
pnpm tsc --noEmit
```

Should pass. Optionally start `pnpm dev` and visit `/internal/components` — the eyebrows, footer column titles, stat units, and honey pill should look slightly darker / more readable.

- [ ] **Step 7: Commit**

```bash
git add src/components/_design/Eyebrow.tsx src/components/_design/Footer.tsx src/components/_design/StatNumber.tsx src/components/_design/Pill.tsx src/app/internal/components/page.tsx
git commit -m "fix(webapp): use accessible --hf-honey-text on small honey text"
```

---

## Task 3 — Create DDragon helper

**Why:** Three places hardcode DDragon version strings (`ChampionPortrait`, `auth/link/page.tsx`, `search/page.tsx`). When Riot publishes a patch, images break silently. Centralize the version + URL builders in one module so future bumps are one-line.

**Files:**
- Create: `src/lib/ddragon.ts`

- [ ] **Step 1: Create the helper file**

Create `src/lib/ddragon.ts` with EXACTLY this content:

```ts
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 *
 * Helpers for Riot Data Dragon CDN URLs. Bump DDRAGON_VERSION when
 * a new LoL patch ships and the app needs the latest icons / data.
 *
 * Reference: https://developer.riotgames.com/docs/lol#data-dragon
 */

export const DDRAGON_VERSION = "15.1.1";

const BASE = "https://ddragon.leagueoflegends.com/cdn";

/** Square champion portrait (e.g. "Yasuo" → 120×120 PNG). Versioned URL. */
export function championIconUrl(name: string): string {
  return `${BASE}/${DDRAGON_VERSION}/img/champion/${name}.png`;
}

/** Champion splash art (1215×717 JPG). Version-independent path. */
export function championSplashUrl(name: string, skin = 0): string {
  return `${BASE}/img/champion/splash/${name}_${skin}.jpg`;
}

/** Centered, pre-cropped splash (1280×720 JPG). Better for banners. */
export function championLoadingUrl(name: string, skin = 0): string {
  return `${BASE}/img/champion/loading/${name}_${skin}.jpg`;
}

/** Item icon (e.g. 1001 = Boots, 64×64 PNG). Versioned. */
export function itemIconUrl(itemId: number): string {
  return `${BASE}/${DDRAGON_VERSION}/img/item/${itemId}.png`;
}

/** Profile icon (1, 2, ..., 588) — used in summoner cards. Versioned. */
export function profileIconUrl(iconId: number): string {
  return `${BASE}/${DDRAGON_VERSION}/img/profileicon/${iconId}.png`;
}
```

- [ ] **Step 2: Verify TS**

```bash
cd /Users/jeremy/Documents/Code/ynov/ydays/beemobot-webapp
pnpm tsc --noEmit
```

Should pass. The file is pure functions, no imports — should compile instantly.

- [ ] **Step 3: Commit**

```bash
git add src/lib/ddragon.ts
git commit -m "feat(webapp): centralize DDragon URL builders in src/lib/ddragon.ts"
```

---

## Task 4 — Refactor `<ChampionPortrait>` to use ddragon helper + next/image

**Why:** ChampionPortrait now uses raw `<img>` with hardcoded URLs. Switch to the new `championIconUrl()` / `championSplashUrl()` helpers AND use `next/image` (DDragon's `ddragon.leagueoflegends.com` is already whitelisted in `next.config.mjs`). This gives lazy loading, perf optimization, and removes the eslint-disable comment.

**Files:**
- Modify: `src/components/_design/ChampionPortrait.tsx`

- [ ] **Step 1: Rewrite ChampionPortrait.tsx**

Replace the entire content of `src/components/_design/ChampionPortrait.tsx` with:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import Image from "next/image";
import * as React from "react";
import { cn } from "@/lib/design/cn";
import { championIconUrl, championSplashUrl } from "@/lib/ddragon";

export interface ChampionPortraitProps {
  /** Champion key, PascalCase, e.g. "Yasuo", "LeeSin", "MissFortune". */
  name: string;
  variant?: "square" | "circle" | "splash";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SQUARE_PX = { sm: 48, md: 72, lg: 96 } as const;
const SPLASH_W = { sm: 320, md: 480, lg: 640 } as const;

export function ChampionPortrait({
  name,
  variant = "square",
  size = "md",
  className,
}: ChampionPortraitProps) {
  if (variant === "splash") {
    const w = SPLASH_W[size];
    return (
      <div
        className={cn("relative overflow-hidden rounded-hf-card-lg border border-hf-line bg-hf-surface-alt", className)}
        style={{ width: w, aspectRatio: "16 / 9" }}
      >
        <Image
          src={championSplashUrl(name)}
          alt={`Splash art ${name}`}
          fill
          sizes={`${w}px`}
          className="object-cover"
        />
      </div>
    );
  }
  const px = SQUARE_PX[size];
  const radius = variant === "circle" ? "rounded-full" : "rounded-md";
  return (
    <div
      className={cn(radius, "relative overflow-hidden border border-hf-line bg-hf-surface-alt", className)}
      style={{ width: px, height: px }}
    >
      <Image
        src={championIconUrl(name)}
        alt={`Portrait ${name}`}
        fill
        sizes={`${px}px`}
        className="object-cover"
      />
    </div>
  );
}
```

The wrapper div now has `bg-hf-surface-alt` — that becomes the visible fallback if the image fails to load (no `onError` needed for ChampionPortrait since splash arts are stable and the visible bg is sufficient).

- [ ] **Step 2: Verify TS**

```bash
pnpm tsc --noEmit
```

Should pass.

- [ ] **Step 3: Sanity check via dev**

Start `pnpm dev` if not running, visit `/internal/components`, scroll to the ChampionPortrait section. The 4 portraits + Yasuo splash should still render. The portraits now go through `/_next/image` optimization (visible in DevTools Network tab).

- [ ] **Step 4: Commit**

```bash
git add src/components/_design/ChampionPortrait.tsx
git commit -m "refactor(webapp): ChampionPortrait uses next/image + ddragon helper"
```

---

## Task 5 — Add `onError` fallback to `<RankBadge>`

**Why:** RankBadge loads emblems from CommunityDragon CDN. If the URL pattern changes upstream or a tier mis-spelled, the image breaks silently with broken-image icon. Add a tasteful fallback: a circular `bg-hf-surface-alt` plate with the tier's first letter centered in display font.

**Files:**
- Modify: `src/components/_design/RankBadge.tsx`

- [ ] **Step 1: Replace RankBadge.tsx**

Replace the entire content of `src/components/_design/RankBadge.tsx` with:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
"use client";
import * as React from "react";
import { cn } from "@/lib/design/cn";

export type Tier =
  | "iron"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "emerald"
  | "diamond"
  | "master"
  | "grandmaster"
  | "challenger";

export type Division = "I" | "II" | "III" | "IV";

export interface RankBadgeProps {
  tier: Tier;
  division?: Division;
  lp?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_PX = { sm: 56, md: 80, lg: 120 } as const;

const EMBLEM_BASE =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem";

export function RankBadge({ tier, division, lp, size = "md", className }: RankBadgeProps) {
  const px = SIZE_PX[size];
  const hasDivision = !["master", "grandmaster", "challenger"].includes(tier);
  const [errored, setErrored] = React.useState(false);
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      {errored ? (
        <FallbackEmblem tier={tier} px={px} />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={`${EMBLEM_BASE}/emblem-${tier}.png`}
          alt={`Rank emblem ${tier}`}
          width={px}
          height={px}
          loading="lazy"
          onError={() => setErrored(true)}
          className="object-contain"
        />
      )}
      <div className="text-hf-eyebrow uppercase tracking-[0.15em] font-bold text-hf-navy">
        {tier}
        {hasDivision && division ? ` ${division}` : ""}
      </div>
      {typeof lp === "number" ? (
        <div className="text-hf-body-sm text-hf-navy-soft tabular-nums">{lp} LP</div>
      ) : null}
    </div>
  );
}

function FallbackEmblem({ tier, px }: { tier: Tier; px: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-hf-surface-alt border border-hf-line text-hf-navy font-display font-bold"
      style={{ width: px, height: px, fontSize: Math.round(px / 2.5) }}
      aria-label={`Rank emblem unavailable, ${tier}`}
    >
      {tier.charAt(0).toUpperCase()}
    </div>
  );
}
```

The component is now `"use client"` because `useState` is needed for the error state.

- [ ] **Step 2: Verify TS**

```bash
pnpm tsc --noEmit
```

Should pass.

- [ ] **Step 3: Sanity check fallback**

Manually verify the fallback works by temporarily editing the URL to break it:

```bash
# Open `src/components/_design/RankBadge.tsx` and change `emblem-${tier}.png` to `emblem-${tier}-broken.png` in your local diff.
# Visit /internal/components, scroll to RankBadge section — should see 10 fallback circles with tier initials.
# Revert the edit.
```

This is a manual sanity check — don't commit the broken URL.

- [ ] **Step 4: Commit**

```bash
git add src/components/_design/RankBadge.tsx
git commit -m "feat(webapp): RankBadge fallback emblem on image error"
```

---

## Task 6 — HeaderHF mobile nav (hamburger drawer)

**Why:** HeaderHF currently hides nav on mobile (< 768px) with no replacement. Senior review flagged this as a Phase 2 prerequisite before global wiring. Add a hamburger button (visible on `< md`) that opens a `@radix-ui/react-dialog` drawer covering the page with the same nav links + "Mon profil" + "Ajouter" CTA.

**Files:**
- Modify: `src/components/_design/Header.tsx`

- [ ] **Step 1: Replace Header.tsx**

Replace the entire content of `src/components/_design/Header.tsx` with:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
"use client";
import Link from "next/link";
import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { RiDiscordFill, RiMenuLine, RiCloseLine } from "@remixicon/react";
import { Button } from "./Button";
import { cn } from "@/lib/design/cn";
import { BOT_INVITE_URL } from "@/lib/env";

const NAV = [
  { label: "Fonctionnalités", href: "/#features" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Mini-jeux", href: "/game" },
  { label: "Documentation", href: "/documentation" },
];

export function HeaderHF({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <header
      className={cn(
        "sticky top-0 z-50 backdrop-blur-md bg-hf-bg/85 border-b border-hf-line",
        className,
      )}
    >
      <div className="mx-auto max-w-[1100px] px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-hf-navy">
          <BeeMark />
          <span className="text-hf-body-lg tracking-tight">Beemobot</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-hf-body-sm font-medium text-hf-navy-soft hover:text-hf-honey-text transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="hidden sm:inline-block text-hf-body-sm font-medium text-hf-navy-soft hover:text-hf-navy transition-colors"
          >
            Mon profil
          </Link>
          <a href={BOT_INVITE_URL} target="_blank" rel="noreferrer" className="hidden md:inline-flex">
            <Button size="sm" variant="primary">
              <RiDiscordFill className="size-4" />
              Ajouter
            </Button>
          </a>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Ouvrir le menu"
                className="md:hidden flex items-center justify-center size-10 rounded-hf-btn border border-hf-line bg-hf-surface text-hf-navy hover:border-hf-honey transition-colors"
              >
                <RiMenuLine className="size-5" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-hf-navy/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out" />
              <Dialog.Content
                className="fixed inset-x-0 top-0 z-50 bg-hf-bg border-b border-hf-line p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top"
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Navigation principale du site
                </Dialog.Description>
                <div className="flex items-center justify-between mb-6">
                  <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 font-display font-bold text-hf-navy">
                    <BeeMark />
                    <span className="text-hf-body-lg tracking-tight">Beemobot</span>
                  </Link>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Fermer le menu"
                      className="flex items-center justify-center size-10 rounded-hf-btn border border-hf-line bg-hf-surface text-hf-navy hover:border-hf-honey transition-colors"
                    >
                      <RiCloseLine className="size-5" />
                    </button>
                  </Dialog.Close>
                </div>
                <nav className="flex flex-col">
                  {NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="py-3 border-b border-hf-line text-hf-body-lg font-medium text-hf-navy hover:text-hf-honey-text transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="py-3 border-b border-hf-line text-hf-body-lg font-medium text-hf-navy hover:text-hf-honey-text transition-colors"
                  >
                    Mon profil
                  </Link>
                </nav>
                <a
                  href={BOT_INVITE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex w-full"
                  onClick={() => setOpen(false)}
                >
                  <Button size="lg" variant="primary" className="w-full">
                    <RiDiscordFill className="size-5" />
                    Ajouter à Discord
                  </Button>
                </a>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}

function BeeMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="14" fill="var(--hf-honey)" />
      <ellipse cx="16" cy="16" rx="14" ry="4" fill="var(--hf-navy)" />
    </svg>
  );
}
```

Notes on the changes:
- The whole component is `"use client"` again — Dialog with state needs it.
- Desktop "Ajouter" button now wraps in `<a href={BOT_INVITE_URL} target="_blank">`, hidden below `md`.
- New mobile-only `<button>` (visible `md:hidden`) opens the Radix Dialog.
- Drawer slides from top, dimmed overlay, contains: logo + close button, vertical nav, "Mon profil", full-width "Ajouter à Discord" CTA.
- Each `<Link>` inside the drawer calls `setOpen(false)` so navigation closes the drawer.

- [ ] **Step 2: Verify TS**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 3: Sanity check at narrow viewport**

In Playwright or DevTools, set viewport to 375×812 (iPhone). Visit `/internal/components`. The desktop nav should be hidden. A hamburger button should appear on the right. Clicking it opens a drawer with all nav items + "Mon profil" + full-width CTA. Clicking any link closes the drawer and navigates.

- [ ] **Step 4: Commit**

```bash
git add src/components/_design/Header.tsx
git commit -m "feat(webapp): HeaderHF mobile nav drawer (Radix Dialog)"
```

---

## Task 7 — Add `noindex` metadata to `/internal/components`

**Why:** The demo page is publicly reachable in production (Vercel deploys static routes). Without `noindex`, search engines will index it, which is unwanted (it's an internal validation surface).

**Files:**
- Modify: `src/app/internal/components/page.tsx`

- [ ] **Step 1: Add metadata export**

In `src/app/internal/components/page.tsx`, after the JSDoc header (lines 1-7) and before the imports, add:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Components — Honey Friendly",
  robots: { index: false, follow: false },
};
```

So the top of the file becomes:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 *
 * Internal demo page for the Honey Friendly design system (Phase 1).
 * Each section validates one component visually. Not linked from main nav.
 */
import type { Metadata } from "next";
import { Button } from "@/components/_design/Button";
...other imports unchanged...

export const metadata: Metadata = {
  title: "Components — Honey Friendly",
  robots: { index: false, follow: false },
};

export default function ComponentsDemoPage() {
  ...
```

- [ ] **Step 2: Verify TS**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 3: Sanity-check the rendered head**

Build and start prod:

```bash
pnpm build && pnpm start &
sleep 5
curl -s http://localhost:3000/internal/components | grep -i robots | head -3
kill %1
```

Expected: `<meta name="robots" content="noindex, nofollow"/>` (or similar) in the response.

- [ ] **Step 4: Commit**

```bash
git add src/app/internal/components/page.tsx
git commit -m "feat(webapp): noindex /internal/components — internal validation surface"
```

---

## Task 8 — Replace `MainLayout` with `HeaderHF` + `FooterHF` globally

**Why:** This is the headline migration of Phase 2A. After this, every page (`/`, `/profile`, `/leaderboard`, `/auth/*`, etc.) loads the new Honey Friendly Header + Footer instead of the old AlignUI dark Header + Footer. Page **bodies** still use old styles temporarily until each page is migrated in Phases 2B-5.

The demo page `/internal/components` currently mounts its own `<HeaderHF />` and `<FooterHF />` and wraps content in its own `<main>`. After wiring those globally, those local mounts become duplicates and the nested `<main>` is invalid HTML. We strip them in the same task.

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/internal/components/page.tsx`

- [ ] **Step 1: Update RootLayout**

Replace `src/app/layout.tsx` content with:

```tsx
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Onest, Geist } from "next/font/google";
import { HeaderHF } from "@/components/_design/Header";
import { FooterHF } from "@/components/_design/Footer";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "BeemoBot — Bot Discord League of Legends",
  description:
    "Le bot Discord pour ta communauté League of Legends. Stats, profils, leaderboards et mini-jeux.",
  keywords: ["Bot Discord", "League of Legends", "LoL", "BeemoBot"],
  openGraph: {
    title: "BeemoBot — Bot Discord League of Legends",
    description:
      "Stats, profils, leaderboards et mini-jeux pour ta communauté Discord.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${geist.variable} ${bricolage.variable} ${onest.variable}`}>
      <body className="min-h-screen bg-hf-bg text-hf-navy flex flex-col font-body antialiased">
        <HeaderHF />
        <main className="flex-grow">{children}</main>
        <FooterHF />
      </body>
    </html>
  );
}
```

Changes from the current file:
- Removed `import MainLayout from "@/components/templates/MainLayout";`
- Added imports for `HeaderHF` and `FooterHF` from the new design system
- Body class changed from `bg-[var(--bg)] text-[var(--text)] flex flex-col font-sans` to `bg-hf-bg text-hf-navy flex flex-col font-body`
- `<MainLayout>{children}</MainLayout>` replaced by `<HeaderHF /><main className="flex-grow">{children}</main><FooterHF />`

The `SupportFab` from the old MainLayout is intentionally dropped in this phase. If wanted later, it can be re-added with HF styling.

- [ ] **Step 2: Strip duplicate Header/Footer/main from the demo page**

In `src/app/internal/components/page.tsx`:

1. Remove these two imports near the top:

```tsx
import { HeaderHF } from "@/components/_design/Header";
import { FooterHF } from "@/components/_design/Footer";
```

2. The current JSX returned by `ComponentsDemoPage` looks like:

```tsx
  return (
    <main className="min-h-screen bg-hf-bg font-body text-hf-navy">
      <HeaderHF />
      <div className="mx-auto max-w-[1100px] px-6 py-16">
        ...sections...
      </div>
      <FooterHF />
    </main>
  );
```

Replace it with (no inner `<main>`, no local Header/Footer — the global ones wrap):

```tsx
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16">
      ...sections... (UNCHANGED — keep all the existing <Section> blocks as-is)
    </div>
  );
```

Concretely: delete the `<main className="min-h-screen bg-hf-bg font-body text-hf-navy">` opening tag and its matching closing `</main>`, delete the `<HeaderHF />` line, delete the `<FooterHF />` line. Keep the `<div className="mx-auto max-w-[1100px] px-6 py-16">` block and everything inside it unchanged.

- [ ] **Step 3: Verify TS**

```bash
pnpm tsc --noEmit
```

- [ ] **Step 4: Smoke test all routes**

```bash
pnpm dev > /tmp/beemobot-dev.log 2>&1 &
sleep 12
for route in / /profile /leaderboard /search /game /shop /settings /documentation /resources /auth/callback /auth/link /auth/login /internal/components; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$route")
  echo "$code $route"
done
kill %1
```

Every route should return 200. If any returns 500, inspect `/tmp/beemobot-dev.log` for the error.

- [ ] **Step 5: Visual sanity check via Playwright**

Navigate to `/` (landing) at viewport 1280×900. Take a screenshot — the page should now have the new Honey Friendly Header at top (sticky cream with Beemobot logo + nav) and the new Footer at bottom (4-column white footer with copyright). The middle (existing landing content with old AlignUI hero etc.) will look mismatched / dark — that's expected and gets fixed in Phase 2B.

```bash
# Pseudo-Playwright via the controller's Playwright MCP.
# Save screenshot to docs/superpowers/plans/screenshots/phase2a-landing-with-new-chrome.png
```

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/app/internal/components/page.tsx
git commit -m "feat(webapp): wire HeaderHF + FooterHF globally in RootLayout"
```

---

## Task 9 — Final verification + screenshots

**Files:**
- None modified — verification only.

- [ ] **Step 1: Build passes**

```bash
cd /Users/jeremy/Documents/Code/ynov/ydays/beemobot-webapp
pnpm build 2>&1 | tail -20
```

Expected: clean build, all routes listed, no TypeScript or compile errors.

- [ ] **Step 2: No-emoji check on touched files**

```bash
python3 - <<'PY'
import re, pathlib, sys
emoji = re.compile(r'[\U0001F300-\U0001FAFF☀-➿]')
hits = [(str(p), i, m.group())
  for root in ('src/components/_design', 'src/app/internal', 'src/lib/ddragon.ts', 'src/app/layout.tsx')
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

- [ ] **Step 3: Screenshot — desktop**

In Playwright at 1280×900:
- Navigate to `/internal/components`. Scroll to bottom (lazy images load). Screenshot full page → `docs/superpowers/plans/screenshots/phase2a-internal-final.png`.
- Navigate to `/`. Screenshot full page → `docs/superpowers/plans/screenshots/phase2a-landing-with-new-chrome.png`.

- [ ] **Step 4: Screenshot — mobile**

Set viewport to 375×812. Navigate to `/internal/components`. Open the hamburger drawer (click the menu button). Screenshot → `docs/superpowers/plans/screenshots/phase2a-mobile-drawer.png`.

- [ ] **Step 5: Commit screenshots**

```bash
git add docs/superpowers/plans/screenshots/phase2a-*.png
git commit -m "docs(webapp): Phase 2A visual validation screenshots"
```

---

## Definition of Done

- `--hf-honey-text` token exists and is used by all small-text honey usages (Eyebrow honey, Footer columns, StatNumber unit, Pill honey, demo eyebrow)
- `src/lib/ddragon.ts` exists and is used by `<ChampionPortrait>`
- `<ChampionPortrait>` uses `next/image` (DDragon CDN already whitelisted in `next.config.mjs`)
- `<RankBadge>` shows a tier-letter fallback when the CDN image errors
- `<HeaderHF>` shows a hamburger button on `< md` viewports, opening a Radix drawer with full nav + CTA
- `/internal/components` returns `<meta name="robots" content="noindex, nofollow">`
- `app/layout.tsx` mounts `HeaderHF` + `FooterHF` directly; `MainLayout` is no longer imported (file remains on disk for future cleanup)
- All 13 main routes (`/`, `/profile`, `/leaderboard`, `/search`, `/game`, `/shop`, `/settings`, `/documentation`, `/resources`, `/auth/callback`, `/auth/link`, `/auth/login`, `/internal/components`) return 200 and load with the new chrome
- `pnpm build` passes
- 3 screenshots committed under `docs/superpowers/plans/screenshots/phase2a-*.png`

## What's NOT in this plan (future phases)

- Migrating the landing page body to use the new design system (Phase 2B)
- Migrating the profile page (Phase 2C)
- Migrating other pages (Leaderboard, Search, Game, Shop, Settings, Documentation, Resources, Auth callback, 404) (Phases 3-5)
- Refactoring `src/app/auth/link/page.tsx` and `src/app/search/page.tsx` to use the new `ddragon.ts` helper (their hardcoded versions stay until those pages are migrated)
- Removing the legacy `MainLayout`, old `Header`/`Footer` in `organisms/`, AlignUI dark tokens (Phase 5 cleanup)
- Re-adding `SupportFab` in the new HF style if desired
