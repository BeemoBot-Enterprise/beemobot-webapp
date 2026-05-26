# Theme System dual (light/dark) + finition Honey Friendly — Design

**Date** : 2026-05-26  
**Auteur** : Dura Jeremy  
**Statut** : à valider

## Contexte et problème

L'application a actuellement **deux systèmes de design qui coexistent mal** :

- L'ancien design AlignUI (sombre par défaut) — tokens CSS `--bg`, `--surface`, `--text`, `--border` et scales Tailwind `bg-bg-*`, `text-text-*`, `border-stroke-*`. Utilisé par 92 fichiers sur 155.
- Le nouveau design Honey Friendly (clair uniquement) — tokens `--hf-*`, classes `bg-hf-*`, `text-hf-*`. Implémenté seulement dans `src/components/_design/` et 2 pages (landing, internal/components).

Le `<body>` dans `src/app/layout.tsx` utilise déjà `bg-hf-bg text-hf-navy`. Header et Footer sont des composants HF. Mais le contenu de **14 pages sur 16** est encore en classes AlignUI sombres, ce qui produit un mélange visible : header/footer en crème clair, contenu en cartes sombres. La sélection texte, la scrollbar et les borders universelles `* { border-color: var(--border) }` héritent aussi des défauts sombres.

L'audit complet est dans la conversation précédente. Migration 100% native HF de tous les fichiers = 21-30 jours, hors scope.

## Objectif

Livrer une application **cohérente visuellement sur toutes les pages, dans deux thèmes (clair / sombre), avec respect par défaut de la préférence système** — d'ici demain matin (soutenance).

### Critères de réussite

- Aucun fond noir / aucun mélange visuel sur les 16 pages, ni en clair ni en sombre.
- Un toggle thème (icône unique) accessible depuis le header, qui cycle `light → dark → system → light`.
- Au premier chargement, le thème suit `prefers-color-scheme` ; après un clic utilisateur, son choix est persisté en `localStorage` et survit aux navigations / rechargements.
- Pas de FOUT (Flash Of Unstyled Theme) au chargement initial.
- Les 5 pages du chemin de démo (`profile`, `auth/link`, `leaderboard`, `search`, `settings`) utilisent les composants HF natifs (`_design/`) et brillent dans les deux thèmes.
- Les autres pages héritent du thème via les CSS variables remappées et restent lisibles + cohérentes, même si pas refondues en HF natif.

## Non-objectifs

- Réécrire les 92 fichiers AlignUI en HF natif. Hors scope d'un sprint nuit.
- Refondre les mini-jeux (`organisms/*Game.tsx`), le shop, la page documentation. Ils héritent du thème mais ne sont pas redesignés.
- Toucher au layout / au flux d'auth / aux interactions backend. Cette migration est purement visuelle.
- Ajouter un troisième thème (high-contrast, sépia, etc.). Light + dark + system suffisent.

## Architecture

### 1. Tokens CSS theme-aware

Aujourd'hui `globals.css` définit les tokens dans `:root` en valeurs figées. Demain, **chaque token devient sensible au thème actif** via la classe `.dark` posée sur `<html>`.

```css
/* src/styles/globals.css — extrait pédagogique */
:root {
  /* Honey Friendly — light (défaut) */
  --hf-bg: #FAFAF7;
  --hf-surface: #FFFFFF;
  --hf-surface-alt: #F5F0E0;
  --hf-navy: #14172B;
  --hf-navy-soft: #4D526B;
  --hf-line: #ECE9DF;
  --hf-honey: #E5A422;
  --hf-honey-soft: #FFD56E;
  --hf-honey-text: #8B6914;
  --hf-discord: #5865F2;
  --hf-win: #10B981;
  --hf-loss: #F43F5E;

  /* AlignUI — alias des tokens HF pour héritage cohérent */
  --bg: var(--hf-bg);
  --surface: var(--hf-surface);
  --surface-hover: var(--hf-surface-alt);
  --border: var(--hf-line);
  --text: var(--hf-navy);
  --text-muted: var(--hf-navy-soft);
}

.dark {
  --hf-bg: #0F1116;
  --hf-surface: #181B22;
  --hf-surface-alt: #21242D;
  --hf-navy: #E8E3D2;          /* devient "cream" en sombre */
  --hf-navy-soft: #A9A395;
  --hf-line: #2A2E38;
  --hf-honey: #E5A422;          /* identique — le miel reste miel */
  --hf-honey-soft: #FFD56E;
  --hf-honey-text: #E5A422;     /* plus clair en sombre pour contraste */
  --hf-discord: #7A86FF;
  --hf-win: #34D399;
  --hf-loss: #FB7185;

  /* AlignUI tokens hérités via les alias — pas besoin de re-déclarer */
}
```

**Scales AlignUI Tailwind** (`bg-bg-soft-200`, `text-text-strong-950`, `border-stroke-soft-200` etc.) — actuellement définies dans `tailwind.config.js` avec des hex en dur. À remapper pour pointer vers `rgb(var(--hf-bg))` / équivalents, OU à override via globals.css selon ce qui est techniquement le plus simple à l'inspection du config. (Décision finale en phase d'implémentation.)

**Règle générale** : aucun composant ne référence un hex code direct ni `--bg-soft-XXX` sans passer par les vars centralisées. Toute la chaîne de couleurs s'inverse en flippant une seule classe sur `<html>`.

### 2. Provider et persistance

Utilise [`next-themes`](https://github.com/pacanukeyes/next-themes) — la lib standard pour Next 15 App Router :

- Wrapper `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>` dans `src/app/layout.tsx` autour des children.
- Le provider injecte un script bloquant dans `<head>` qui lit `localStorage.theme` (ou tombe sur `prefers-color-scheme` si absent) **avant le paint**, et pose la classe `.dark` / pas-de-classe sur `<html>` → pas de FOUT.
- Hook `useTheme()` expose `{ theme, setTheme, resolvedTheme }`. `theme` peut valoir `"light"` | `"dark"` | `"system"`. `resolvedTheme` est toujours `"light"` ou `"dark"` (utile pour les icônes conditionnelles).

### 3. Toggle UI

Un seul composant `ThemeToggle` placé dans `HeaderHF`, à droite à côté du CTA Discord. Comportement :

- Icône qui change selon `theme` (pas `resolvedTheme`) :
  - `light` → ☀️ Sun
  - `dark` → 🌙 Moon
  - `system` → 💻 Monitor
- Au clic : cycle `light → dark → system → light`.
- Sur mobile, accessible aussi depuis le drawer du `HeaderHF`.
- Pas d'animation lourde — juste un fade rapide sur l'icône (existing `HeaderHF` motion language).
- `aria-label` dynamique : *"Activer le thème sombre"*, *"Suivre le système"*, etc.

### 4. Migration HF native — 5 pages prio

Pour chaque page de cette liste, je remplace les composants `atoms/molecules/organisms` AlignUI par leurs équivalents `_design/` HF, je nettoie les classes `bg-bg-*` / `text-text-*` au profit de classes HF, et je vérifie que la page rend bien dans les deux thèmes :

| Ordre | Page | Composants à substituer |
|---|---|---|
| 1 | `src/app/profile/ProfileContent.tsx` | Card → `_design/Card`, Button → `_design/Button`, Badge → `_design/Pill` |
| 2 | `src/app/auth/link/page.tsx` | AuthCard → `_design/Card variant="accent"`, Button, Input, Label |
| 3 | `src/app/leaderboard/page.tsx` | LeaderboardTable (re-skin) ou refonte minimaliste avec `_design/Card` + lignes |
| 4 | `src/app/search/page.tsx` | Card, Input, Label, Badge, Button — gros morceau |
| 5 | `src/app/settings/page.tsx` | Card, Button, Eyebrow, Badge |

Si je manque de temps en fin de Phase 2, je m'arrête à la page atteinte ; les pages restantes héritent du theming et restent cohérentes.

### 5. Pages secondaires (non refondues)

`shop`, `documentation`, `resources`, `game`, `game/[slug]`, `u/[riotId]`, `auth/login`, `auth/otp`, `auth/callback`, `internal/components` — gardent leur code AlignUI. Aucune modification de classe. Elles deviennent automatiquement cohérentes grâce au remap des tokens (Phase 1).

Cas particulier : `internal/components` (la showcase HF) est déjà HF native, rien à faire.

## Flot d'exécution

```
┌──── Phase 1 : Token system + provider (2-3h) ────┐
│  1. Remap globals.css : light défaut + .dark     │
│  2. Vérifier tailwind.config.js scales AlignUI   │
│  3. Installer next-themes                         │
│  4. ThemeProvider dans layout.tsx                 │
│  5. ThemeToggle dans HeaderHF (mobile inclus)     │
│  → vérif : tout est light cohérent, toggle marche │
└───────────────────────────────────────────────────┘
                       │
                       ▼
┌──── Phase 2 : HF migration des 5 pages (3-4h) ───┐
│  Pour chaque page (ordre fixé) :                  │
│    a. Swap composants AlignUI → _design/          │
│    b. Tester en light puis dark                   │
│    c. Commit isolé par page                       │
└───────────────────────────────────────────────────┘
                       │
                       ▼
┌──── Phase 3 : Audit visuel + fixes (1-2h) ───────┐
│  1. pnpm dev                                       │
│  2. Playwright screenshot light + dark sur 16 pgs │
│  3. Triage : ce qui pète (contraste, hover, etc.) │
│  4. Fixes locaux                                   │
│  5. Commit final                                   │
└───────────────────────────────────────────────────┘
```

## Gestion des erreurs / edge cases

- **FOUT** : le script bloquant de `next-themes` doit être présent **avant** tout `<body>`. Sans ça, l'utilisateur en dark voit un flash blanc. Géré nativement par la lib.
- **localStorage indisponible** (private browsing strict) : `next-themes` fallback sur `system` silencieusement.
- **Discord brand color** : reste `#5865F2` dans les deux thèmes (c'est une marque, on ne la modifie pas).
- **Honey accent** : reste `#E5A422` dans les deux thèmes (couleur signature). Seul son équivalent texte (`--hf-honey-text`) s'éclaircit en dark pour le contraste.
- **Images** : pas de logique de swap image light/dark pour cette release. Si une image a fond clair, elle reste fond clair en dark theme — acceptable pour la soutenance.
- **Charts / Three.js scenes (landing)** : si une scene 3D utilise une couleur en dur, elle ne réagit pas au toggle. Acceptable, on ne touche pas. À remonter en suivi si on le voit lors de l'audit Phase 3.

## Tests

Pas de tests automatisés vu le délai. Audit manuel via Playwright en Phase 3 :

1. Lance `pnpm dev` sur port 3000.
2. Pour chacune des 16 pages, screen en `theme=light`, `theme=dark`, `theme=system avec OS en light`, `theme=system avec OS en dark`.
3. Critères :
   - Pas de texte invisible (contraste < 3:1 sur un fond).
   - Pas de border qui disparaît dans le fond.
   - Pas de bouton primaire qui se confond avec le background.
   - Toggle accessible et fonctionne sur chaque page.

## Risques connus

- **La dark variant HF est une invention design** : ne s'appuie sur aucune validation préalable. Je vise un look "cocoa + honey" sobre. Si tu trouves ça moche en testant, tweak rapide possible : tout est centralisé dans 12 vars CSS.
- **AlignUI scales custom (`bg-bg-soft-200` etc.)** : si Tailwind les définit en hex hardcodé et non en `var(--…)`, le remap nécessite de toucher `tailwind.config.js` aussi. Je le découvrirai en début de Phase 1, ça rallonge max de 30 min.
- **Time budget tight** : 6-9h estimées. Si je dépasse, j'abandonne Phase 2 pages restantes — Phase 1 + Phase 3 doivent passer absolument car elles couvrent l'engagement "tout cohérent".
- **Composants tiers Radix/Shadcn dans `ui/`** : 58 fichiers utilisent leurs propres tokens via `cn()` et variants Tailwind. Le remap CSS devrait suffire, mais si Radix override avec `style={{ color: ... }}`, à fix manuellement. Audit Phase 3.

## Décisions actées

1. **3 thèmes proposés** : light, dark, system. Pas d'auto (système = système, point).
2. **Défaut au premier visit** : `system`.
3. **Toggle** : icône unique qui cycle `light → dark → system → light`. Pas de dropdown.
4. **Persistence** : `localStorage` géré par `next-themes`.
5. **Migration HF native** : 5 pages dans l'ordre `profile → auth/link → leaderboard → search → settings`. Si time-out, je m'arrête au point atteint.
6. **Pages secondaires** : pas refondues, héritage via tokens uniquement.
7. **Tokens AlignUI** : aliasés sur tokens HF (`--bg → --hf-bg` etc.). Une seule source de vérité par thème.
8. **Lib** : `next-themes` (standard Next App Router).
9. **Le thème sombre n'est PAS supprimé** : conservé et raffiné. C'est le mode dark.
