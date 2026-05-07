# Redesign webapp — Honey Friendly

**Date** : 2026-05-07
**Périmètre** : tout le site `beemobot-webapp`
**Statut** : design validé, à passer en plan d'implémentation phasé

## Le problème

Le site actuel souffre de trois maux concrets :

1. **Pas d'identité.** L'AlignUI dark theme (bg `#0B0D12`, primary `#3B82F6`) est un design system SaaS B2B générique. Aucun rapport avec la thématique League / Discord / Beemo / honey.
2. **Incohérence visuelle.** Bordures parfois présentes, parfois pas. Tailles de cards qui varient. Sections "bateau" sans rythme commun. Le visiteur ressent l'aléa.
3. **Profil bancal.** Quand l'utilisateur a lié son compte Riot, il voit la même grille de Cards génériques qu'avant. Aucune récompense visuelle pour avoir lié, aucune information Riot mise en valeur, aucune personnalité.

## Direction validée

**Honey Friendly** = MEE6-clean (espace, sans-serif, mascotte, gros boutons) + identité Beemo (palette honey/navy, Teemo character, halo doré, gros chiffres). Light theme. Cachet via la typo display + l'illustration signature.

## Système de design (à construire)

### Tokens couleur (light, neuf)

```
--bg            #FAFAF7   surface principale (presque blanc, soupçon de chaud)
--surface       #FFFFFF   cards, modales
--surface-alt   #F5F0E0   accents chauds (banner stats, blocs honey)
--navy          #14172B   texte fort, primaire éditorial
--navy-soft     #4D526B   texte secondaire
--line          #ECE9DF   bordure unique pour toutes les cards
--honey         #E5A422   accent unique (icônes, halos, surligneur, pills dorées)
--honey-soft    #FFD56E   highlight type stabilo
--honey-glow    rgba(229,164,34,.18)   halos de section, hovers d'icônes
--discord       #5865F2   CTA primaire (Add to Discord)
--win           #10B981   victoires, succès (réuse `success-base` existant)
--loss          #F43F5E   défaites, erreurs (réuse `error-base` existant)
```

L'ancienne palette AlignUI dark est **supprimée** (pas conservée en parallèle — full migration).

### Typographie

| Usage | Famille | Source |
|---|---|---|
| Display (H1-H3, gros chiffres) | **Bricolage Grotesque** variable, opsz 12-96, weight 400-800 | `next/font/google` |
| Body, UI | **Onest** weight 400-700 | `next/font/google` |

Tailles core (à mettre dans tailwind.config) :
- `display-1` : clamp(40px, 6vw, 64px), line-height .94, letter-spacing -2px
- `display-2` : clamp(32px, 4.5vw, 44px), line-height 1, letter-spacing -1.5px
- `display-3` : clamp(24px, 3vw, 32px), line-height 1.05, letter-spacing -1px
- `body-lg` : 17px / 1.55
- `body` : 15px / 1.55
- `body-sm` : 13px / 1.5
- `eyebrow` : 11px / 1.3, letter-spacing .15em, uppercase, weight 700, color honey

L'ancienne échelle `title-h1..h6` AlignUI est supprimée.

### Espacement et radius

- Sections : padding vertical 56-72px (mobile 40px)
- Cards : padding 20-24px, radius 16-20px
- Boutons : radius 12px
- Pills : radius 999px
- **Une seule épaisseur de bordure** : `1px solid var(--line)`. Les seules exceptions : bordures d'accent autour de cards interactives en hover (`var(--honey)`), bordure W/L sur match cards (`var(--win)` ou `var(--loss)`).

### Iconographie

Remixicon (`@remixicon/react`, déjà installé). **Aucun emoji jamais** dans le DOM rendu côté UI — y compris dans les copy strings. Si besoin d'un état "fun", utiliser une icône Remixicon ou une illustration SVG custom.

### Effets

- Ombres : `0 8px 24px -10px rgba(20,23,43,.15)` (douce). Pas de glow néon.
- Transitions : 150ms `translateY(-1px)` au hover des cards interactives. Pas de pulse continu, pas de parallax, pas de particules.
- Animations d'entrée : staggered fade-in léger au load (Framer Motion, déjà installé), délais de 50-100ms entre éléments. Une seule fois, pas de scroll-triggered massif.

## Pattern library (composants atomiques à standardiser)

Tous reconstruits "from scratch" en partant des nouveaux tokens. Atomic design conservé.

| Atome / Molécule | Description |
|---|---|
| `<Button>` | variants : `primary` (Discord blurple), `outline` (white + navy border), `ghost`, `danger`. Tailles sm/md/lg. Slot icon left/right. |
| `<Card>` | variant : `default` (white + line border), `accent` (surface-alt, halo honey discret), `interactive` (hover translateY + line→honey). |
| `<Pill>` | live (point vert + "Bot live · 320 serveurs"), tag (eyebrow uppercase doré), badge (Riot ID). |
| `<StatNumber>` | gros chiffre Bricolage + unité honey + label en dessous. Variante "sparkline" pour évolution. |
| `<Eyebrow>` | tag uppercase 11px doré, espace avant le titre de section. |
| `<SectionShell>` | wrapper standard pour toutes les sections : eyebrow → display-2 titre → body-lg lead → contenu. Garantit la cartouche unique. |
| `<TeemoMascot>` | wrapper de `BEEMO.character` (asset existant) avec poses contextuelles (idle, hello, surprise, sleeping). Phase 2 : ajouter assets si manquants. |
| `<RankBadge>` | emblem rank Riot (Iron→Challenger), source : Data Dragon ou assets locaux. |
| `<ChampionPortrait>` | avatar champion via Data Dragon CDN. Variants : square, circle, splash-bg. |
| `<MatchCard>` | bordure W/L colorée (var(--win) ou var(--loss)), champion, KDA, durée. |

## Pages (full scope, 12 pages)

Approche par page, dans l'ordre suggéré d'implémentation.

### Phase 1 — Foundation (bloquant tout le reste)
- **Design tokens & fonts** : tailwind config réécrite, fonts via `next/font`, globals.css réécrit, suppression AlignUI dark.
- **Pattern library** : composants atomiques listés plus haut, page de demo `/internal/components` pour validation visuelle.
- **Header & Footer globaux** : nav refondue, footer simplifié.

### Phase 2 — Pages publiques cœur
- **Landing `/`** : hero (TeemoMascot droite, halo honey, pill live, H1 Bricolage avec mot surligneur honey, CTA Discord blurple, social proof avatars) + stats banner (3 gros chiffres) + sections feature / integrations / leaderboard teaser / team / CTA / FAQ. Toutes en `<SectionShell>`.
- **Profil `/profile`** (linked et non-linked) — voir détail dédié plus bas.
- **Profil public `/u/[id]`** : version "vue par les autres" du profil linked, sans actions privées.

### Phase 3 — Discovery
- **Search `/search`** : input central grand, résultats en cards uniformes, filtres dorés.
- **Leaderboard `/leaderboard`** : tableau Top shrooms / Top respects / Top honey, podium pour le top 3 avec splash arts.

### Phase 4 — Gamification
- **Game `/game`** : hub mini-jeux. Grid de cards interactives, illustration par jeu.
- **Shop `/shop`** : items honey, prix, descriptions courtes.

### Phase 5 — Système
- **Settings `/settings`** : prefs, déconnexion, suppression compte.
- **Documentation `/documentation`** + **Resources `/resources`** : pages doc en typographie éditoriale (Bricolage pour H, Onest pour le body).
- **Auth callback `/auth/callback`** + **404** : transitionnel, illustration Teemo "perdu".

## Profil lié — détail

Le wow moment. Quand un user a lié son Riot, il arrive sur quelque chose qu'il a envie de montrer.

### Structure verticale

```
1. SUMMONER HEADER (full-width)
   ├─ Splash art champion main en background, overlay navy à 70% (lisibilité)
   ├─ Avatar champion main (cercle), pseudo Discord, Riot ID (gameName#tagLine)
   ├─ Rank emblem Riot (Iron→Challenger SVG officiel) + tier roman + LP
   ├─ Niveau invocateur, mastery score
   └─ TeemoMascot petit, en bas à droite, bulle de commentaire contextuel
      (« Bonjour [pseudo], encore en train de planter des champis ? »)
      Le commentaire change selon le ratio shrooms/respects.

2. STATS GAMIFICATION (bandeau de 4 cards)
   ├─ Honey 2,450 (icône Remixicon à choisir : RiCoinLine ou illustration pot custom)
   ├─ Respects reçus (badge stable-base)
   ├─ Shrooms reçus (badge warning-base)
   └─ Score net (+/-, color win ou loss)

3. RECENT MATCHES (5 dernières)
   Card par match avec :
   ├─ Bordure gauche colorée 4px : win=success-base, loss=error-base
   ├─ ChampionPortrait + nom champion + rôle
   ├─ KDA gros + items joués (icônes Data Dragon)
   ├─ Durée, type (Ranked Solo, Normal, ARAM)
   └─ Timestamp relatif ("il y a 2h")

4. QUIRKY STATS (3 cards humour)
   Calculés côté API, ton léger :
   ├─ « Tu as feed 23 fois ce mois » + « Plus que 89% des joueurs Beemobot »
   ├─ « Ton main est Yasuo (×11) » + « Win rate : 36%. Aïe. »
   └─ « Le plus shroomé : Léo » + « Tu lui dois un respect. »
   Copy en français, ton Beemo familier, pas méchant. Génération de copy à brancher
   sur des seuils stats (à définir avec API team — optionnel : faire en Phase 5).

5. RECENT EVENTS (feed honey/shrooms/respects)
   Liste compacte des évènements récents (existant côté API)

6. ACTIONS (footer de page)
   Voir profil public · Modifier Riot ID · Settings
```

### Profil non lié

Card centrale avec TeemoMascot (`hello` pose) + lead « Lie ton compte Riot pour activer ton profil de fou. » + CTA primaire grand (Discord blurple) « Lier mon compte Riot » + 3 mini-cards "ce que tu débloques" (stats Riot · honey gagnable · classement). Pas de mock du profil lié pour ne pas frustrer.

## Stack technique

- **Fonts** : `next/font/google` pour Bricolage Grotesque et Onest (perf, pas de FOUT)
- **Icônes** : Remixicon (déjà installé). Audit pour remplacer chaque emoji existant.
- **Animations** : Framer Motion (déjà installé) — usage parcimonieux
- **Three.js** : à supprimer si présent dans des sections refondues (pas dans la direction validée)
- **Riot assets** : champion icons et splash arts via Data Dragon CDN (pas de stockage local). API `lol_controller.ts` côté beemobot-api fournit déjà les data.
- **Rank emblems** : assets Riot officiels (community Data Dragon ou assets locaux ajoutés en Phase 1)

## Stratégie de migration

Page-by-page derrière un feature flag global ne vaut pas le coût. Approche :

1. Phase 1 (Foundation) en branche dédiée, mergée après validation visuelle sur `/internal/components`.
2. Phases 2-5 chacune en branche, mergées séquentiellement. Tant qu'une phase n'est pas mergée, les pages anciennes vivent à côté du nouveau design system (cohabitation transitoire de 1-2 jours max).
3. Une fois Phase 5 mergée, suppression définitive des anciens composants AlignUI.

## Ce qui n'est PAS dans le scope

- **Refonte de l'API** (beemobot-api). Les endpoints existants suffisent (`/profile/me`, `/profile/:puuid`, `/lol/summoner/...`, `/game/top/...`). Les "quirky stats" peuvent être calculées côté webapp à partir des data existantes.
- **Refonte du bot Discord** (séparément).
- **Dark mode**. On lock le light theme. On pourra l'ajouter plus tard avec un toggle si besoin.
- **i18n**. Site reste en français, copy fr-FR.
- **Responsive avancé < 360px**. Cibles : 360px-1440px.

## Critères de succès

- Toute page utilise `<SectionShell>`, mêmes tokens, même cartouche : un visiteur ne perçoit plus d'aléa.
- Profil lié : un user qui a lié peut envoyer un screenshot de son profil sur Discord et c'est lisible/cool.
- Aucune emoji dans le DOM, vérifiable par un grep.
- Lighthouse perf > 85 sur landing et profil.
- Toutes les fonts servies via `next/font` (pas de Google Fonts CDN externe).

## Questions ouvertes

- **Rank emblems** : utilise-t-on les SVG community-data-dragon ou on commande une version "Beemo-fied" custom ?
- **TeemoMascot poses** : l'asset actuel `teemo-character.png` couvre-t-il assez de poses, ou on en commande d'autres (idle / hello / surprise / sleeping) ?
- **Quirky stats** : copy en français à valider, et liste des seuils. À traiter en mini-spec dédiée à la Phase 2/3 si la liste devient longue.
- **Bricolage Grotesque** : tester en charge dans le hero pour confirmer la lisibilité du H1 — sinon fallback vers Cabinet Grotesk ou Geist.
