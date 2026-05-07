# Phase 1 — Foundation Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pose la fondation Honey Friendly du webapp — tokens light theme, fonts Bricolage Grotesque + Onest, et 11 composants atomiques validés sur une page demo `/internal/components`. Aucune page existante n'est touchée — l'ancien design system AlignUI dark continue de marcher en parallèle pendant la transition.

**Architecture:** Approche additive. Nouveau namespace `src/components/_design/` pour les composants neufs. Nouveaux tokens CSS et Tailwind ajoutés à côté des anciens (suffixe ou préfixe distinct). Page demo `/internal/components` qui rend chaque composant avec exemples — c'est notre validation visuelle (pas de framework de tests installé). Screenshot Playwright après chaque composant pour preuve.

**Tech Stack:** Next.js 15 (App Router), React 19, Tailwind CSS, `class-variance-authority` + `tailwind-merge` (déjà installés), `@remixicon/react` pour les icônes, `next/font/google` pour Bricolage et Onest, Playwright MCP pour les screenshots de validation.

**Spec source:** `docs/superpowers/specs/2026-05-07-redesign-webapp-honey-friendly-design.md` — Phase 1 uniquement.

**Hors scope ici (Phases ultérieures) :** migration des pages existantes, suppression de l'AlignUI dark, intégration dans `layout.tsx` (le nouveau Header reste isolé en demo).

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx                          (MODIFY — load Bricolage + Onest fonts)
│   └── internal/
│       └── components/
│           └── page.tsx                    (CREATE — visual demo page)
├── styles/
│   └── globals.css                         (MODIFY — add new CSS vars, keep old)
├── components/
│   └── _design/                            (CREATE all of these)
│       ├── Button.tsx
│       ├── Eyebrow.tsx
│       ├── Pill.tsx
│       ├── Card.tsx
│       ├── StatNumber.tsx
│       ├── SectionShell.tsx
│       ├── TeemoMascot.tsx
│       ├── RankBadge.tsx
│       ├── ChampionPortrait.tsx
│       ├── MatchCard.tsx
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── index.ts                        (barrel export)
└── lib/
    └── design/
        ├── cn.ts                           (CREATE — twMerge + clsx helper)
        └── tokens.ts                       (CREATE — token re-export for JS use)

tailwind.config.js                          (MODIFY — add hf-* color tokens, fonts, sizes)
```

Each component file is self-contained: `cva` variants on top, prop interface, `forwardRef` component, default export. New components import `cn` from `@/lib/design/cn` and Remixicon icons. Old components (`src/components/atoms/Button.tsx`, etc.) are NOT touched.

---

## Task 1 — Helper `cn` + barrel exports

**Files:**
- Create: `src/lib/design/cn.ts`
- Create: `src/components/_design/index.ts`

- [ ] **Step 1: Create `cn` utility**

```ts
// src/lib/design/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Create empty barrel**

```ts
// src/components/_design/index.ts
// Honey Friendly design system — Phase 1 foundation
// Components added incrementally as they're built.
export {};
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/design/cn.ts src/components/_design/index.ts
git commit -m "feat(webapp): scaffold Honey Friendly design system namespace"
```

---

## Task 2 — Load Bricolage Grotesque + Onest fonts

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update layout.tsx to load both fonts**

Replace lines 4-6 (the existing `Geist` import) with:

```tsx
import { Bricolage_Grotesque, Onest, Geist } from "next/font/google";

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
```

Then change the `<html>` className from `geist.variable` to:

```tsx
className={`${geist.variable} ${bricolage.variable} ${onest.variable}`}
```

- [ ] **Step 2: Run dev server, verify no compile error**

```bash
pnpm dev
```

Open `http://localhost:3000` — the existing site should still render exactly as before (fonts loaded but not yet applied via Tailwind). No console errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(webapp): load Bricolage Grotesque + Onest via next/font"
```

---

## Task 3 — Add Honey Friendly tokens to globals.css

**Files:**
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Append new CSS variables under existing `:root`**

After line 14 (`--radius: 8px;`), inside the same `:root { ... }` block, append:

```css
  /* Honey Friendly — Phase 1 (additive, doesn't override AlignUI dark) */
  --hf-bg: #FAFAF7;
  --hf-surface: #FFFFFF;
  --hf-surface-alt: #F5F0E0;
  --hf-navy: #14172B;
  --hf-navy-soft: #4D526B;
  --hf-line: #ECE9DF;
  --hf-honey: #E5A422;
  --hf-honey-soft: #FFD56E;
  --hf-honey-glow: rgba(229, 164, 34, 0.18);
  --hf-discord: #5865F2;
  --hf-win: #10B981;
  --hf-loss: #F43F5E;
```

Do NOT touch the existing AlignUI tokens above (`--bg`, `--surface`, etc.) — they continue to power existing pages.

- [ ] **Step 2: Run dev server, no visual change expected**

Open `http://localhost:3000`. Site renders identically — these are unused tokens for now.

- [ ] **Step 3: Commit**

```bash
git add src/styles/globals.css
git commit -m "feat(webapp): add Honey Friendly CSS tokens (additive)"
```

---

## Task 4 — Add Honey Friendly tokens to tailwind.config.js

**Files:**
- Modify: `tailwind.config.js`

- [ ] **Step 1: Add `hf-*` colors under `theme.extend.colors`**

Inside the existing `colors: { ... }` object (after line 149 `overlay: "rgba(0,0,0,0.6)",`), append:

```js
        // Honey Friendly — Phase 1 (use these in new components, prefix `hf-`)
        "hf-bg": "var(--hf-bg)",
        "hf-surface": "var(--hf-surface)",
        "hf-surface-alt": "var(--hf-surface-alt)",
        "hf-navy": "var(--hf-navy)",
        "hf-navy-soft": "var(--hf-navy-soft)",
        "hf-line": "var(--hf-line)",
        "hf-honey": "var(--hf-honey)",
        "hf-honey-soft": "var(--hf-honey-soft)",
        "hf-honey-glow": "var(--hf-honey-glow)",
        "hf-discord": "var(--hf-discord)",
        "hf-win": "var(--hf-win)",
        "hf-loss": "var(--hf-loss)",
```

- [ ] **Step 2: Add font families**

In `theme.extend.fontFamily` (line 159), replace:

```js
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
      },
```

with:

```js
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        // Honey Friendly Phase 1
        display: ["var(--font-bricolage)", "Georgia", "serif"],
        body: ["var(--font-onest)", "system-ui", "sans-serif"],
      },
```

- [ ] **Step 3: Add display sizes and eyebrow**

In `theme.extend.fontSize` (around line 162), append before `// AlignUI doc tokens`:

```js
        // Honey Friendly displays
        "hf-display-1": ["clamp(40px, 6vw, 64px)", { lineHeight: "0.94", letterSpacing: "-0.04em", fontWeight: "800" }],
        "hf-display-2": ["clamp(32px, 4.5vw, 44px)", { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "800" }],
        "hf-display-3": ["clamp(24px, 3vw, 32px)", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "700" }],
        "hf-body-lg": ["17px", { lineHeight: "1.55", fontWeight: "400" }],
        "hf-body": ["15px", { lineHeight: "1.55", fontWeight: "400" }],
        "hf-body-sm": ["13px", { lineHeight: "1.5", fontWeight: "400" }],
        "hf-eyebrow": ["11px", { lineHeight: "1.3", letterSpacing: "0.15em", fontWeight: "700" }],
```

- [ ] **Step 4: Add radii and shadows**

In `theme.extend.borderRadius` (line 151), append after `20: "20px",`:

```js
        // Honey Friendly
        "hf-card": "16px",
        "hf-card-lg": "20px",
        "hf-btn": "12px",
        "hf-pill": "9999px",
```

In `theme.extend.boxShadow` (line 196), append before `},` of boxShadow:

```js
        "hf-card": "0 8px 24px -10px rgba(20, 23, 43, 0.15)",
        "hf-card-hover": "0 12px 30px -10px rgba(20, 23, 43, 0.18)",
        "hf-btn-primary": "0 6px 16px -4px rgba(88, 101, 242, 0.5)",
```

- [ ] **Step 5: Restart dev server, verify build succeeds**

```bash
pnpm dev
```

The site should still render identically. New `hf-*` classes are now available in Tailwind (verify by inspecting computed CSS for any element — but no code uses them yet).

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.js
git commit -m "feat(webapp): add Honey Friendly Tailwind tokens (hf-* prefix)"
```

---

## Task 5 — Demo page skeleton at `/internal/components`

**Files:**
- Create: `src/app/internal/components/page.tsx`

- [ ] **Step 1: Create the page with sections placeholder**

```tsx
// src/app/internal/components/page.tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 *
 * Internal demo page for the Honey Friendly design system (Phase 1).
 * Each section validates one component visually. Not linked from main nav.
 */
"use client";

export default function ComponentsDemoPage() {
  return (
    <main className="min-h-screen bg-hf-bg font-body text-hf-navy">
      <div className="mx-auto max-w-[1100px] px-6 py-16">
        <header className="mb-16">
          <p className="font-display text-hf-eyebrow uppercase tracking-[0.15em] text-hf-honey mb-2">
            Honey Friendly · Phase 1
          </p>
          <h1 className="font-display text-hf-display-1 text-hf-navy">
            Design system demo
          </h1>
          <p className="mt-4 text-hf-body-lg text-hf-navy-soft max-w-2xl">
            Page interne de validation visuelle. Chaque section ci-dessous montre un composant
            atomique du nouveau design system, dans toutes ses variantes.
          </p>
        </header>

        <Section id="tokens" title="1 · Tokens (palette + typo)">
          <TokensPreview />
        </Section>

        {/* Sections 2-12 added incrementally as components are built */}
      </div>
    </main>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 border-t border-hf-line pt-10">
      <h2 className="font-display text-hf-display-3 mb-6">{title}</h2>
      {children}
    </section>
  );
}

function TokensPreview() {
  const colors: Array<[string, string]> = [
    ["bg", "var(--hf-bg)"],
    ["surface", "var(--hf-surface)"],
    ["surface-alt", "var(--hf-surface-alt)"],
    ["navy", "var(--hf-navy)"],
    ["navy-soft", "var(--hf-navy-soft)"],
    ["line", "var(--hf-line)"],
    ["honey", "var(--hf-honey)"],
    ["honey-soft", "var(--hf-honey-soft)"],
    ["discord", "var(--hf-discord)"],
    ["win", "var(--hf-win)"],
    ["loss", "var(--hf-loss)"],
  ];
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {colors.map(([name, value]) => (
          <div key={name} className="rounded-hf-card border border-hf-line bg-hf-surface p-3">
            <div className="h-12 w-full rounded-md mb-2" style={{ background: value }} />
            <div className="text-hf-body-sm font-medium">{name}</div>
            <div className="text-hf-body-sm text-hf-navy-soft font-mono">{value}</div>
          </div>
        ))}
      </div>
      <div className="rounded-hf-card-lg border border-hf-line bg-hf-surface p-6 space-y-4">
        <div className="font-display text-hf-display-1">Display 1 — Bricolage</div>
        <div className="font-display text-hf-display-2">Display 2 — Bricolage</div>
        <div className="font-display text-hf-display-3">Display 3 — Bricolage</div>
        <div className="text-hf-body-lg">Body lg — Onest 17px</div>
        <div className="text-hf-body">Body — Onest 15px</div>
        <div className="text-hf-body-sm text-hf-navy-soft">Body sm — Onest 13px</div>
        <div className="text-hf-eyebrow uppercase text-hf-honey">Eyebrow — Onest 11px</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run dev server and visit the page**

```bash
pnpm dev
```

Open `http://localhost:3000/internal/components`. Expected: page renders with cream `#FAFAF7` background, color swatches grid, and typography preview using Bricolage and Onest fonts.

- [ ] **Step 3: Take Playwright screenshot for evidence**

```bash
# In Claude: use playwright_browser_navigate then playwright_browser_take_screenshot
```

If running this plan with subagent-driven-development, capture: navigate to `http://localhost:3000/internal/components`, screenshot full page, save as `docs/superpowers/plans/screenshots/phase1-task5-tokens.png`.

- [ ] **Step 4: Commit**

```bash
git add src/app/internal/components/page.tsx
git commit -m "feat(webapp): add /internal/components demo page with tokens preview"
```

---

## Task 6 — `<Button>` (Honey Friendly)

**Files:**
- Create: `src/components/_design/Button.tsx`
- Modify: `src/components/_design/index.ts`
- Modify: `src/app/internal/components/page.tsx`

- [ ] **Step 1: Add Button section to demo page (will fail to render)**

In `src/app/internal/components/page.tsx`, add this import at the top with the others:

```tsx
import { Button } from "@/components/_design/Button";
import { RiDiscordFill, RiArrowRightLine } from "@remixicon/react";
```

Add this Section block immediately after the Tokens section, before the comment `{/* Sections 2-12 added incrementally */}`:

```tsx
        <Section id="button" title="2 · Button">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary"><RiDiscordFill className="size-5" />Ajouter à Discord</Button>
              <Button variant="outline">Voir la démo<RiArrowRightLine className="size-4" /></Button>
              <Button variant="ghost">Annuler</Button>
              <Button variant="danger">Supprimer</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" disabled>Disabled primary</Button>
              <Button variant="outline" disabled>Disabled outline</Button>
            </div>
          </div>
        </Section>
```

- [ ] **Step 2: Run dev server, expect import error**

```bash
pnpm dev
```

Open `/internal/components`. Expected: Next.js error page "Module not found: Can't resolve '@/components/_design/Button'".

- [ ] **Step 3: Implement Button**

Create `src/components/_design/Button.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/design/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-body font-bold transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hf-honey focus-visible:ring-offset-2 focus-visible:ring-offset-hf-bg disabled:opacity-50 disabled:pointer-events-none active:translate-y-0",
  {
    variants: {
      variant: {
        primary:
          "bg-hf-discord text-white shadow-hf-btn-primary hover:-translate-y-px",
        outline:
          "bg-hf-surface text-hf-navy border-[1.5px] border-hf-navy hover:-translate-y-px",
        ghost:
          "bg-transparent text-hf-navy hover:bg-hf-honey-glow",
        danger:
          "bg-hf-loss text-white hover:-translate-y-px",
      },
      size: {
        sm: "h-9 px-3 text-hf-body-sm rounded-hf-btn",
        md: "h-11 px-5 text-hf-body rounded-hf-btn",
        lg: "h-12 px-6 text-hf-body-lg rounded-hf-btn",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
```

- [ ] **Step 4: Update barrel export**

Replace `src/components/_design/index.ts` content with:

```ts
// Honey Friendly design system — Phase 1 foundation
export { Button, buttonVariants } from "./Button";
export type { ButtonProps } from "./Button";
```

- [ ] **Step 5: Reload dev page, verify visual**

Reload `http://localhost:3000/internal/components`. Expected:
- 4 buttons visible in row 1: Discord blurple primary with Discord icon, white outline with arrow, ghost (transparent until hover), red danger
- 3 sizes (sm/md/lg) in row 2 — visually distinct heights
- 2 disabled buttons in row 3 — half-opacity
- Hover any button → translate up 1px
- Focus a button via Tab → honey ring

- [ ] **Step 6: Screenshot for evidence**

Playwright: navigate, screenshot `docs/superpowers/plans/screenshots/phase1-task6-button.png`.

- [ ] **Step 7: Commit**

```bash
git add src/components/_design/Button.tsx src/components/_design/index.ts src/app/internal/components/page.tsx
git commit -m "feat(webapp): Honey Friendly Button (primary/outline/ghost/danger × sm/md/lg)"
```

---

## Task 7 — `<Eyebrow>`

**Files:**
- Create: `src/components/_design/Eyebrow.tsx`
- Modify: `src/components/_design/index.ts`
- Modify: `src/app/internal/components/page.tsx`

- [ ] **Step 1: Add Eyebrow section to demo page**

Add import:

```tsx
import { Eyebrow } from "@/components/_design/Eyebrow";
```

Add Section after Button:

```tsx
        <Section id="eyebrow" title="3 · Eyebrow">
          <div className="space-y-3">
            <Eyebrow>— Fonctionnalités</Eyebrow>
            <Eyebrow tone="navy">— Section sombre</Eyebrow>
            <Eyebrow>SECTION SANS TIRET</Eyebrow>
          </div>
        </Section>
```

- [ ] **Step 2: Reload, expect import error**

- [ ] **Step 3: Implement Eyebrow**

Create `src/components/_design/Eyebrow.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/design/cn";

const eyebrowVariants = cva(
  "inline-block font-body uppercase font-bold tracking-[0.15em] text-hf-eyebrow",
  {
    variants: {
      tone: {
        honey: "text-hf-honey",
        navy: "text-hf-navy-soft",
      },
    },
    defaultVariants: { tone: "honey" },
  },
);

export interface EyebrowProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof eyebrowVariants> {}

export const Eyebrow = React.forwardRef<HTMLParagraphElement, EyebrowProps>(
  ({ className, tone, children, ...props }, ref) => (
    <p ref={ref} className={cn(eyebrowVariants({ tone }), className)} {...props}>
      {children}
    </p>
  ),
);
Eyebrow.displayName = "Eyebrow";
```

- [ ] **Step 4: Update barrel export**

Append to `src/components/_design/index.ts`:

```ts
export { Eyebrow } from "./Eyebrow";
export type { EyebrowProps } from "./Eyebrow";
```

- [ ] **Step 5: Reload, verify**

Honey doré uppercase tracked text for the first two eyebrows; navy-soft tone for the second example. All 11px height.

- [ ] **Step 6: Screenshot, commit**

```bash
git add src/components/_design/Eyebrow.tsx src/components/_design/index.ts src/app/internal/components/page.tsx
git commit -m "feat(webapp): Honey Friendly Eyebrow (honey/navy tones)"
```

---

## Task 8 — `<Pill>`

**Files:**
- Create: `src/components/_design/Pill.tsx`
- Modify: `src/components/_design/index.ts`
- Modify: `src/app/internal/components/page.tsx`

- [ ] **Step 1: Add Pill section**

Add import:

```tsx
import { Pill } from "@/components/_design/Pill";
```

Section:

```tsx
        <Section id="pill" title="4 · Pill">
          <div className="flex flex-wrap items-center gap-3">
            <Pill variant="live">Bot live · 320 serveurs</Pill>
            <Pill variant="default">Nouveau</Pill>
            <Pill variant="honey">Premium</Pill>
            <Pill variant="riot">Nunch <span className="opacity-60">#N7789</span></Pill>
          </div>
        </Section>
```

- [ ] **Step 2: Reload, expect import error**

- [ ] **Step 3: Implement Pill**

Create `src/components/_design/Pill.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/design/cn";

const pillVariants = cva(
  "inline-flex items-center gap-2 rounded-hf-pill px-3 py-1 font-body text-hf-body-sm font-semibold",
  {
    variants: {
      variant: {
        default: "bg-hf-surface border border-hf-line text-hf-navy-soft",
        live: "bg-hf-surface border border-hf-line text-hf-navy-soft",
        honey: "bg-hf-honey-glow text-hf-honey border border-transparent",
        riot: "bg-hf-navy text-white border border-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface PillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {}

export const Pill = React.forwardRef<HTMLSpanElement, PillProps>(
  ({ className, variant, children, ...props }, ref) => (
    <span ref={ref} className={cn(pillVariants({ variant }), className)} {...props}>
      {variant === "live" ? <LiveDot /> : null}
      {children}
    </span>
  ),
);
Pill.displayName = "Pill";

function LiveDot() {
  return (
    <span
      aria-hidden
      className="inline-block size-[7px] rounded-full bg-hf-win shadow-[0_0_0_3px_rgba(16,185,129,0.18)]"
    />
  );
}
```

- [ ] **Step 4: Update barrel**

```ts
export { Pill } from "./Pill";
export type { PillProps } from "./Pill";
```

- [ ] **Step 5: Reload, verify**

4 pills visible: live (with green dot), default (no dot), honey (golden bg), riot (navy bg).

- [ ] **Step 6: Screenshot, commit**

```bash
git add src/components/_design/Pill.tsx src/components/_design/index.ts src/app/internal/components/page.tsx
git commit -m "feat(webapp): Honey Friendly Pill (live/default/honey/riot)"
```

---

## Task 9 — `<Card>`

**Files:**
- Create: `src/components/_design/Card.tsx`
- Modify: `src/components/_design/index.ts`
- Modify: `src/app/internal/components/page.tsx`

- [ ] **Step 1: Add Card section**

Import:

```tsx
import { Card } from "@/components/_design/Card";
```

Section:

```tsx
        <Section id="card" title="5 · Card">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <h4 className="font-display text-hf-display-3 mb-2">Default</h4>
              <p className="text-hf-body-sm text-hf-navy-soft">
                Surface blanche, bordure ECE9DF, radius 16px.
              </p>
            </Card>
            <Card variant="accent">
              <h4 className="font-display text-hf-display-3 mb-2">Accent</h4>
              <p className="text-hf-body-sm text-hf-navy-soft">
                Surface-alt avec halo honey discret.
              </p>
            </Card>
            <Card variant="interactive">
              <h4 className="font-display text-hf-display-3 mb-2">Interactive</h4>
              <p className="text-hf-body-sm text-hf-navy-soft">
                Hover : translate-y et bordure honey.
              </p>
            </Card>
          </div>
        </Section>
```

- [ ] **Step 2: Reload, expect error**

- [ ] **Step 3: Implement Card**

Create `src/components/_design/Card.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/design/cn";

const cardVariants = cva(
  "rounded-hf-card-lg border p-6",
  {
    variants: {
      variant: {
        default: "bg-hf-surface border-hf-line",
        accent:
          "border-hf-line text-hf-navy bg-hf-surface-alt relative overflow-hidden " +
          "before:content-[''] before:absolute before:right-[-60px] before:top-[-60px] " +
          "before:size-48 before:rounded-full before:bg-hf-honey-glow before:pointer-events-none",
        interactive:
          "bg-hf-surface border-hf-line transition-[transform,border-color,box-shadow] duration-150 " +
          "hover:-translate-y-[2px] hover:border-hf-honey hover:shadow-hf-card-hover cursor-pointer",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, children, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props}>
      <div className="relative">{children}</div>
    </div>
  ),
);
Card.displayName = "Card";
```

- [ ] **Step 4: Barrel**

```ts
export { Card } from "./Card";
export type { CardProps } from "./Card";
```

- [ ] **Step 5: Reload, verify**

3 cards visible: white default, cream-warm with honey halo top-right, white interactive (hover lifts and border becomes honey).

- [ ] **Step 6: Screenshot, commit**

```bash
git add src/components/_design/Card.tsx src/components/_design/index.ts src/app/internal/components/page.tsx
git commit -m "feat(webapp): Honey Friendly Card (default/accent/interactive)"
```

---

## Task 10 — `<StatNumber>`

**Files:**
- Create: `src/components/_design/StatNumber.tsx`
- Modify: `src/components/_design/index.ts`
- Modify: `src/app/internal/components/page.tsx`

- [ ] **Step 1: Add StatNumber section**

Import:

```tsx
import { StatNumber } from "@/components/_design/StatNumber";
```

Section:

```tsx
        <Section id="stat" title="6 · StatNumber">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <StatNumber value="320" unit="+" label="Serveurs Discord actifs" />
            </Card>
            <Card>
              <StatNumber value="85" unit="k" label="Parties LoL indexées" />
            </Card>
            <Card>
              <StatNumber value="+87" unit="%" label="Engagement serveur" tone="win" />
            </Card>
          </div>
        </Section>
```

- [ ] **Step 2: Reload, expect error**

- [ ] **Step 3: Implement StatNumber**

Create `src/components/_design/StatNumber.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { cn } from "@/lib/design/cn";

export interface StatNumberProps {
  value: string | number;
  unit?: string;
  label: string;
  tone?: "default" | "win" | "loss";
  className?: string;
}

export function StatNumber({ value, unit, label, tone = "default", className }: StatNumberProps) {
  const toneClass =
    tone === "win" ? "text-hf-win" : tone === "loss" ? "text-hf-loss" : "text-hf-navy";
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className={cn("font-display text-hf-display-2 tabular-nums", toneClass)}>
        {value}
        {unit ? <span className="text-hf-honey">{unit}</span> : null}
      </div>
      <div className="text-hf-body-sm text-hf-navy-soft font-medium">{label}</div>
    </div>
  );
}
```

- [ ] **Step 4: Barrel**

```ts
export { StatNumber } from "./StatNumber";
export type { StatNumberProps } from "./StatNumber";
```

- [ ] **Step 5: Reload, verify**

3 stat numbers in cards: large Bricolage values, honey-colored unit, navy label below. Third one ("+87%") in green (`win` tone).

- [ ] **Step 6: Screenshot, commit**

```bash
git add src/components/_design/StatNumber.tsx src/components/_design/index.ts src/app/internal/components/page.tsx
git commit -m "feat(webapp): Honey Friendly StatNumber"
```

---

## Task 11 — `<SectionShell>` (cartouche unique)

**Files:**
- Create: `src/components/_design/SectionShell.tsx`
- Modify: `src/components/_design/index.ts`
- Modify: `src/app/internal/components/page.tsx`

- [ ] **Step 1: Add SectionShell example**

Import:

```tsx
import { SectionShell } from "@/components/_design/SectionShell";
```

Section:

```tsx
        <Section id="section-shell" title="7 · SectionShell">
          <SectionShell
            eyebrow="— Fonctionnalités"
            title="Tout pour ta communauté."
            lead="Les outils dont ta guilde a besoin, sans usine à gaz. Tu invites, tu joues, le bot fait le reste."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card><h4 className="font-display text-hf-display-3">A</h4></Card>
              <Card><h4 className="font-display text-hf-display-3">B</h4></Card>
              <Card><h4 className="font-display text-hf-display-3">C</h4></Card>
            </div>
          </SectionShell>
        </Section>
```

- [ ] **Step 2: Reload, expect error**

- [ ] **Step 3: Implement SectionShell**

Create `src/components/_design/SectionShell.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { cn } from "@/lib/design/cn";
import { Eyebrow } from "./Eyebrow";

export interface SectionShellProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title: string;
  lead?: string;
  withHaloHoney?: boolean;
}

export function SectionShell({
  eyebrow,
  title,
  lead,
  withHaloHoney = false,
  className,
  children,
  ...props
}: SectionShellProps) {
  return (
    <section
      className={cn(
        "relative px-6 py-14 lg:py-20",
        withHaloHoney && "overflow-hidden",
        className,
      )}
      {...props}
    >
      {withHaloHoney && (
        <div
          aria-hidden
          className="absolute -right-32 -top-40 size-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--hf-honey-glow) 0%, transparent 65%)" }}
        />
      )}
      <div className="relative mx-auto max-w-[1100px]">
        <header className="mb-10 max-w-2xl">
          {eyebrow ? <Eyebrow className="mb-2">{eyebrow}</Eyebrow> : null}
          <h2 className="font-display text-hf-display-2 text-hf-navy">{title}</h2>
          {lead ? <p className="mt-3 text-hf-body-lg text-hf-navy-soft">{lead}</p> : null}
        </header>
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Barrel**

```ts
export { SectionShell } from "./SectionShell";
export type { SectionShellProps } from "./SectionShell";
```

- [ ] **Step 5: Reload, verify**

Eyebrow doré uppercase + titre Bricolage display-2 + lead navy-soft + 3 cards alignées en grid. Cartouche cohérente.

- [ ] **Step 6: Screenshot, commit**

```bash
git add src/components/_design/SectionShell.tsx src/components/_design/index.ts src/app/internal/components/page.tsx
git commit -m "feat(webapp): Honey Friendly SectionShell (cartouche unique)"
```

---

## Task 12 — `<TeemoMascot>`

**Files:**
- Create: `src/components/_design/TeemoMascot.tsx`
- Modify: `src/components/_design/index.ts`
- Modify: `src/app/internal/components/page.tsx`

Note: this component uses the existing `BEEMO.character` asset (`src/assets/images/teemo-character.png`). Phase 1 supports a single pose (the existing image). Future phases can add `idle`/`hello`/`surprise`/`sleeping` variants by sourcing more illustrations — out of scope here.

- [ ] **Step 1: Add Mascot section**

Import:

```tsx
import { TeemoMascot } from "@/components/_design/TeemoMascot";
```

Section:

```tsx
        <Section id="teemo" title="8 · TeemoMascot">
          <div className="flex flex-wrap items-end gap-8">
            <TeemoMascot size="sm" />
            <TeemoMascot size="md" />
            <TeemoMascot size="lg" />
          </div>
        </Section>
```

- [ ] **Step 2: Reload, expect error**

- [ ] **Step 3: Implement TeemoMascot**

Create `src/components/_design/TeemoMascot.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import Image from "next/image";
import * as React from "react";
import { BEEMO } from "@/assets/images";
import { cn } from "@/lib/design/cn";

export interface TeemoMascotProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  alt?: string;
}

const SIZES = {
  sm: 80,
  md: 160,
  lg: 240,
  xl: 320,
} as const;

export function TeemoMascot({ size = "md", className, alt = "" }: TeemoMascotProps) {
  const px = SIZES[size];
  return (
    <div className={cn("relative inline-block", className)} style={{ width: px, height: px }}>
      <Image
        src={BEEMO.character}
        alt={alt}
        fill
        sizes={`${px}px`}
        priority={size === "xl"}
        className="object-contain"
      />
    </div>
  );
}
```

- [ ] **Step 4: Barrel**

```ts
export { TeemoMascot } from "./TeemoMascot";
export type { TeemoMascotProps } from "./TeemoMascot";
```

- [ ] **Step 5: Reload, verify**

Three sizes of Teemo character image, aligned at the bottom. Smallest 80px, largest 240px.

- [ ] **Step 6: Screenshot, commit**

```bash
git add src/components/_design/TeemoMascot.tsx src/components/_design/index.ts src/app/internal/components/page.tsx
git commit -m "feat(webapp): Honey Friendly TeemoMascot wrapper (4 sizes)"
```

---

## Task 13 — `<RankBadge>` (Riot rank emblems via CommunityDragon CDN)

**Files:**
- Create: `src/components/_design/RankBadge.tsx`
- Modify: `src/components/_design/index.ts`
- Modify: `src/app/internal/components/page.tsx`

Spec source: emblems from `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-{tier}.png` (community CDN, free, public). Phase 2 may swap to local assets.

- [ ] **Step 1: Add Rank section**

Import:

```tsx
import { RankBadge } from "@/components/_design/RankBadge";
```

Section:

```tsx
        <Section id="rank" title="9 · RankBadge">
          <div className="flex flex-wrap items-end gap-6">
            <RankBadge tier="iron" division="IV" lp={42} />
            <RankBadge tier="bronze" division="II" lp={66} />
            <RankBadge tier="silver" division="I" lp={88} />
            <RankBadge tier="gold" division="III" lp={120} />
            <RankBadge tier="platinum" division="II" lp={50} />
            <RankBadge tier="emerald" division="IV" lp={12} />
            <RankBadge tier="diamond" division="I" lp={75} />
            <RankBadge tier="master" lp={210} />
            <RankBadge tier="grandmaster" lp={487} />
            <RankBadge tier="challenger" lp={1024} />
          </div>
        </Section>
```

- [ ] **Step 2: Reload, expect error**

- [ ] **Step 3: Implement RankBadge**

Create `src/components/_design/RankBadge.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
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
  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${EMBLEM_BASE}/emblem-${tier}.png`}
        alt={`Rank emblem ${tier}`}
        width={px}
        height={px}
        loading="lazy"
        className="object-contain"
      />
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
```

Note: using `<img>` instead of `next/image` because the host (`raw.communitydragon.org`) isn't whitelisted in `next.config.mjs`. If we want optimisation, add `raw.communitydragon.org` to `images.remotePatterns` in `next.config.mjs` — out of scope for this task.

- [ ] **Step 4: Barrel**

```ts
export { RankBadge } from "./RankBadge";
export type { RankBadgeProps, Tier, Division } from "./RankBadge";
```

- [ ] **Step 5: Reload, verify**

10 rank emblems load from CommunityDragon CDN, with tier+division+LP labels below. Master/Grandmaster/Challenger have no division. If a tier image 404s, log it as an open question (the URL pattern may have changed).

- [ ] **Step 6: Screenshot, commit**

```bash
git add src/components/_design/RankBadge.tsx src/components/_design/index.ts src/app/internal/components/page.tsx
git commit -m "feat(webapp): Honey Friendly RankBadge (10 tiers via CommunityDragon CDN)"
```

---

## Task 14 — `<ChampionPortrait>` (Data Dragon CDN)

**Files:**
- Create: `src/components/_design/ChampionPortrait.tsx`
- Modify: `src/components/_design/index.ts`
- Modify: `src/app/internal/components/page.tsx`

Source: `https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{name}.png` (square portrait) and `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/{name}_0.jpg` (splash art, version-independent path). Hardcode version `15.1.1` for Phase 1; refresh strategy is out of scope.

- [ ] **Step 1: Add ChampionPortrait section**

Import:

```tsx
import { ChampionPortrait } from "@/components/_design/ChampionPortrait";
```

Section:

```tsx
        <Section id="champion" title="10 · ChampionPortrait">
          <div className="space-y-6">
            <div className="flex flex-wrap items-end gap-4">
              <ChampionPortrait name="Yasuo" variant="square" size="md" />
              <ChampionPortrait name="LeeSin" variant="square" size="md" />
              <ChampionPortrait name="Teemo" variant="circle" size="md" />
              <ChampionPortrait name="Ahri" variant="circle" size="lg" />
            </div>
            <ChampionPortrait name="Yasuo" variant="splash" size="lg" />
          </div>
        </Section>
```

- [ ] **Step 2: Reload, expect error**

- [ ] **Step 3: Implement ChampionPortrait**

Create `src/components/_design/ChampionPortrait.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { cn } from "@/lib/design/cn";

const DDRAGON_VERSION = "15.1.1";

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
        className={cn("relative overflow-hidden rounded-hf-card-lg border border-hf-line", className)}
        style={{ width: w, aspectRatio: "16 / 9" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${name}_0.jpg`}
          alt={`Splash art ${name}`}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    );
  }
  const px = SQUARE_PX[size];
  const radius = variant === "circle" ? "rounded-full" : "rounded-md";
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${name}.png`}
      alt={`Portrait ${name}`}
      width={px}
      height={px}
      loading="lazy"
      className={cn(radius, "object-cover border border-hf-line", className)}
    />
  );
}
```

- [ ] **Step 4: Barrel**

```ts
export { ChampionPortrait } from "./ChampionPortrait";
export type { ChampionPortraitProps } from "./ChampionPortrait";
```

- [ ] **Step 5: Reload, verify**

4 portraits in row 1 (2 square, 2 circle), 1 splash art below at lg. All load from `ddragon.leagueoflegends.com`. Borders and radius apply.

- [ ] **Step 6: Screenshot, commit**

```bash
git add src/components/_design/ChampionPortrait.tsx src/components/_design/index.ts src/app/internal/components/page.tsx
git commit -m "feat(webapp): Honey Friendly ChampionPortrait (square/circle/splash via DDragon)"
```

---

## Task 15 — `<MatchCard>`

**Files:**
- Create: `src/components/_design/MatchCard.tsx`
- Modify: `src/components/_design/index.ts`
- Modify: `src/app/internal/components/page.tsx`

- [ ] **Step 1: Add MatchCard section**

Import:

```tsx
import { MatchCard } from "@/components/_design/MatchCard";
```

Section:

```tsx
        <Section id="match" title="11 · MatchCard">
          <div className="space-y-3 max-w-3xl">
            <MatchCard
              outcome="win"
              champion="Yasuo"
              role="Mid"
              kda={{ k: 12, d: 4, a: 7 }}
              durationMin={28}
              queue="Ranked Solo"
              when="il y a 2h"
            />
            <MatchCard
              outcome="loss"
              champion="LeeSin"
              role="Jungle"
              kda={{ k: 3, d: 9, a: 4 }}
              durationMin={32}
              queue="Ranked Flex"
              when="il y a 5h"
            />
            <MatchCard
              outcome="win"
              champion="Ahri"
              role="Mid"
              kda={{ k: 8, d: 2, a: 14 }}
              durationMin={24}
              queue="Normal"
              when="hier"
            />
          </div>
        </Section>
```

- [ ] **Step 2: Reload, expect error**

- [ ] **Step 3: Implement MatchCard**

Create `src/components/_design/MatchCard.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { cn } from "@/lib/design/cn";
import { ChampionPortrait } from "./ChampionPortrait";

export interface MatchCardProps {
  outcome: "win" | "loss";
  champion: string;
  role?: string;
  kda: { k: number; d: number; a: number };
  durationMin: number;
  queue?: string;
  when?: string;
  className?: string;
}

export function MatchCard({
  outcome,
  champion,
  role,
  kda,
  durationMin,
  queue,
  when,
  className,
}: MatchCardProps) {
  const ratio = ((kda.k + kda.a) / Math.max(1, kda.d)).toFixed(2);
  const winLossClass = outcome === "win" ? "border-l-hf-win" : "border-l-hf-loss";
  const outcomeText = outcome === "win" ? "VICTOIRE" : "DÉFAITE";
  const outcomeColor = outcome === "win" ? "text-hf-win" : "text-hf-loss";
  return (
    <div
      className={cn(
        "rounded-hf-card border border-hf-line bg-hf-surface border-l-[4px] p-4 flex items-center gap-4",
        winLossClass,
        className,
      )}
    >
      <ChampionPortrait name={champion} variant="square" size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className={cn("text-hf-eyebrow uppercase font-bold tracking-[0.15em]", outcomeColor)}>
            {outcomeText}
          </span>
          {queue ? <span className="text-hf-body-sm text-hf-navy-soft">· {queue}</span> : null}
        </div>
        <div className="font-display text-hf-display-3 text-hf-navy">
          {champion}
          {role ? <span className="text-hf-navy-soft text-hf-body ml-2 font-body font-normal">{role}</span> : null}
        </div>
      </div>
      <div className="text-right">
        <div className="font-display text-hf-display-3 tabular-nums">
          {kda.k}<span className="text-hf-navy-soft">/</span>{kda.d}<span className="text-hf-navy-soft">/</span>{kda.a}
        </div>
        <div className="text-hf-body-sm text-hf-navy-soft">
          {ratio} KDA · {durationMin} min{when ? ` · ${when}` : ""}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Barrel**

```ts
export { MatchCard } from "./MatchCard";
export type { MatchCardProps } from "./MatchCard";
```

- [ ] **Step 5: Reload, verify**

3 match cards stacked. Wins have green left border; the loss has red. KDA in display font, ratio + duration below in body-sm. Champion portrait on the left.

- [ ] **Step 6: Screenshot, commit**

```bash
git add src/components/_design/MatchCard.tsx src/components/_design/index.ts src/app/internal/components/page.tsx
git commit -m "feat(webapp): Honey Friendly MatchCard (W/L colored border)"
```

---

## Task 16 — `<Header>` (new design, isolated to demo for now)

**Files:**
- Create: `src/components/_design/Header.tsx`
- Modify: `src/components/_design/index.ts`
- Modify: `src/app/internal/components/page.tsx`

Phase 1 keeps the new Header out of the app's `layout.tsx` — it shows only on the demo page and on `/internal/components`. Phase 2 will wire it globally.

- [ ] **Step 1: Add Header preview**

Import:

```tsx
import { HeaderHF } from "@/components/_design/Header";
```

Add this BEFORE the `<header>` element of the demo page (so the new HeaderHF appears on top, in addition to the page's own `<header>` which describes the demo):

```tsx
      <HeaderHF />
```

In other words, the JSX returned by `ComponentsDemoPage` becomes:

```tsx
  return (
    <main className="min-h-screen bg-hf-bg font-body text-hf-navy">
      <HeaderHF />
      <div className="mx-auto max-w-[1100px] px-6 py-16">
        ...
      </div>
    </main>
  );
```

- [ ] **Step 2: Reload, expect error**

- [ ] **Step 3: Implement HeaderHF**

Create `src/components/_design/Header.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
"use client";
import Link from "next/link";
import * as React from "react";
import { RiDiscordFill } from "@remixicon/react";
import { Button } from "./Button";
import { cn } from "@/lib/design/cn";

const NAV = [
  { label: "Fonctionnalités", href: "/#features" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Mini-jeux", href: "/game" },
  { label: "Documentation", href: "/documentation" },
];

export function HeaderHF({ className }: { className?: string }) {
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
              className="text-hf-body-sm font-medium text-hf-navy-soft hover:text-hf-honey transition-colors"
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
          <Button size="sm" variant="primary">
            <RiDiscordFill className="size-4" />
            Ajouter
          </Button>
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

- [ ] **Step 4: Barrel**

```ts
export { HeaderHF } from "./Header";
```

- [ ] **Step 5: Reload, verify**

Sticky header at top of `/internal/components` with logo + nav (hidden on mobile) + "Mon profil" link + "+ Ajouter" Discord button. Subtle blur on scroll.

- [ ] **Step 6: Screenshot, commit**

```bash
git add src/components/_design/Header.tsx src/components/_design/index.ts src/app/internal/components/page.tsx
git commit -m "feat(webapp): Honey Friendly Header (demo-only, not yet wired into layout)"
```

---

## Task 17 — `<Footer>`

**Files:**
- Create: `src/components/_design/Footer.tsx`
- Modify: `src/components/_design/index.ts`
- Modify: `src/app/internal/components/page.tsx`

- [ ] **Step 1: Add Footer preview**

Import:

```tsx
import { FooterHF } from "@/components/_design/Footer";
```

Add `<FooterHF />` immediately after the closing `</div>` of `mx-auto max-w-[1100px] ...`, inside the `<main>`:

```tsx
        ...
      </div>
      <FooterHF />
    </main>
```

- [ ] **Step 2: Reload, expect error**

- [ ] **Step 3: Implement FooterHF**

Create `src/components/_design/Footer.tsx`:

```tsx
/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import Link from "next/link";
import * as React from "react";
import { RiDiscordFill, RiGithubFill } from "@remixicon/react";
import { cn } from "@/lib/design/cn";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Produit",
    links: [
      { label: "Fonctionnalités", href: "/#features" },
      { label: "Mini-jeux", href: "/game" },
      { label: "Shop", href: "/shop" },
    ],
  },
  {
    title: "Joueurs",
    links: [
      { label: "Mon profil", href: "/profile" },
      { label: "Recherche", href: "/search" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Documentation", href: "/documentation" },
      { label: "Resources", href: "/resources" },
    ],
  },
];

export function FooterHF({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "border-t border-hf-line bg-hf-surface",
        className,
      )}
    >
      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="font-display font-bold text-hf-body-lg text-hf-navy">Beemobot</div>
            <p className="mt-2 text-hf-body-sm text-hf-navy-soft max-w-[14rem]">
              Le bot Discord pour ta communauté League of Legends.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <div className="text-hf-eyebrow uppercase tracking-[0.15em] text-hf-honey mb-3">
                {col.title}
              </div>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-hf-body-sm text-hf-navy-soft hover:text-hf-navy transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-hf-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-hf-body-sm text-hf-navy-soft">
            © {new Date().getFullYear()} BeemoBot Enterprise.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://discord.com"
              aria-label="Discord"
              className="text-hf-navy-soft hover:text-hf-honey transition-colors"
            >
              <RiDiscordFill className="size-5" />
            </a>
            <a
              href="https://github.com"
              aria-label="GitHub"
              className="text-hf-navy-soft hover:text-hf-honey transition-colors"
            >
              <RiGithubFill className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Barrel**

```ts
export { FooterHF } from "./Footer";
```

- [ ] **Step 5: Reload, verify**

Footer renders at bottom of demo page with 4 columns (Beemobot intro + Produit / Joueurs / Ressources), copyright bar, Discord + GitHub icons (Remixicon, NOT emoji).

- [ ] **Step 6: Screenshot, commit**

```bash
git add src/components/_design/Footer.tsx src/components/_design/index.ts src/app/internal/components/page.tsx
git commit -m "feat(webapp): Honey Friendly Footer (demo-only)"
```

---

## Task 18 — Final visual review of `/internal/components`

**Files:**
- None modified — this is a verification task.

- [ ] **Step 1: Run dev server and walk the demo end-to-end**

```bash
pnpm dev
```

Open `http://localhost:3000/internal/components`. Scroll through every section in order:
1. Tokens — color swatches + typography
2. Button — 4 variants × 3 sizes + 2 disabled
3. Eyebrow — 3 examples
4. Pill — 4 variants
5. Card — 3 variants
6. StatNumber — 3 stats
7. SectionShell — eyebrow + title + lead + 3 cards
8. TeemoMascot — 3 sizes
9. RankBadge — 10 tiers
10. ChampionPortrait — 4 + splash
11. MatchCard — 3 cards (W/L/W)

Check : sticky HeaderHF on top, FooterHF at the bottom. No emoji anywhere — only Remixicon SVG icons.

- [ ] **Step 2: Take a full-page screenshot for the PR**

Playwright: navigate, screenshot full page, save as `docs/superpowers/plans/screenshots/phase1-final.png`.

- [ ] **Step 3: Verify no emoji crept in**

```bash
python3 - <<'PY'
import re, pathlib, sys
emoji = re.compile(r'[\U0001F300-\U0001FAFF☀-➿]')
hits = [(str(p), i, m.group())
  for root in ('src/components/_design', 'src/app/internal')
  for p in pathlib.Path(root).rglob('*')
  if p.is_file()
  for i, l in enumerate(p.read_text(errors='ignore').splitlines(), 1)
  for m in [emoji.search(l)] if m]
if hits:
    for h in hits: print('{}:{}: {!r}'.format(*h))
    sys.exit(1)
print('OK no emoji')
PY
```

Expected: `OK no emoji` (exit 0). If something matches, replace the emoji with a Remixicon icon before committing.

- [ ] **Step 4: Verify build succeeds**

```bash
pnpm build
```

Expected: build completes with no errors. If a missing import or type error appears, fix it. Existing pages should still build (we haven't touched them).

- [ ] **Step 5: Commit screenshots and a PR-ready note**

```bash
git add docs/superpowers/plans/screenshots/
git commit -m "docs(webapp): Phase 1 visual validation screenshots"
```

---

## Definition of Done

- All 12 components render correctly on `/internal/components`
- Sticky `HeaderHF` and `FooterHF` framing the demo page
- `pnpm build` passes
- No emoji in `src/components/_design/` or `src/app/internal/`
- Old AlignUI tokens and components are untouched and existing pages still render unchanged at `/`, `/profile`, `/leaderboard`, etc.
- Screenshots committed under `docs/superpowers/plans/screenshots/phase1-*.png`

## What's NOT in this plan (Phase 2+)

- Wiring `HeaderHF` / `FooterHF` into the global `layout.tsx` (replaces existing Header/Footer)
- Migrating the landing page to use the new design system
- Migrating the profile page (linked + non-linked) — including the Summoner Header, Quirky Stats, Recent Events
- Migrating Leaderboard, Search, Game, Shop, Settings, Documentation, Resources, Auth callback, 404
- Removing AlignUI dark tokens from `tailwind.config.js` and `globals.css`
- Removing old `src/components/atoms/Button.tsx`, `Card.tsx`, etc. once everything migrated
- Adding extra Teemo poses (idle / hello / surprise / sleeping)
- Localizing copy strings beyond the demo

Each of those is a separate plan after this one merges.
