# BeemoBot — webapp

Next.js 15 (App Router) frontend for the BeemoBot ecosystem. Pairs with the [`beemobot-api`](../beemobot-api) backend and the [`bot`](../bot) Discord bot.

## Stack

- Next.js 15, React 19, TypeScript
- Tailwind CSS, Framer Motion, Three.js (`@react-three/fiber`)
- Atomic Design under `src/components/{atoms,molecules,organisms,templates}`

## Setup

```bash
pnpm install
cp .env.example .env.local      # then edit values
pnpm dev                        # http://localhost:3000
```

## Environment

All env values are accessed through `src/lib/env.ts` — never read `process.env.*` directly in components.

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | BeemoBot API base URL (default `http://localhost:3333`) |
| `NEXT_PUBLIC_BOT_INVITE_URL` | Discord invite URL for the bot |

## Scripts

| Command | Action |
|---|---|
| `pnpm dev` | Local dev server with HMR |
| `pnpm build` | Production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | ESLint |

## Routing

| Path | Purpose |
|---|---|
| `/` | Landing (hero, features, mini-games, testimonials, CTA) |
| `/auth/callback` | OAuth callback target — the API redirects here with `?token=...` |
| `/profile` | User profile + reputation stats (Discord login required) |
| `/search` | Summoner lookup (Riot ID) |
| `/game` | Mini-games hub |
| `/documentation` | Doc viewer |
| `/resources` | Resources |

## Auth flow

1. User clicks "Login" → `useAuth.login()` redirects to `${API_URL}/auth/discord/redirect`
2. Discord OAuth → API receives the callback → API generates a token → redirects to `${WEBAPP_URL}/profile?token=...`
3. `ProfileContent.tsx` reads the token, persists it in `localStorage`, fetches `/auth/me` and `/game/stats/:username`

## See also

- [`../CLAUDE.md`](../CLAUDE.md) — full ecosystem map (bot · api · webapp)
- [`../beemobot-api/API.md`](../beemobot-api/API.md) — API endpoints reference
