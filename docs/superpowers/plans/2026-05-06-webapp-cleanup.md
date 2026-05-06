# Webapp Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refonte visuelle complète du site vitrine BeemoBot vers un design sobre et cohérent (palette restreinte, police Geist, zéro effet "magique"), tout en préservant l'identité gaming/LoL.

**Architecture:** Approche bottom-up en 7 phases : tokens CSS d'abord, puis atomes, layout, landing, pages utilisateur, pages utilitaires, mini-jeux. Chaque phase produit un commit indépendant et testable visuellement. Pas de tests automatisés (le projet n'en a pas), mais chaque tâche se termine par `pnpm build` + vérification visuelle dans le navigateur.

**Tech Stack:** Next.js 15 (App Router) · React 19 · Tailwind 3.4 · Geist (next/font/google) · class-variance-authority. Three.js / @react-three/* / framer-motion sont supprimés progressivement quand plus aucun composant ne les utilise.

**Spec source:** `docs/superpowers/specs/2026-05-06-webapp-cleanup-design.md`

---

## Conventions de ce plan

- **Commits :** chaque tâche se termine par 1 commit. Format : `refactor(webapp): <phase>: <ce qui a changé>`. Co-author Claude obligatoire.
- **Vérification visuelle :** après chaque tâche qui touche à un rendu, lancer `pnpm dev` et vérifier la/les pages impactées dans le navigateur. Pas d'exception.
- **Build vert avant commit :** `pnpm build` doit passer. Si ça casse à cause d'imports orphelins de composants supprimés, on corrige dans la même tâche.
- **Suppression d'un composant :** on grep d'abord les usages (`grep -rl "<NomComposant>" src/`), on remplace ou supprime les usages, **puis** on supprime le fichier.
- **Pas de framer-motion sur les nouveaux composants.** Les anciens composants encore en place peuvent l'utiliser temporairement, mais on ne réintroduit pas. Quand `framer-motion` n'est plus importé nulle part : on retire la dep en phase finale.

---

## Phase 0 : Setup

### Task 0.1 : Branche dédiée

**Files:** N/A

- [ ] **Step 1: Créer la branche**

```bash
git checkout -b refactor/webapp-cleanup
```

- [ ] **Step 2: Vérifier l'état**

```bash
git status
```

Expected: `On branch refactor/webapp-cleanup` + working tree clean.

---

## Phase 1 : Design tokens, police, suppression d'utilitaires

### Task 1.1 : Police Geist via `next/font/google`

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Remplacer Inter par Geist**

Remplacer le contenu complet du fichier par :

```tsx
import MainLayout from "@/components/templates/MainLayout";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";

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
    <html lang="fr" suppressHydrationWarning className={geist.variable}>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col font-sans antialiased">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Vérifier le build**

Run: `pnpm build`
Expected: build succeed (les variables `--bg` et `--text` n'existent pas encore en CSS donc le rendu sera fallback transparent → on corrige en Task 1.2 juste après).

- [ ] **Step 3: Pas de commit ici** — on enchaîne sur 1.2 et on commit ensemble (ces deux tâches sont indissociables).

### Task 1.2 : Nouveau `globals.css`

**Files:**
- Modify: `src/styles/globals.css` (réécriture complète)

- [ ] **Step 1: Réécrire `globals.css`**

Remplacer l'intégralité par :

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #0b0d12;
  --surface: #151821;
  --surface-hover: #1b1f2b;
  --border: #262a36;
  --text: #e8eaf0;
  --text-muted: #9aa0b0;
  --accent: #3b82f6;
  --accent-hover: #2563eb;
  --accent-gold: #f5b528;
  --danger: #ef4444;
  --radius: 8px;
}

@layer base {
  * {
    border-color: var(--border);
  }
  html {
    scroll-behavior: smooth;
  }
  body {
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4 {
    color: var(--text);
    font-weight: 600;
    letter-spacing: -0.01em;
  }
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg);
}
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

::selection {
  background: rgba(59, 130, 246, 0.3);
  color: var(--text);
}
```

- [ ] **Step 2: Vérifier le build**

Run: `pnpm build`
Expected: build can fail — beaucoup de composants utilisent encore `bg-[var(--bg-void)]`, `glow-hextech-blue`, etc. **C'est attendu**. On corrige les compos un par un dans les phases suivantes. Pour l'instant on a juste besoin que la compilation TS passe et que les classes inconnues soient juste ignorées par Tailwind. Si l'erreur est strictement du TS/JSX et pas du CSS, corriger.

- [ ] **Step 3: Lancer dev et inspecter**

Run: `pnpm dev`
Visual check: aller sur `http://localhost:3000`. Le site sera cassé visuellement (couleurs manquantes, glows partout disparus). C'est attendu — on est au début du refactor. Vérifier seulement qu'il n'y a pas de page blanche / erreur runtime bloquante.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/styles/globals.css
git commit -m "refactor(webapp): tokens: nouvelle palette, police Geist

- Remplace Inter par Geist (next/font/google)
- Réécrit globals.css : palette restreinte (--bg, --surface, --border, --text, --accent, --accent-gold)
- Supprime tous les utilitaires glow-*, text-glow-*, gradient-text-*, clip-hexagon, honeycomb-bg, glass-hextech, border-hextech
- Supprime body::after radial-gradient
- Le rendu est temporairement cassé : les composants seront refactorisés dans les phases suivantes

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 1.3 : Nettoyer `tailwind.config.js`

**Files:**
- Modify: `tailwind.config.js` (réécriture complète)

- [ ] **Step 1: Réécrire `tailwind.config.js`**

Remplacer l'intégralité par :

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        border: "var(--border)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-gold": "var(--accent-gold)",
        danger: "var(--danger)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        sm: "4px",
        md: "var(--radius)",
        lg: "12px",
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Vérifier le build**

Run: `pnpm build`
Expected: build peut encore casser sur des composants qui référencent `text-hextech-blue`, `bg-rune-purple`, `from-yellow-400`, etc. C'est attendu.

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.js
git commit -m "refactor(webapp): tokens: tailwind.config réécrit, plugins/animations/keyframes supprimés

- Couleurs réduites au strict nécessaire (mappées sur les CSS vars)
- Plugin tailwindcss-animate retiré
- Keyframes/animations custom (shimmer, typewriter, particle-float, glow-pulse, etc.) retirés
- Container max-width passe à 1200px

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 1.4 : Supprimer les fichiers de fonts Inter inutilisés

**Files:**
- Delete: `src/styles/fonts/Inter-Bold.woff2`, `src/styles/fonts/Inter-Medium.woff2`, `src/styles/fonts/Inter-Regular.woff2`
- Delete: `src/styles/fonts/` (si vide après)
- Delete: `src/styles/global.css` (typo orpheline, doublon de globals.css — vérifier d'abord qu'il n'est référencé nulle part)

- [ ] **Step 1: Vérifier que `global.css` (sans s) n'est référencé nulle part**

Run: `grep -rl "global.css" src/ --include="*.tsx" --include="*.ts" --include="*.js" --include="*.mjs"`
Expected: aucune ligne (le seul résultat doit être `globals.css` avec un s, qui ne match pas).

Si jamais quelque chose le référence, ouvrir le fichier `src/styles/global.css`, vérifier son contenu, et soit fusionner soit supprimer la référence.

- [ ] **Step 2: Supprimer les woff2**

```bash
rm -rf src/styles/fonts
rm -f src/styles/global.css
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor(webapp): tokens: supprime les woff2 Inter inutilisés et global.css orphelin

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 2 : Atoms

### Task 2.1 : Réécrire `Button.tsx`

**Files:**
- Modify: `src/components/atoms/Button.tsx`

- [ ] **Step 1: Remplacer le contenu**

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-accent text-white hover:bg-accent-hover",
        secondary:
          "bg-surface text-text border border-border hover:bg-surface-hover",
        ghost: "text-text hover:bg-surface",
        danger: "bg-danger text-white hover:bg-red-600",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={twMerge(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export default Button;
```

- [ ] **Step 2: Vérifier les usages cassés**

Run: `grep -rn "variant=\"default\"\|variant=\"outline\"\|variant=\"link\"\|variant=\"destructive\"" src/ --include="*.tsx"`
Expected: lister tous les fichiers à corriger (ils utilisent les anciens variants).

Pour chaque résultat, mapper :
- `default` → `primary`
- `destructive` → `danger`
- `outline` → `secondary`
- `link` → `ghost` (ou conserver le texte avec underline si vraiment besoin)

Ne pas commiter encore — on rassemble avec 2.2.

### Task 2.2 : Réécrire `Card.tsx`

**Files:**
- Modify: `src/components/atoms/Card.tsx`

- [ ] **Step 1: Remplacer le contenu**

```tsx
import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={twMerge(
        "rounded-md border border-border bg-surface text-text",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge("flex flex-col gap-1.5 p-6 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={twMerge("text-xl font-semibold", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={twMerge("text-sm text-text-muted", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={twMerge("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
```

- [ ] **Step 2: Build (le build peut toujours casser ailleurs, on s'en occupe en 2.4)**

Run: `pnpm build`
On note les erreurs de TS sur les anciens variants de Button et on attaque 2.4.

### Task 2.3 : Créer `Input`, `Label`, `Badge`

**Files:**
- Create: `src/components/atoms/Input.tsx`
- Create: `src/components/atoms/Label.tsx`
- Create: `src/components/atoms/Badge.tsx`

- [ ] **Step 1: Créer `Input.tsx`**

```tsx
import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={twMerge(
        "h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export default Input;
```

- [ ] **Step 2: Créer `Label.tsx`**

```tsx
import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={twMerge(
        "text-sm font-medium text-text-muted",
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = "Label";

export default Label;
```

- [ ] **Step 3: Créer `Badge.tsx`**

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { twMerge } from "tailwind-merge";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "border-border bg-surface text-text-muted",
        accent: "border-transparent bg-accent text-white",
        gold: "border-transparent bg-accent-gold/20 text-accent-gold",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      ref={ref}
      className={twMerge(badgeVariants({ variant }), className)}
      {...props}
    />
  ),
);
Badge.displayName = "Badge";

export default Badge;
```

### Task 2.4 : Migrer les call-sites de `Button` vers les nouveaux variants

**Files:**
- Modify: tous les fichiers qui utilisent `<Button variant="default|outline|link|destructive">`

- [ ] **Step 1: Lister les fichiers à corriger**

Run: `grep -rln "variant=\"default\"\|variant=\"outline\"\|variant=\"link\"\|variant=\"destructive\"" src/`

- [ ] **Step 2: Pour chaque fichier de la liste, appliquer le mapping**

Mapping :
- `variant="default"` → `variant="primary"`
- `variant="destructive"` → `variant="danger"`
- `variant="outline"` → `variant="secondary"`
- `variant="link"` → `variant="ghost"`
- `size="default"` → `size="md"`

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: les erreurs liées à `variant` doivent être résolues. Il peut rester des erreurs sur `HexButton`, `GlowingText`, etc. — on s'en occupe en 2.5.

### Task 2.5 : Supprimer les atomes obsolètes (sans casser le build)

**Files:**
- Delete: `src/components/atoms/HexButton.tsx`
- Delete: `src/components/atoms/HexagonFrame.tsx`
- Delete: `src/components/atoms/GlowOrb.tsx`
- Delete: `src/components/atoms/GlowingText.tsx`
- Delete: `src/components/atoms/DiamondBadge.tsx`
- Delete: `src/components/atoms/ParticleCanvas.tsx`
- Delete: `src/components/atoms/TypewriterText.tsx`

- [ ] **Step 1: Pour chaque atome à supprimer, lister ses imports**

```bash
for c in HexButton HexagonFrame GlowOrb GlowingText DiamondBadge ParticleCanvas TypewriterText; do
  echo "=== $c ==="
  grep -rln "$c" src/ --include="*.tsx" --include="*.ts" | grep -v "components/atoms/$c"
done
```

- [ ] **Step 2: Pour chaque usage, remplacer par l'équivalent sobre**

Mapping :
- `<HexButton variant="blue|...">` → `<Button variant="primary">` (importer `Button` depuis `@/components/atoms/Button`)
- `<HexButton variant="gold">` → `<Button variant="secondary">`
- `<HexagonFrame>...</HexagonFrame>` → `<div className="rounded-md border border-border p-...">...</div>` (garder padding/margin, supprimer la forme hexagonale)
- `<GlowOrb />` → supprimer purement et simplement (élément décoratif)
- `<GlowingText>text</GlowingText>` → `<span>text</span>` (le texte reste, juste plus de glow)
- `<DiamondBadge>x</DiamondBadge>` → `<Badge variant="accent">x</Badge>`
- `<ParticleCanvas ... />` → supprimer
- `<TypewriterText text="X" />` → `<>X</>` (texte statique)

- [ ] **Step 3: Supprimer les fichiers**

```bash
rm src/components/atoms/HexButton.tsx \
   src/components/atoms/HexagonFrame.tsx \
   src/components/atoms/GlowOrb.tsx \
   src/components/atoms/GlowingText.tsx \
   src/components/atoms/DiamondBadge.tsx \
   src/components/atoms/ParticleCanvas.tsx \
   src/components/atoms/TypewriterText.tsx
```

- [ ] **Step 4: Build**

Run: `pnpm build`
Expected: build vert. Si imports orphelins restent, les corriger avant commit.

### Task 2.6 : Simplifier `StatCounter` et auditer `ProgressRing`

**Files:**
- Modify: `src/components/atoms/StatCounter.tsx`
- Audit: `src/components/atoms/ProgressRing.tsx`
- Delete: `src/hooks/useCountUp.ts` (si existe et plus utilisé après la modif de StatCounter)

- [ ] **Step 1: Vérifier les usages de `ProgressRing`**

Run: `grep -rln "ProgressRing" src/ --include="*.tsx"`

Si aucun résultat hors du fichier lui-même : supprimer `ProgressRing.tsx`. Sinon : le garder en l'état (la décision dépend de l'usage réel — si c'est purement décoratif, le supprimer ; si c'est de la donnée réelle, le garder en simplifiant les couleurs vers `--accent`).

- [ ] **Step 2: Réécrire `StatCounter.tsx` sans count-up**

```tsx
import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface StatCounterProps {
  value: number | string;
  label: string;
  className?: string;
}

const StatCounter = ({ value, label, className }: StatCounterProps) => (
  <div className={twMerge("flex flex-col items-center gap-1", className)}>
    <span className="text-3xl font-semibold text-text">{value}</span>
    <span className="text-sm text-text-muted">{label}</span>
  </div>
);

export default StatCounter;
```

- [ ] **Step 3: Supprimer `useCountUp` si plus utilisé**

```bash
grep -rln "useCountUp" src/ --include="*.tsx" --include="*.ts"
```

Si seul le fichier source apparaît : `rm src/hooks/useCountUp.ts`.

### Task 2.7 : Simplifier `BeeIcon`

**Files:**
- Modify: `src/components/atoms/BeeIcon.tsx`

- [ ] **Step 1: Lire le fichier actuel**

```bash
cat src/components/atoms/BeeIcon.tsx
```

- [ ] **Step 2: Vérifier que les SVG paths utilisent `currentColor` (pas de `fill="#xxx"` hardcodé)**

Si oui : laisser tel quel.
Si non : remplacer chaque `fill="#..."` par `fill="currentColor"` (sauf détails à conserver intentionnellement). Le composant doit rendre une icône monochrome qui prend la couleur du parent via `text-...`.

### Task 2.8 : Simplifier `FeatureCard` et `StatCard`

**Files:**
- Modify: `src/components/molecules/FeatureCard.tsx`
- Modify: `src/components/molecules/StatCard.tsx`

- [ ] **Step 1: Réécrire `FeatureCard.tsx`**

```tsx
import * as React from "react";
import { Card } from "@/components/atoms/Card";

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Card className="p-6">
    <div className="text-text-muted mb-3 [&>svg]:h-6 [&>svg]:w-6">{icon}</div>
    <h3 className="text-xl font-semibold text-text mb-1">{title}</h3>
    <p className="text-sm text-text-muted leading-relaxed">{description}</p>
  </Card>
);

export default FeatureCard;
```

- [ ] **Step 2: Réécrire `StatCard.tsx`**

```tsx
import * as React from "react";
import { Card } from "@/components/atoms/Card";

export interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
}

const StatCard = ({ label, value, hint }: StatCardProps) => (
  <Card className="p-6 flex flex-col gap-1">
    <span className="text-sm text-text-muted">{label}</span>
    <span className="text-3xl font-semibold text-text">{value}</span>
    {hint && <span className="text-xs text-text-muted">{hint}</span>}
  </Card>
);

export default StatCard;
```

- [ ] **Step 3: Mettre à jour les call-sites si la signature a changé**

Si les anciens props étaient nommés différemment (ex: `name`, `count`), grep et adapter :
```bash
grep -rln "FeatureCard\|StatCard" src/ --include="*.tsx" | grep -v "components/molecules/"
```
Adapter les appels.

### Task 2.9 : Build vert + commit Phase 2

- [ ] **Step 1: Build complet**

Run: `pnpm build`
Expected: build vert.

- [ ] **Step 2: Lancer dev et vérifier visuellement**

Run: `pnpm dev`
Visual check : ouvrir `http://localhost:3000` et `http://localhost:3000/profile` (si accessible). Beaucoup de pages sont encore moches et inconsistantes — c'est attendu, on va les refondre dans les phases 4-7. Vérifier seulement : pas d'erreur runtime, les boutons cliquent, les pages se chargent.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor(webapp): atoms: Button/Card sobres, ajout Input/Label/Badge, suppression compos décoratifs

- Button : variants primary/secondary/ghost/danger, plus de glow
- Card : surface + border, plus de gradient/glassmorphism
- Nouveaux : Input, Label, Badge
- Supprimés : HexButton, HexagonFrame, GlowOrb, GlowingText, DiamondBadge, ParticleCanvas, TypewriterText
- StatCounter sans count-up animé
- FeatureCard / StatCard normalisés sur Card
- BeeIcon : SVG en currentColor
- Hook useCountUp supprimé

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 3 : Layout (Header, Navbar, Footer, MainLayout)

### Task 3.1 : Réécrire `Navbar.tsx`

**Files:**
- Modify: `src/components/molecules/Navbar.tsx`

- [ ] **Step 1: Remplacer le contenu**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  items: NavItem[];
  onMobileNavigate?: () => void;
}

const Navbar = ({ items, onMobileNavigate }: NavbarProps) => {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onMobileNavigate}
              className={twMerge(
                "block px-3 py-2 text-sm rounded-md transition-colors",
                active
                  ? "text-text"
                  : "text-text-muted hover:text-text hover:bg-surface",
              )}
            >
              {item.label}
              {active && (
                <span className="hidden md:block h-0.5 bg-accent mt-1.5 -mx-3" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Navbar;
```

### Task 3.2 : Réécrire `Header.tsx`

**Files:**
- Modify: `src/components/organisms/Header.tsx`

- [ ] **Step 1: Remplacer le contenu**

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaDiscord } from "react-icons/fa";
import { LOGO } from "@/assets/images";
import Navbar from "@/components/molecules/Navbar";
import Button from "@/components/atoms/Button";
import { getToken, removeToken } from "@/lib/store/token";
import { API_URL } from "@/lib/env";
import { twMerge } from "tailwind-merge";

const navItems = [
  { label: "Recherche", href: "/search" },
  { label: "Mini-jeux", href: "/game" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Documentation", href: "/documentation" },
  { label: "Resources", href: "/resources" },
];

const Header = () => {
  const [authed, setAuthed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setAuthed(!!getToken());
  }, [mounted]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const login = () => {
    if (typeof window !== "undefined") {
      window.location.href = `${API_URL}/auth/discord/redirect`;
    }
  };

  const logout = () => {
    removeToken();
    setAuthed(false);
    router.push("/");
  };

  return (
    <header
      className={twMerge(
        "sticky top-0 z-50 h-16 bg-bg transition-colors",
        scrolled && "border-b border-border",
      )}
    >
      <div className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src={LOGO.teemo}
            alt="BeemoBot"
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="font-semibold tracking-tight">BeemoBot</span>
        </Link>

        <nav className="hidden md:block">
          <Navbar items={navItems} />
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {mounted && authed ? (
            <>
              <Link href="/profile">
                <Button variant="secondary" size="sm">Profil</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <Button variant="primary" size="sm" onClick={login}>
              <FaDiscord className="h-4 w-4" />
              Connexion
            </Button>
          )}
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-text"
          aria-label="Menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-surface border-b border-border shadow-md">
          <div className="max-w-[1200px] mx-auto p-4 flex flex-col gap-4">
            <Navbar items={navItems} onMobileNavigate={() => setMenuOpen(false)} />
            <div className="border-t border-border pt-4 flex flex-col gap-2">
              {mounted && authed ? (
                <>
                  <Link href="/profile" onClick={() => setMenuOpen(false)}>
                    <Button variant="secondary" size="md" className="w-full">Profil</Button>
                  </Link>
                  <Button variant="ghost" size="md" className="w-full" onClick={logout}>
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Button variant="primary" size="md" className="w-full" onClick={login}>
                  <FaDiscord className="h-4 w-4" />
                  Connexion
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
```

### Task 3.3 : Réécrire `MainLayout.tsx`

**Files:**
- Modify: `src/components/templates/MainLayout.tsx`

- [ ] **Step 1: Remplacer le contenu**

```tsx
"use client";

import dynamic from "next/dynamic";
import Footer from "@/components/organisms/Footer";

const Header = dynamic(() => import("@/components/organisms/Header"), {
  ssr: false,
});

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => (
  <>
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
  </>
);

export default MainLayout;
```

Note : on supprime le `pt-20` (la nouvelle Header est `sticky` non `fixed`, donc pas besoin de padding-top sur main).

### Task 3.4 : Réécrire `Footer.tsx`

**Files:**
- Modify: `src/components/organisms/Footer.tsx`

- [ ] **Step 1: Lire le fichier actuel** pour comprendre la structure des liens

```bash
cat src/components/organisms/Footer.tsx
```

- [ ] **Step 2: Remplacer le contenu**

```tsx
import Link from "next/link";
import Image from "next/image";
import { LOGO } from "@/assets/images";
import { FaGithub, FaDiscord, FaTwitter } from "react-icons/fa";

const sections = [
  {
    title: "Produit",
    links: [
      { label: "Mini-jeux", href: "/game" },
      { label: "Recherche", href: "/search" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
  },
  {
    title: "Communauté",
    links: [
      { label: "Documentation", href: "/documentation" },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions légales", href: "/legal" },
      { label: "Confidentialité", href: "/privacy" },
    ],
  },
];

const socials = [
  { icon: FaDiscord, href: "https://discord.gg/", label: "Discord" },
  { icon: FaGithub, href: "https://github.com/", label: "GitHub" },
  { icon: FaTwitter, href: "https://twitter.com/", label: "Twitter" },
];

const Footer = () => (
  <footer className="border-t border-border bg-bg">
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-3">
            <Image src={LOGO.teemo} alt="BeemoBot" width={24} height={24} className="rounded-full" />
            <span className="font-semibold">BeemoBot</span>
          </Link>
          <p className="text-sm text-text-muted max-w-xs">
            Le bot Discord pour ta communauté League of Legends.
          </p>
          <div className="flex gap-3 mt-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="text-text-muted hover:text-text transition-colors"
              >
                <s.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
        {sections.map((section) => (
          <div key={section.title}>
            <h4 className="text-sm font-semibold text-text mb-3">{section.title}</h4>
            <ul className="flex flex-col gap-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between gap-2 text-xs text-text-muted">
        <span>© {new Date().getFullYear()} BeemoBot Enterprise. Tous droits réservés.</span>
        <span>Made with care.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
```

### Task 3.5 : Supprimer `ScrollIndicator`

**Files:**
- Delete: `src/components/molecules/ScrollIndicator.tsx`

- [ ] **Step 1: Vérifier les usages**

```bash
grep -rln "ScrollIndicator" src/ --include="*.tsx" | grep -v "components/molecules/ScrollIndicator"
```

- [ ] **Step 2: Pour chaque usage, supprimer l'import + le tag JSX `<ScrollIndicator />`**

- [ ] **Step 3: Supprimer le fichier**

```bash
rm src/components/molecules/ScrollIndicator.tsx
```

### Task 3.6 : Build, vérif, commit Phase 3

- [ ] **Step 1: Build**

Run: `pnpm build`
Expected: vert.

- [ ] **Step 2: Vérification visuelle**

Run: `pnpm dev`
Visual check : la barre de nav doit être propre, sticky, hauteur 64px, pas de blur, lien actif underline accent. Footer 4 colonnes propres. Mobile : burger qui ouvre un drawer simple.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor(webapp): layout: Header/Navbar/Footer/MainLayout sobres

- Header : sticky 64px, logo monochrome, nav sobre, drawer mobile simple
- Navbar : liens text-muted, actif underline accent
- Footer : grille 4 cols + socials mono
- MainLayout : suppression pt-20 (header sticky)
- ScrollIndicator supprimé

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 4 : Landing page

### Task 4.1 : Réécrire `EpicHeroSection` → renommer en `HeroSection`

**Files:**
- Create: `src/components/organisms/HeroSection.tsx`
- Delete: `src/components/organisms/EpicHeroSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Créer `HeroSection.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import Button from "@/components/atoms/Button";
import { BEEMO } from "@/assets/images";
import { BOT_INVITE_URL } from "@/lib/env";

const HeroSection = () => (
  <section className="border-b border-border">
    <div className="max-w-[1200px] mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-text mb-5">
          Le bot Discord pour ta communauté{" "}
          <span className="text-accent">League of Legends</span>.
        </h1>
        <p className="text-lg text-text-muted leading-relaxed mb-8 max-w-xl">
          Stats de joueurs, profils détaillés, leaderboards et mini-jeux —
          directement depuis ton serveur Discord.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href={BOT_INVITE_URL} target="_blank" rel="noreferrer">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <FaDiscord className="h-5 w-5" />
              Ajouter à Discord
            </Button>
          </a>
          <Link href="#features">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Voir les fonctionnalités
            </Button>
          </Link>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="aspect-square relative rounded-lg border border-border bg-surface overflow-hidden">
          <Image
            src={BEEMO.mascot}
            alt="BeemoBot mascot"
            fill
            className="object-contain p-12"
            priority
          />
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
```

Note : on garde l'image mascot mais dans une Card sobre, sans glow ni particules. Le screenshot du bot peut remplacer cette image plus tard si l'utilisateur fournit un asset — pour l'instant on garde la mascotte existante (asset déjà disponible).

- [ ] **Step 2: Supprimer `EpicHeroSection.tsx`**

```bash
rm src/components/organisms/EpicHeroSection.tsx
```

- [ ] **Step 3: Mettre à jour `src/app/page.tsx`**

```tsx
"use client";

import HeroSection from "@/components/organisms/HeroSection";
import { StatsSection } from "@/components/organisms/StatsSection";
import { FeatureShowcase } from "@/components/organisms/FeatureShowcase";
import { MinigamesPreview } from "@/components/organisms/MinigamesPreview";
import { CTASection } from "@/components/organisms/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeatureShowcase />
      <MinigamesPreview />
      <CTASection />
    </>
  );
}
```

Suppression du `-mt-20` (le hero ne déborde plus sous la nav).

### Task 4.2 : Réécrire `StatsSection`

**Files:**
- Modify: `src/components/organisms/StatsSection.tsx`

- [ ] **Step 1: Remplacer le contenu**

```tsx
import StatCard from "@/components/molecules/StatCard";

const stats = [
  { label: "Serveurs Discord", value: "150+" },
  { label: "Joueurs trackés", value: "12k+" },
  { label: "Parties analysées", value: "85k+" },
  { label: "Mini-jeux", value: "5" },
];

export const StatsSection = () => (
  <section className="border-b border-border">
    <div className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
    </div>
  </section>
);
```

### Task 4.3 : Réécrire `FeatureShowcase`

**Files:**
- Modify: `src/components/organisms/FeatureShowcase.tsx`

- [ ] **Step 1: Remplacer le contenu**

```tsx
import FeatureCard from "@/components/molecules/FeatureCard";
import {
  FaChartBar,
  FaUserShield,
  FaTrophy,
  FaGamepad,
  FaSearch,
  FaBolt,
} from "react-icons/fa";

const features = [
  {
    icon: <FaChartBar />,
    title: "Stats en temps réel",
    description:
      "Connecte ton compte Riot et affiche tes performances directement sur Discord.",
  },
  {
    icon: <FaSearch />,
    title: "Recherche de joueurs",
    description: "Trouve n'importe quel summoner par GameName#Tag et région.",
  },
  {
    icon: <FaTrophy />,
    title: "Leaderboards",
    description: "Classements shrooms et respects pour ta communauté.",
  },
  {
    icon: <FaGamepad />,
    title: "5 mini-jeux",
    description:
      "Trivia, Memory, Minesweeper, Skillshot, Guess the Champion.",
  },
  {
    icon: <FaUserShield />,
    title: "Profils Riot complets",
    description: "Rang, masteries, derniers matchs et historique.",
  },
  {
    icon: <FaBolt />,
    title: "Setup en 2 minutes",
    description: "Invite, configure, c'est prêt — pas de config bancale.",
  },
];

export const FeatureShowcase = () => (
  <section id="features" className="border-b border-border">
    <div className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="max-w-2xl mb-12">
        <h2 className="text-3xl font-semibold text-text mb-3">
          Fonctionnalités
        </h2>
        <p className="text-text-muted">
          Tout ce qu'il faut pour animer ta communauté LoL sur Discord.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </div>
  </section>
);
```

### Task 4.4 : Réécrire `MinigamesPreview`

**Files:**
- Modify: `src/components/organisms/MinigamesPreview.tsx`
- Modify: `src/components/molecules/GamePreviewCard.tsx`

- [ ] **Step 1: Réécrire `GamePreviewCard.tsx`**

```tsx
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";

export interface GamePreviewCardProps {
  slug: string;
  title: string;
  description: string;
  image: string;
}

const GamePreviewCard = ({
  slug,
  title,
  description,
  image,
}: GamePreviewCardProps) => (
  <Card className="overflow-hidden flex flex-col">
    <div className="aspect-video relative bg-bg">
      <Image src={image} alt={title} fill className="object-cover" />
    </div>
    <div className="p-5 flex flex-col gap-3 flex-1">
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed flex-1">{description}</p>
      <Link href={`/game/${slug}`} className="self-start">
        <Button variant="primary" size="sm">Jouer</Button>
      </Link>
    </div>
  </Card>
);

export default GamePreviewCard;
```

- [ ] **Step 2: Réécrire `MinigamesPreview.tsx`**

```tsx
import GamePreviewCard from "@/components/molecules/GamePreviewCard";
import { BEEMO } from "@/assets/images";

const games = [
  {
    slug: "trivia",
    title: "LoL Trivia",
    description: "Tes connaissances sur LoL au défi.",
    image: BEEMO.mascot,
  },
  {
    slug: "memory",
    title: "Memory Match",
    description: "Retrouve les paires de champions.",
    image: BEEMO.mascot,
  },
  {
    slug: "minesweeper",
    title: "Teemo Minesweeper",
    description: "Évite les shrooms, dégage les cases.",
    image: BEEMO.mascot,
  },
  {
    slug: "skillshot",
    title: "Dodge Skillshot",
    description: "Esquive les sorts qui arrivent.",
    image: BEEMO.mascot,
  },
  {
    slug: "guess",
    title: "Guess Champion",
    description: "Devine le champion à partir d'indices.",
    image: BEEMO.mascot,
  },
];

export const MinigamesPreview = () => (
  <section className="border-b border-border">
    <div className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="max-w-2xl mb-12">
        <h2 className="text-3xl font-semibold text-text mb-3">Mini-jeux</h2>
        <p className="text-text-muted">
          Joue directement depuis le site, score sauvegardé.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((g) => (
          <GamePreviewCard key={g.slug} {...g} />
        ))}
      </div>
    </div>
  </section>
);
```

Note : `BEEMO.mascot` est un placeholder. Si l'utilisateur fournit des images dédiées par mini-jeu plus tard, on les substituera. Pour le `slug`, on doit s'assurer que la route `/game/[slug]` existe — sinon on adapte les liens en task 7.

### Task 4.5 : Réécrire `CTASection`

**Files:**
- Modify: `src/components/organisms/CTASection.tsx`

- [ ] **Step 1: Remplacer le contenu**

```tsx
import { FaDiscord } from "react-icons/fa";
import Button from "@/components/atoms/Button";
import { BOT_INVITE_URL } from "@/lib/env";

export const CTASection = () => (
  <section>
    <div className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="rounded-lg border border-border bg-surface p-12 text-center">
        <h2 className="text-3xl font-semibold text-text mb-3">
          Prêt à animer ta communauté ?
        </h2>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          Invite BeemoBot sur ton serveur Discord en moins de deux minutes.
        </p>
        <a href={BOT_INVITE_URL} target="_blank" rel="noreferrer">
          <Button variant="primary" size="lg">
            <FaDiscord className="h-5 w-5" />
            Ajouter à Discord
          </Button>
        </a>
      </div>
    </div>
  </section>
);
```

### Task 4.6 : Supprimer `ParallaxBackground`, `TestimonialsSection`, `SponsorsSection` si non référencés

**Files:**
- Delete: `src/components/organisms/ParallaxBackground.tsx` (si plus référencé)
- Delete: `src/components/organisms/SponsorsSection.tsx` (si plus référencé)
- Delete: `src/hooks/useParallax.ts` (si existe et plus utilisé)
- Delete: `src/hooks/useScrollAnimation.ts` (si existe et plus utilisé)

- [ ] **Step 1: Vérifier les usages**

```bash
for c in ParallaxBackground SponsorsSection TestimonialsSection useParallax useScrollAnimation; do
  echo "=== $c ==="
  grep -rln "$c" src/ --include="*.tsx" --include="*.ts" | grep -v "/$c"
done
```

- [ ] **Step 2: Supprimer chaque fichier qui n'a plus de référence externe**

```bash
[ -f src/components/organisms/ParallaxBackground.tsx ] && \
  ! grep -rln "ParallaxBackground" src/ --include="*.tsx" | grep -v "ParallaxBackground.tsx" && \
  rm src/components/organisms/ParallaxBackground.tsx
```

(Répéter le même pattern pour les autres. Si un fichier a encore des refs externes, ne pas le supprimer dans cette tâche, ouvrir une note et traiter dans la phase suivante.)

### Task 4.7 : Build, vérif, commit Phase 4

- [ ] **Step 1: Build**

Run: `pnpm build`
Expected: vert.

- [ ] **Step 2: Vérification visuelle**

Run: `pnpm dev`
Visual check : ouvrir `/`. Doit voir : hero sobre, stats 4 chiffres, features grille 3x2, mini-jeux grille 3x2, CTA centré dans une card. Aucun glow, aucune particule, aucune 3D, aucun parallax. Texte propre en Geist.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor(webapp): landing: hero/stats/features/minigames/cta sobres

- HeroSection (remplace EpicHeroSection) : titre + sous-titre + 2 CTA + mascotte dans une card
- StatsSection : 4 cards de stats sans count-up
- FeatureShowcase : grille 3x2, icônes mono, cards sobres
- MinigamesPreview : grille 3x2, GamePreviewCard simplifié, lien /game/[slug]
- CTASection : bloc centré avec 1 CTA
- Suppression ParallaxBackground/TestimonialsSection/SponsorsSection si orphelins
- Hooks useParallax/useScrollAnimation supprimés si plus utilisés

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 5 : Pages utilisateur

### Task 5.1 : `/auth/callback`

**Files:**
- Modify: `src/app/auth/callback/page.tsx`
- Audit: `src/app/auth/link/page.tsx`

- [ ] **Step 1: Lire l'existant**

```bash
cat src/app/auth/callback/page.tsx
```

- [ ] **Step 2: Réécrire en gardant la logique métier (récup token, store, redirect), nouvelle UI**

```tsx
"use client";

// (Conserver les imports nécessaires à la logique du callback : useSearchParams,
// setToken, useRouter, useEffect — adapter selon l'existant)

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import { setToken } from "@/lib/store/token";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get("token");
    const err = params.get("error");
    if (err) {
      setError(err);
      return;
    }
    if (!token) {
      setError("missing_token");
      return;
    }
    setToken(token);
    router.push("/profile");
  }, [params, router]);

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-semibold text-text mb-2">
              Connexion impossible
            </h1>
            <p className="text-text-muted mb-6">
              Une erreur est survenue : <code className="text-text">{error}</code>
            </p>
            <Link href="/">
              <Button variant="primary">Retour à l'accueil</Button>
            </Link>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Spinner />
            <p className="text-text-muted">Connexion en cours…</p>
          </div>
        )}
      </div>
    </main>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-8 w-8 text-text-muted"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
```

**Important :** vérifier la logique métier réelle dans `cat src/app/auth/callback/page.tsx` avant écrasement. Si la callback fait autre chose (oauth state check, exchange POST vers l'API, etc.), conserver cette logique et ne réécrire que la partie présentation.

- [ ] **Step 3: Auditer `/auth/link`**

```bash
cat src/app/auth/link/page.tsx
```

Si c'est un placeholder ou une page secondaire, lui appliquer le même traitement (loader sobre + bouton retour). Sinon, traitement spécifique selon contenu.

### Task 5.2 : `/profile`

**Files:**
- Modify: `src/app/profile/page.tsx`
- Modify: `src/app/profile/[riotId]/ProfileContent.tsx`
- Modify: `src/components/organisms/ProfileSection.tsx`

- [ ] **Step 1: Lire les fichiers**

```bash
cat src/app/profile/page.tsx
cat src/app/profile/[riotId]/ProfileContent.tsx
cat src/components/organisms/ProfileSection.tsx
```

- [ ] **Step 2: Refondre `ProfileContent.tsx`** en gardant la logique de fetch et en simplifiant la présentation

Structure cible (squelette) :

```tsx
"use client";

// Garder les hooks/fetch existants
// (useEffect, axios, API_URL, etc. selon l'existant)

import Image from "next/image";
import Button from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

export default function ProfileContent({ riotId }: { riotId: string }) {
  // ... logique fetch existante
  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      {/* Header profil */}
      <section className="flex items-center gap-6 mb-10">
        <div className="h-24 w-24 rounded-full bg-surface border border-border overflow-hidden">
          {/* avatar */}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-text">{/* gameName */}</h1>
          <p className="text-text-muted">#{/* tag */} · {/* region */}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="accent">{/* rank tier */}</Badge>
            <Badge>{/* mastery */}</Badge>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid md:grid-cols-3 gap-4 mb-10">
        <Card className="p-6">
          <div className="text-sm text-text-muted">Shrooms</div>
          <div className="text-3xl font-semibold mt-1">{/* count */}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-text-muted">Respects</div>
          <div className="text-3xl font-semibold mt-1">{/* count */}</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-text-muted">Rep score</div>
          <div className="text-3xl font-semibold mt-1">{/* count */}</div>
        </Card>
      </section>

      {/* Matchs récents */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text mb-4">Matchs récents</h2>
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="text-left p-3 font-medium">Champion</th>
                <th className="text-left p-3 font-medium">KDA</th>
                <th className="text-left p-3 font-medium">Durée</th>
                <th className="text-right p-3 font-medium">Résultat</th>
              </tr>
            </thead>
            <tbody>
              {/* matches.map(...) */}
            </tbody>
          </table>
        </Card>
      </section>

      <Button variant="secondary">Se déconnecter</Button>
    </main>
  );
}
```

L'agent qui exécute doit s'occuper de réintégrer la logique de fetch existante. Pas de réécriture des appels API.

- [ ] **Step 3: Mettre à jour `page.tsx` et `ProfileSection.tsx` pour matcher**

`ProfileSection.tsx` doit utiliser le même nouveau style (Card sobre, pas de glow). Si c'est utilisé en plusieurs endroits, ajuster en cohérence.

### Task 5.3 : `/search`

**Files:**
- Modify: `src/app/search/page.tsx`

- [ ] **Step 1: Lire l'existant**

```bash
cat src/app/search/page.tsx
```

- [ ] **Step 2: Refondre l'UI en conservant la logique de search**

Structure cible :

```tsx
"use client";

import { useState } from "react";
// imports existants pour la logique fetch
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";

const REGIONS = ["EUW", "EUNE", "NA", "BR", "JP", "KR", "LA", "LAS", "OC", "TR", "RU"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("EUW");
  // ... logique existante

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-text mb-2">Recherche</h1>
      <p className="text-text-muted mb-8">
        Trouve un summoner par GameName#Tag.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          // appeler la logique de search existante
        }}
        className="flex flex-col md:flex-row gap-3 mb-10"
      >
        <div className="flex-1">
          <Label htmlFor="q" className="sr-only">Joueur</Label>
          <Input
            id="q"
            placeholder="GameName#TagLine"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          aria-label="Région"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-text"
        >
          {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <Button type="submit" variant="primary">Rechercher</Button>
      </form>

      {/* Résultat : Card avec mêmes blocs que /profile, en lecture seule */}
    </main>
  );
}
```

### Task 5.4 : `/leaderboard`

**Files:**
- Modify: `src/app/leaderboard/page.tsx`
- Modify: `src/components/organisms/LeaderboardTable.tsx`

- [ ] **Step 1: Lire l'existant**

```bash
cat src/app/leaderboard/page.tsx
cat src/components/organisms/LeaderboardTable.tsx
```

- [ ] **Step 2: Refondre la table**

```tsx
// LeaderboardTable.tsx
import Image from "next/image";
import { Card } from "@/components/atoms/Card";
import { twMerge } from "tailwind-merge";

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar?: string;
  score: number;
}

const LeaderboardTable = ({ entries }: { entries: LeaderboardEntry[] }) => (
  <Card className="overflow-hidden">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-text-muted">
          <th className="w-16 text-left p-3 font-medium">#</th>
          <th className="text-left p-3 font-medium">Joueur</th>
          <th className="text-right p-3 font-medium">Score</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((e) => (
          <tr key={e.rank} className="border-b border-border last:border-0 hover:bg-surface-hover">
            <td className={twMerge(
              "p-3 font-semibold",
              e.rank <= 3 ? "text-accent-gold" : "text-text-muted",
            )}>
              {e.rank}
            </td>
            <td className="p-3 flex items-center gap-2">
              {e.avatar && (
                <Image src={e.avatar} alt="" width={28} height={28} className="rounded-full" />
              )}
              <span className="text-text">{e.username}</span>
            </td>
            <td className="p-3 text-right text-text">{e.score.toLocaleString("fr-FR")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

export default LeaderboardTable;
```

- [ ] **Step 3: Refondre `page.tsx` avec tabs Shrooms/Respects**

```tsx
"use client";

import { useState } from "react";
import LeaderboardTable, { LeaderboardEntry } from "@/components/organisms/LeaderboardTable";
import { twMerge } from "tailwind-merge";
// imports fetch existants

const TABS = ["shrooms", "respects"] as const;
type Tab = typeof TABS[number];

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>("shrooms");
  // logique fetch selon tab

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-text mb-2">Leaderboard</h1>
      <p className="text-text-muted mb-8">Top des joueurs de la communauté.</p>

      <div className="border-b border-border mb-6 flex gap-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={twMerge(
              "px-4 py-2 text-sm capitalize transition-colors",
              tab === t
                ? "text-text border-b-2 border-accent -mb-px"
                : "text-text-muted hover:text-text",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <LeaderboardTable entries={[/* ... selon tab */] as LeaderboardEntry[]} />
    </main>
  );
}
```

### Task 5.5 : Build, vérif, commit Phase 5

- [ ] **Step 1: Build**

Run: `pnpm build`
Expected: vert.

- [ ] **Step 2: Vérification visuelle**

Run: `pnpm dev`
Visual check : `/auth/callback` (ouvrir avec `?token=test`), `/profile`, `/search`, `/leaderboard`. UI sobre, formulaires fonctionnels, table lisible, top 3 en `--accent-gold`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor(webapp): pages: auth/profile/search/leaderboard sobres

- /auth/callback : spinner sobre + gestion erreur
- /profile : header avatar + 3 stats + table matchs récents
- /search : Input + select région + résultat type profile
- /leaderboard : tabs Shrooms/Respects, top 3 en accent-gold

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 6 : Pages utilitaires

### Task 6.1 : `/documentation`

**Files:**
- Modify: `src/app/documentation/page.tsx`

- [ ] **Step 1: Lire l'existant**

```bash
cat src/app/documentation/page.tsx
```

- [ ] **Step 2: Refondre en layout sidebar + contenu**

Squelette :

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "install", label: "Installation" },
  { id: "commands", label: "Commandes" },
  { id: "minigames", label: "Mini-jeux" },
  { id: "api", label: "API" },
];

export default function DocumentationPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 grid md:grid-cols-[220px_1fr] gap-12">
      <aside className="md:sticky md:top-20 md:self-start">
        <nav>
          <ul className="flex flex-col gap-1">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface rounded-md"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <article className="prose-sober max-w-3xl">
        {/* Garder le contenu existant si pertinent, sinon réécrire en sections sobres */}
        <section id="intro" className="mb-12">
          <h1 className="text-3xl font-semibold text-text mb-3">Documentation</h1>
          <p className="text-text-muted leading-relaxed">{/* contenu */}</p>
        </section>
        {/* ... autres sections */}
      </article>
    </main>
  );
}
```

Pas de classe `prose-sober` à créer — c'est juste un placeholder du composant article. Styler les `<h2>` et `<code>` directement avec Tailwind sur les éléments. Pour les blocks de code :

```tsx
<pre className="bg-surface border border-border rounded-md p-4 text-sm overflow-x-auto">
  <code>{/* code */}</code>
</pre>
```

### Task 6.2 : `/resources`

**Files:**
- Modify: `src/app/resources/page.tsx`

- [ ] **Step 1: Lire l'existant**

```bash
cat src/app/resources/page.tsx
```

- [ ] **Step 2: Réécrire en grille de cards type FeatureShowcase**

```tsx
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/atoms/Card";

interface Resource {
  title: string;
  description: string;
  href: string;
  image?: string;
}

const resources: Resource[] = [
  // garder/adapter les ressources existantes
];

export default function ResourcesPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-text mb-2">Resources</h1>
      <p className="text-text-muted mb-8">Liens, guides et outils utiles.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((r) => (
          <a key={r.href} href={r.href} target="_blank" rel="noreferrer">
            <Card className="p-6 hover:bg-surface-hover transition-colors h-full">
              {r.image && (
                <div className="aspect-video relative mb-4 rounded-md overflow-hidden bg-bg">
                  <Image src={r.image} alt={r.title} fill className="object-cover" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-text mb-1">{r.title}</h3>
              <p className="text-sm text-text-muted">{r.description}</p>
            </Card>
          </a>
        ))}
      </div>
    </main>
  );
}
```

### Task 6.3 : `/shop` et `/u`

**Files:**
- Audit: `src/app/shop/page.tsx`
- Audit: `src/app/u/page.tsx` et sous-routes éventuelles

- [ ] **Step 1: Lire et comprendre le rôle**

```bash
cat src/app/shop/page.tsx
ls src/app/u/
cat src/app/u/page.tsx 2>/dev/null
```

- [ ] **Step 2: Appliquer le même traitement**

Principes : layout `max-w-[1200px] mx-auto px-6 py-12`, h1 sobre, contenu principal en `Card` ou en grille de cards selon l'usage. Boutons → `Button`. Inputs → `Input` + `Label`.

Si `/u` est en fait un alias court de `/profile/[riotId]` (probable, vu le pattern Riot ID), réutiliser `ProfileContent` directement.

### Task 6.4 : Build, vérif, commit Phase 6

- [ ] **Step 1: Build**

Run: `pnpm build`
Expected: vert.

- [ ] **Step 2: Vérification visuelle**

Visual check : `/documentation`, `/resources`, `/shop`, `/u/...`. Sidebar nav sticky en doc, grille de cards en resources, layout cohérent partout.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "refactor(webapp): pages utilitaires : doc/resources/shop/u sobres

- /documentation : sidebar sticky + article, code blocks sobres
- /resources : grille de cards uniformes
- /shop, /u : layout aligné sur le reste

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Phase 7 : Page `/game` et mini-jeux

### Task 7.1 : Page hub `/game`

**Files:**
- Modify: `src/app/game/page.tsx`
- Audit: la structure des sous-routes (`/game/[slug]` ou pas)

- [ ] **Step 1: Vérifier l'arbo actuelle**

```bash
ls src/app/game/
```

- [ ] **Step 2: Si pas de sous-routes, créer `/game/[slug]/page.tsx`**

```tsx
// src/app/game/[slug]/page.tsx
"use client";

import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

const GAMES: Record<string, () => Promise<any>> = {
  trivia: () => import("@/components/organisms/LoLTriviaGame"),
  memory: () => import("@/components/organisms/MemoryMatchGame"),
  minesweeper: () => import("@/components/organisms/TeemoMinesweeper"),
  skillshot: () => import("@/components/organisms/DodgeSkillshotGame"),
  guess: () => import("@/components/organisms/GuessChampionGame"),
};

export default function GamePage({ params }: { params: { slug: string } }) {
  const loader = GAMES[params.slug];
  if (!loader) notFound();
  const Game = dynamic(loader, { ssr: false });
  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <Game />
    </main>
  );
}
```

- [ ] **Step 3: Refondre `src/app/game/page.tsx` (hub)**

```tsx
import GamePreviewCard from "@/components/molecules/GamePreviewCard";
import { BEEMO } from "@/assets/images";

const games = [
  { slug: "trivia", title: "LoL Trivia", description: "Tes connaissances sur LoL au défi.", image: BEEMO.mascot },
  { slug: "memory", title: "Memory Match", description: "Retrouve les paires de champions.", image: BEEMO.mascot },
  { slug: "minesweeper", title: "Teemo Minesweeper", description: "Évite les shrooms.", image: BEEMO.mascot },
  { slug: "skillshot", title: "Dodge Skillshot", description: "Esquive les sorts.", image: BEEMO.mascot },
  { slug: "guess", title: "Guess Champion", description: "Devine le champion.", image: BEEMO.mascot },
];

export default function GameHubPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-text mb-2">Mini-jeux</h1>
      <p className="text-text-muted mb-8">Choisis un jeu et c'est parti.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((g) => (
          <GamePreviewCard key={g.slug} {...g} />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Si l'ancien `src/app/game/page.tsx` rendait directement les jeux dans des tabs**

Auditer s'il faut garder un mode "tab" via `GameTabs.tsx`. Si oui, simplifier `GameTabs.tsx` (cf. Task 7.4). Si on bascule sur les routes `[slug]`, on peut supprimer `GameTabs` après vérification d'usage.

### Task 7.2 : Simplifier le HUD et chrome de chaque mini-jeu

**Files:**
- Modify: `src/components/organisms/DodgeSkillshotGame.tsx`
- Modify: `src/components/organisms/GuessChampionGame.tsx`
- Modify: `src/components/organisms/LoLTriviaGame.tsx`
- Modify: `src/components/organisms/MemoryMatchGame.tsx`
- Modify: `src/components/organisms/TeemoMinesweeper.tsx`

Chaque fichier suit le même traitement :

- [ ] **Step 1: Pour chaque jeu, identifier**
  - le conteneur principal (`<div>` racine)
  - les éléments HUD (score, timer, vies)
  - les boutons (Jouer/Recommencer/Quitter/etc.)
  - l'écran "Game over"

- [ ] **Step 2: Appliquer les changements suivants**

  - Conteneur racine : `className="rounded-md border border-border bg-surface p-6"` (taille adaptable selon le jeu)
  - HUD : remplacer toute classe `text-glow-*`, `gradient-text-*`, `text-yellow-400 drop-shadow-...` par `text-text` ou `text-text-muted`. Taille de texte uniforme (`text-base` pour valeurs, `text-sm` pour labels)
  - Boutons : remplacer chaque bouton custom (avec gradient, glow, hover-lift) par `<Button variant="primary|secondary|ghost">`
  - Écran Game over : utiliser `Card` (`<Card className="p-8 text-center max-w-sm mx-auto">...</Card>`) avec score + 2 boutons standards. Supprimer confetti, flash, screen-shake.
  - Animations Framer Motion : conserver uniquement celles **fonctionnelles** (skillshot qui se déplace, carte qui se retourne, case qui se révèle). Supprimer les animations d'apparition décoratives sur le HUD, les pulses de score, les rotations de boutons, etc.

- [ ] **Step 3: Commit après chaque jeu**

Soit 1 commit par jeu (5 commits) si on fait du fin, soit 1 gros commit pour les 5. Préférence : **1 commit par jeu** pour la review.

```bash
git add src/components/organisms/<NomDuJeu>.tsx
git commit -m "refactor(webapp): minijeu <nom> : HUD/chrome sobres

- Conteneur Card surface
- HUD typo Geist taille uniforme
- Boutons Button standard
- Game over Card centrée
- Conservation des animations fonctionnelles uniquement

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 7.3 : `BetModal.tsx`

**Files:**
- Modify: `src/components/organisms/BetModal.tsx`

- [ ] **Step 1: Lire l'existant**

```bash
cat src/components/organisms/BetModal.tsx
```

- [ ] **Step 2: Refondre en modal sobre**

Squelette :

```tsx
"use client";

import { useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";

export interface BetModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

export default function BetModal({ open, onClose, onConfirm }: BetModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface">
        <div className="p-5 border-b border-border">
          <h3 className="text-lg font-semibold text-text">Placer une mise</h3>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            onConfirm(Number(fd.get("amount")));
          }}
          className="p-5 flex flex-col gap-3"
        >
          <Label htmlFor="amount">Montant (shrooms)</Label>
          <Input id="amount" name="amount" type="number" min={1} required />
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Annuler</Button>
            <Button type="submit" variant="primary">Confirmer</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

Adapter à la signature réelle si elle est différente (props existantes).

### Task 7.4 : `GameTabs.tsx`

**Files:**
- Audit/Modify ou Delete: `src/components/organisms/GameTabs.tsx`

- [ ] **Step 1: Vérifier l'usage**

```bash
grep -rln "GameTabs" src/ --include="*.tsx"
```

- [ ] **Step 2: Si plus utilisé** (parce que /game/[slug] remplace) : supprimer.

Sinon, le simplifier sur le même modèle que les tabs du leaderboard (texte + underline accent sur l'actif).

### Task 7.5 : Build, vérif, commit Phase 7

- [ ] **Step 1: Build**

Run: `pnpm build`
Expected: vert.

- [ ] **Step 2: Vérification visuelle**

Run: `pnpm dev`
Visual check : ouvrir `/game`, cliquer sur chaque mini-jeu, vérifier :
- Layout sobre du conteneur
- HUD lisible et uniforme
- Game over → Card centrée
- Le gameplay fonctionne (cliquer, esquiver, retourner les cartes)

- [ ] **Step 3: Commit final si pas déjà fait par jeu**

---

## Phase 8 : Cleanup final

### Task 8.1 : Suppression des dépendances inutilisées

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Vérifier `framer-motion`**

```bash
grep -rln "framer-motion" src/ --include="*.tsx" --include="*.ts"
```

Si vide → retirer la dep :

```bash
pnpm remove framer-motion
```

- [ ] **Step 2: Vérifier `three`, `@react-three/fiber`, `@react-three/drei`**

```bash
grep -rln "three\|@react-three" src/ --include="*.tsx" --include="*.ts"
```

Si vide → retirer :

```bash
pnpm remove three @react-three/fiber @react-three/drei @types/three
```

- [ ] **Step 3: Vérifier `tailwindcss-animate`**

Déjà retiré du `tailwind.config.js`. Désinstaller si plus utilisé :

```bash
pnpm remove tailwindcss-animate
```

- [ ] **Step 4: Vérifier `embla-carousel-react`**

```bash
grep -rln "embla" src/ --include="*.tsx" --include="*.ts"
```

Si vide → `pnpm remove embla-carousel-react`.

- [ ] **Step 5: Build et lint**

```bash
pnpm build
pnpm lint
```

Expected : build vert, lint sans erreurs nouvelles.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore(webapp): retire dépendances inutilisées (framer-motion, three, drei, fiber, embla, tailwindcss-animate)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

### Task 8.2 : Vérification finale des critères de succès

- [ ] **Step 1: Aucune classe magique restante**

```bash
grep -rE "glow-hextech|text-glow-|gradient-text-|clip-hexagon|clip-diamond|honeycomb-bg|border-hextech|glass-hextech" src/ --include="*.tsx" --include="*.ts" --include="*.css"
```

Expected: aucun résultat.

- [ ] **Step 2: Aucune référence aux variables CSS supprimées**

```bash
grep -rE "var\(--rune-|var\(--bg-deep|var\(--bg-surface|var\(--bg-elevated|var\(--beemo-honey-|var\(--hextech-blue-glow" src/ --include="*.tsx" --include="*.ts" --include="*.css"
```

Expected: aucun résultat.

- [ ] **Step 3: Aucun import orphelin de composants supprimés**

```bash
grep -rE "ParticleCanvas|TypewriterText|HexButton|HexagonFrame|GlowOrb|GlowingText|DiamondBadge|ParallaxBackground|ScrollIndicator|TestimonialsSection|SponsorsSection|EpicHeroSection" src/ --include="*.tsx" --include="*.ts"
```

Expected: aucun résultat.

- [ ] **Step 4: Build final + dev visuel**

```bash
pnpm build
pnpm dev
```

Visual check : naviguer toutes les routes (`/`, `/auth/callback`, `/profile`, `/search`, `/leaderboard`, `/game`, `/game/<slug>`, `/documentation`, `/resources`, `/shop`, `/u`). Aucune page blanche, design cohérent, formulaires fonctionnels.

- [ ] **Step 5: Commit si des correctifs ont été nécessaires + push**

```bash
git status
# si des corrections : git add -A && git commit -m "fix(webapp): correctifs post-audit final"
git push -u origin refactor/webapp-cleanup
```

---

## Self-review du plan

**Spec coverage :**
- Tokens (palette, typo, radius, utilitaires supprimés) → Phase 1 ✓
- Atoms (gardés/supprimés/ajoutés) → Phase 2 ✓
- Layout (Navbar/Header/Footer/MainLayout/ScrollIndicator) → Phase 3 ✓
- Landing (5 sections) → Phase 4 ✓
- Pages utilisateur (/auth, /profile, /search, /leaderboard) → Phase 5 ✓
- Pages utilitaires (/documentation, /resources, /shop, /u) → Phase 6 ✓
- Mini-jeux et /game → Phase 7 ✓
- Suppression deps inutilisées (Three.js, framer-motion) → Phase 8 ✓
- Critères de succès → Phase 8 (greps explicites) ✓

**Placeholder check :**
- Quelques squelettes de pages contiennent des `// logique fetch existante` — c'est intentionnel : la logique métier existante doit être préservée par l'agent qui exécute, pas réécrite. Les commentaires sont localisés et explicites, pas des "TODO".
- Aucun "TBD", aucun "implement later".

**Type consistency :**
- `Button` variants : `primary | secondary | ghost | danger` — utilisé partout pareil.
- `Card` : composant nommé `Card` avec sous-composants `CardHeader/CardTitle/CardContent/CardFooter/CardDescription` — exporté en named export, conformément à l'existant.
- `Input`, `Label`, `Badge` : default export — cohérent avec `Button`.
- `--accent`, `--accent-gold`, `--text`, `--text-muted` : noms identiques entre `globals.css` et `tailwind.config.js` ✓
- `BEEMO.mascot` : utilisé comme placeholder image dans `MinigamesPreview` et `/game` page hub — cohérent.

Aucune incohérence détectée. Plan prêt.
