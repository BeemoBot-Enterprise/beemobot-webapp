# Webapp cleanup — design spec

Date: 2026-05-06
Project: `beemobot-webapp` (Next.js 15 / React 19 / Tailwind)
Goal: Refonte visuelle complète du site vitrine BeemoBot pour aboutir à un design clean, sobre, cohérent, lisible — tout en préservant l'identité gaming/LoL.

## Décisions de cadrage

| Sujet | Décision |
|---|---|
| Portée | Tout le site (landing + auth + profile + search + leaderboard + game + documentation + resources + shop + u) |
| Identité | ADN League of Legends conservé (palette bleu hextech + or Beemo) mais épuré |
| Effets | Zéro effet "magique" — pas de glow, gradient text, particules, parallax, hexagones décoratifs, three.js |
| Police | Geist (variable, via `next/font/google`) |
| Mini-jeux & 3D | Simplifiés au même niveau de sobriété que le reste |

## Approche d'exécution

Hybride bottom-up en 5 étapes commitables :
1. Tokens CSS + police + suppression des utilitaires "magiques"
2. Refonte des atoms
3. Refonte du layout (Navbar, Header, Footer, MainLayout)
4. Refonte du landing
5. Refonte des pages utilisateur, utilitaires, et mini-jeux

## 1. Design tokens (`src/styles/globals.css`)

### Palette

```css
--bg: #0b0d12;          /* fond unique */
--surface: #151821;     /* cards, modals */
--border: #262a36;
--text: #e8eaf0;
--text-muted: #9aa0b0;
--accent: #3b82f6;      /* bleu hextech assagi */
--accent-gold: #f5b528; /* or Beemo, usage ponctuel uniquement */
```

### Couleurs supprimées

`--rune-cyan`, `--rune-purple`, `--rune-pink`, `--hextech-blue-glow`, `--bg-deep`, `--bg-surface`, `--bg-elevated`, `--beemo-honey-light`, `--beemo-honey-dark`, `--hextech-blue-dark`, `--hextech-gold-light`, `--hextech-gold-dark`, l'ancien `--background` HSL, etc.

### Typo

- Geist (variable font), via `next/font/google`.
- 4 tailles : `text-sm` (14px), `text-base` (16px), `text-xl` (20px), `text-3xl` (32px). H1 du hero peut monter à 48px desktop / 32px mobile.
- Suppression des fichiers `Inter-*.woff2` dans `src/styles/fonts/` (Inter est chargé via `next/font` actuellement de toute façon — Geist remplace).

### Radius

- `--radius: 8px`. `rounded-full` réservé aux avatars et pastilles de statut.

### Utilitaires CSS supprimés

`glow-hextech-blue`, `glow-hextech-gold`, `glow-beemo-honey`, `text-glow-blue`, `text-glow-gold`, `text-glow-honey`, `border-hextech` (et son `::before`), `glass-hextech`, `honeycomb-bg`, `clip-diamond`, `clip-hexagon`, `gradient-text-hextech`, `gradient-text-beemo`.

### Autres suppressions globales

- `body::after` radial-gradient supprimé.
- `::selection` violet remplacé par `--accent` à 30% d'opacité.
- Scrollbar custom : reste mais en `--border` au lieu de `--hextech-blue`.

## 2. Atoms

### Conservés (réécrits)

- **`Button.tsx`** — variants `primary` (bg `--accent`, text white), `secondary` (bg `--surface`, border `--border`), `ghost` (transparent, hover `--surface`). Tailles `sm` / `md` / `lg`. Aucun glow, aucun gradient, aucun hover-lift.
- **`Card.tsx`** — bg `--surface`, border `--border`, radius 8px, padding interne uniforme. Pas de backdrop-blur, pas de border gradient.
- **`BeeIcon.tsx`** — gardé. Vérifier que les SVG paths utilisent `currentColor` pour qu'il prenne la couleur du parent.
- **`StatCounter.tsx`** — gardé mais sans animation count-up. Affiche directement le chiffre. Le hook `useCountUp` est supprimé en parallèle.
- **`ProgressRing.tsx`** — conservé **uniquement** s'il sert à de vraies données (rep system, mastery, etc.). À auditer en phase d'exécution. Sinon supprimé.

### Supprimés (fichier entier)

- `GlowOrb.tsx`
- `GlowingText.tsx`
- `HexButton.tsx` (fusionné dans `Button`)
- `HexagonFrame.tsx`
- `DiamondBadge.tsx` (remplacé par nouveau `Badge.tsx`)
- `ParticleCanvas.tsx`
- `TypewriterText.tsx`

### Ajoutés

- **`Input.tsx`** — input texte (height 40px, border `--border`, focus ring `--accent`, bg `--surface`).
- **`Label.tsx`** — label sobre (text-sm, text-muted).
- **`Badge.tsx`** — pastille (small text, padding x/y, border, radius full ou 4px).

## 3. Layout & navigation

### `molecules/Navbar.tsx`

- Hauteur 64px fixe.
- Fond `--bg` ; border-bottom 1px `--border` qui apparaît seulement au scroll (>0px).
- Logo Bee à gauche (24px, monochrome `--text`, pas d'effet hover).
- Liens centrés : `Accueil`, `Recherche`, `Mini-jeux`, `Documentation`, `Resources`. Lien actif : underline 2px `--accent`.
- À droite : CTA login (Discord) en `Button primary sm`.
- Mobile : burger → drawer slide-in depuis la droite, fond `--surface`, pas d'overlay flou.
- Pas de `backdrop-blur`, pas de glow sur le logo, pas d'animation d'entrée.

### `organisms/Header.tsx`

À auditer. Si redondant avec Navbar, supprimé. Sinon fusionné dans Navbar.

### `organisms/Footer.tsx`

- Grille 4 colonnes desktop, 1 colonne mobile.
- Colonnes : Produit / Communauté / Légal / Crédits.
- Logo Bee + nom à gauche du bloc colonnes ou en bas.
- Séparateur 1px `--border`, puis copyright + liens légaux (Mentions, Privacy).
- Plus de logo animé, plus de honeycomb-bg, plus de social icons avec glow (icônes mono `--text-muted`, hover `--text`).

### `templates/MainLayout.tsx`

```tsx
<>
  <Navbar />
  <main className="min-h-[calc(100vh-64px)]">{children}</main>
  <Footer />
</>
```

Suppression du `-mt-20` sur `app/page.tsx` (le hero ne remonte plus sous la nav).

### `molecules/ScrollIndicator.tsx`

Supprimé.

## 4. Landing page (`/`)

Cinq sections, espacement vertical large (`py-24` desktop / `py-16` mobile), conteneur `max-w-[1200px]` centré.

### `HeroSection` (remplace `EpicHeroSection`)

- H1 (Geist, 48px desktop / 32px mobile) : *"Le bot Discord pour ta communauté League of Legends."*
- Sous-titre (`--text-muted`, 18px) : 1 phrase claire mentionnant stats, profils, mini-jeux, leaderboards.
- Deux CTA :
  - `Button primary` → "Ajouter à Discord" (lien `BOT_INVITE_URL`)
  - `Button secondary` → "Voir la démo" (anchor `#features`)
- Visuel à droite (desktop) : screenshot statique du bot en action (PNG/WebP, à fournir ou à générer dans `public/`). Mobile : sous le texte.
- Pas de Three.js, pas de particules, pas de parallax, pas de typewriter.

### `StatsSection`

- 4 chiffres alignés horizontalement (grille 4 colonnes desktop, 2x2 mobile).
- Format : gros chiffre (text-3xl, font-semibold) + label dessous (text-sm, `--text-muted`).
- Données : nb serveurs, nb joueurs, nb parties trackées, nb mini-jeux.
- Pas de count-up animé.

### `FeatureShowcase`

- Grille 3x2 desktop (3 colonnes, 2 lignes), 1 colonne mobile.
- 6 features : icône (24px, `--text-muted`) + titre (text-xl) + 1 phrase (`--text-muted`).
- Cards type `Card.tsx`. Pas de glow border, pas de hover-lift.

### `MinigamesPreview`

- Grille 3 colonnes desktop, 2 colonnes mobile.
- Card par mini-jeu : thumbnail (image carrée, radius 8px) + nom + 1 ligne + bouton "Jouer".
- 5 mini-jeux : Dodge Skillshot, Guess Champion, LoL Trivia, Memory Match, Teemo Minesweeper.
- `GamePreviewCard.tsx` réécrit en interne pour cette mise en forme sobre.

### `CTASection`

- Bloc centré, fond `--surface`, padding large.
- Titre + 1 CTA `primary` "Ajouter à Discord". Rien d'autre.

### Supprimés du landing

- `TestimonialsSection` (déjà non monté dans `app/page.tsx`).
- `SponsorsSection` (~15 KB, non monté actuellement non plus — confirmer en exec et supprimer le fichier si non référencé).
- `ParallaxBackground` (composant et toutes ses utilisations).
- Hero 3D Three.js.

## 5. Pages utilisateur, utilitaires, mini-jeux

### `/auth/callback`

- Centrée verticalement, spinner sobre + texte "Connexion en cours…".
- En cas d'erreur : message + bouton "Retour à l'accueil".

### `/profile`

- Header profil : avatar Discord (rond, 96px), pseudo Riot, tag, région, rank LoL.
- 3 cards de stats côte à côte : Shrooms / Respects / Rep score.
- Liste matchs récents (table) : colonnes champion / KDA / durée / résultat. Hover : fond légèrement plus clair (pas de glow).
- Bouton "Se déconnecter" en bas, `secondary`.

### `/search`

- Barre de recherche en haut : `Input` (large, placeholder "Recherche un joueur (GameName#TagLine)") + select région + `Button primary` "Rechercher".
- Résultat : même layout que `/profile`, lecture seule (pas de bouton se déconnecter).

### `/leaderboard`

- Tabs Shrooms / Respects (texte + underline `--accent` sur l'onglet actif).
- Table : rang / avatar / pseudo / score.
- Top 3 : numéro de rang en `--accent-gold`. Pas de couronne, pas de podium animé.

### `/documentation`

- Layout 2 colonnes desktop : sidebar nav (sticky, gauche) + contenu (droite).
- Mobile : sidebar repliée en accordéon en haut.
- Hiérarchie de titres : H1 (text-3xl) / H2 (text-xl) / H3 (text-base font-semibold).
- Code blocks : fond `--surface`, padding, font monospace système.

### `/resources`

- Grille de cards (image / titre / description / lien externe). Format identique à `FeatureShowcase`.

### `/shop` et `/u`

À auditer en phase d'exécution. Application des mêmes principes : `Card`, `Button`, `Input`, espacements cohérents.

### `/api/*`

Routes serveur, hors scope visuel.

### Formulaires (transverse)

Toutes les `<form>` utilisent `Input` + `Label` + `Button`. Validation : message d'erreur rouge (`#ef4444`) sous le champ concerné, pas d'animation shake, pas de glow rouge.

### Mini-jeux (`/game` et composants `*Game.tsx`)

- Page `/game` : grille de cards identique à `MinigamesPreview`. Au clic, ouverture du jeu via route imbriquée (`/game/[slug]`) — à confirmer en exec si l'arbo actuelle le permet, sinon modal full-screen.
- Conteneur de jeu : `--surface`, border `--border`, radius 8px, padding cohérent.
- HUD (score, timer, vies) : Geist, `text-base`, pas de gradient text, pas de glow.
- Boutons "Jouer / Recommencer / Quitter" : `Button` standard.
- Game over : `Card` centrée, score final + 2 boutons. Pas de confetti, pas de flash, pas d'écran qui tremble.
- Animations fonctionnelles **conservées** (skillshot, retournement de carte, révélation de case) — elles expriment la mécanique. Versions sobres : durées courtes, pas de glow sur les sprites.
- Sons : non touchés.

### `organisms/GameTabs.tsx`

Onglets sobres (texte + underline `--accent` sur l'actif), pas de hover-lift.

### `organisms/BetModal.tsx`

Modal standard : `--surface`, border, header + body + footer. `Button` standard sur le bouton Bet.

## Hooks à supprimer ou simplifier

- `useCountUp` — supprimé.
- `useParallax` — supprimé.
- `useScrollAnimation` — supprimé sauf si utilisé pour autre chose qu'animations décoratives (à auditer).
- `useAuth`, `useGameState`, `useLocalStorage` — gardés tels quels (logique métier).

## Critères de succès

- Aucune classe `glow-*`, `text-glow-*`, `gradient-text-*`, `clip-hexagon`, `clip-diamond`, `honeycomb-bg`, `border-hextech`, `glass-hextech` n'apparaît dans le code (grep vide).
- Aucune dépendance Three.js / `@react-three/*` n'est plus chargée (vérifier `package.json` après cleanup, retirer si plus rien ne les utilise).
- Aucune référence aux variables CSS supprimées (`--rune-*`, `--bg-deep`, `--bg-surface`, `--bg-elevated`, `--beemo-honey-light`, `--beemo-honey-dark`, etc.) ne reste dans les composants.
- Toutes les pages compilent (`pnpm build`) et passent le typecheck.
- Test visuel manuel : chaque page (`/`, `/auth/callback`, `/profile`, `/search`, `/leaderboard`, `/game`, `/documentation`, `/resources`, `/shop`, `/u`) charge sans erreur console et reflète le design ci-dessus.

## Hors scope

- Refonte de l'API ou du bot.
- Internationalisation (le site reste en français).
- Dark mode / light mode toggle (le site reste dark only).
- Migration de framework, refonte de l'arbo `app/`, changement d'atomic design.
- Optimisations performance hors retrait des dépendances rendues inutiles.
- Tests automatisés (le projet n'en a pas actuellement, on n'en ajoute pas dans cette refonte).
