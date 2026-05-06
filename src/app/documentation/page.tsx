/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import { Card } from "@/components/atoms/Card";

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "quickstart", label: "Quick start" },
  { id: "reputation", label: "Réputation" },
  { id: "honey", label: "Honey & shop" },
  { id: "faq", label: "FAQ" },
];

const quickstart = [
  {
    step: "1",
    title: "Connecte-toi avec Discord",
    desc: "Clique sur « Login » en haut à droite. Tu seras redirigé vers Discord pour autoriser BeemoBot à accéder à ton profil.",
  },
  {
    step: "2",
    title: "Lie ton compte Riot",
    desc: "Rends-toi sur /auth/link et renseigne ton gameName, tagLine et ta région (ex : Pseudo + EUW1 + EUW). Le bot vérifie ton identité via l’API Riot.",
  },
  {
    step: "3",
    title: "Joue une game LoL",
    desc: "Joue une partie avec d’autres utilisateurs de BeemoBot. Le worker détecte automatiquement les parties communes dans tes 20 dernières games.",
  },
  {
    step: "4",
    title: "Donne une réputation",
    desc: "Tape /judge Riot-Tag sur Discord pour juger un joueur présent dans une de tes parties récentes. Choisis shroom ou respect via les boutons interactifs.",
  },
  {
    step: "5",
    title: "Ou attends le DM automatique",
    desc: "Le worker proactif t’envoie un DM après chaque game pour proposer de juger tes coéquipiers et adversaires. Pas besoin de taper une commande.",
  },
];

const reputationRules = [
  {
    title: "Preuve par match obligatoire",
    desc: "Tu ne peux juger que les joueurs présents dans tes vraies parties Riot (allié ou adverse). Le système vérifie via l’API Riot.",
  },
  {
    title: "Maximum 1 shroom + 1 respect par paire et par match",
    desc: "Pour chaque match commun, tu peux donner au plus 1 shroom et 1 respect à chaque joueur. Le système trace tout pour éviter le spam.",
  },
  {
    title: "Score immuable",
    desc: "Ton score ne baisse jamais. Ce que les gens pensent de toi reste gravé — c’est leur jugement, pas une note fluctuante.",
  },
  {
    title: "Poids de la réputation",
    desc: "Le vote d’un joueur respecté pèse davantage. Ton influence dépend de ton propre score.",
  },
];

const honeyEarnings = [
  { action: "Recevoir un Respect", honey: "+10" },
  { action: "Recevoir un Shroom", honey: "+5 (rage compensation)" },
  { action: "Daily login", honey: "+20" },
  { action: "Mini-jeu : victoire", honey: "×2 mise" },
  { action: "Mini-jeu : défaite", honey: "Mise perdue" },
];

const shopItems = [
  { name: "Badges", price: "100–500", desc: "Icônes de profil exclusives" },
  { name: "Borders", price: "500–1000", desc: "Cadres animés sur ton avatar" },
  { name: "Glow effects", price: "1000–2000", desc: "Effets lumineux sur ton profil" },
];

const faq = [
  {
    q: "Je n’ai pas reçu de DM du bot",
    a: "Vérifie que les DMs serveur sont activés dans les paramètres Discord du serveur BeemoBot. Le worker tourne toutes les 5 minutes — laisse-lui un peu de temps après ta game.",
  },
  {
    q: "Je ne peux pas juger ce joueur",
    a: "Vous devez avoir un match commun dans tes 20 dernières games. Si la partie est plus ancienne, elle n’est plus dans la fenêtre de vérification.",
  },
  {
    q: "Mon score n’a pas bougé",
    a: "La réputation est immuable — elle ne baisse jamais. Le honey aussi est append-only. Si tu viens de jouer, attends le poll worker (environ 5 minutes).",
  },
  {
    q: "Comment changer de Riot ID",
    a: "Contacte un admin du serveur. Le multi-link est désactivé pour la Phase 1. Un seul compte Riot par Discord.",
  },
  {
    q: "Ma clé Riot n’est pas reconnue",
    a: "Vérifie que ton gameName et tagLine sont exacts (respecte la casse). La région doit correspondre à celle de ton compte (EUW1, NA1, KR, etc.).",
  },
  {
    q: "Conflit de match — le bot dit que je n’étais pas dans la partie",
    a: "L’API Riot peut avoir un délai. Réessaie 10 minutes après la fin de la game. Si le problème persiste, contacte un admin avec l’ID du match.",
  },
];

export default function DocumentationPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 grid md:grid-cols-[220px_1fr] gap-12">
      <aside className="md:sticky md:top-20 md:self-start">
        <nav>
          <p className="text-xs uppercase tracking-wide text-text-muted mb-3 px-3">
            Documentation
          </p>
          <ul className="flex flex-col gap-1">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface rounded-md transition-colors"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <article className="max-w-3xl">
        <section id="intro" className="mb-14">
          <h1 className="text-3xl font-semibold text-text mb-3">
            Documentation BeemoBot
          </h1>
          <p className="text-text-muted leading-relaxed">
            BeemoBot est un bot Discord communautaire pour League of Legends. Il
            propose un système de réputation entre joueurs, une économie virtuelle
            (honey), et des mini-jeux. Cette page couvre les bases pour
            commencer.
          </p>
        </section>

        <section id="quickstart" className="mb-14">
          <h2 className="text-2xl font-semibold text-text mb-4">Quick start</h2>
          <p className="text-text-muted mb-6 leading-relaxed">
            Prends en main BeemoBot en 5 étapes.
          </p>
          <ol className="flex flex-col gap-3">
            {quickstart.map((item) => (
              <li key={item.step}>
                <Card className="p-5 flex gap-4">
                  <span className="flex-shrink-0 h-7 w-7 rounded-full border border-border bg-bg flex items-center justify-center text-xs font-semibold text-text">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-text font-medium mb-1">{item.title}</p>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        <section id="reputation" className="mb-14">
          <h2 className="text-2xl font-semibold text-text mb-4">
            Le système de réputation
          </h2>
          <p className="text-text-muted mb-6 leading-relaxed">
            La réputation BeemoBot est un reflet communautaire de ton
            comportement en jeu. Elle repose sur une preuve par match : tu ne
            peux juger que des gens avec qui tu as vraiment joué.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card className="p-5">
              <h3 className="text-base font-semibold text-text mb-1">Shroom</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                « Tu as joué comme une chèvre » ou « tu as été toxique ». Un
                shroom signale un comportement problématique : troll, AFK,
                insultes, int intentionnel.
              </p>
            </Card>
            <Card className="p-5">
              <h3 className="text-base font-semibold text-text mb-1">Respect</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                « GG bien joué ». Un respect salue un bon comportement, de
                l’entraide, du fair-play, ou simplement un bon game.
              </p>
            </Card>
          </div>

          <div className="flex flex-col gap-3">
            {reputationRules.map((rule) => (
              <Card key={rule.title} className="p-5">
                <p className="text-text font-medium mb-1">{rule.title}</p>
                <p className="text-sm text-text-muted leading-relaxed">
                  {rule.desc}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section id="honey" className="mb-14">
          <h2 className="text-2xl font-semibold text-text mb-4">Honey &amp; shop</h2>
          <p className="text-text-muted mb-6 leading-relaxed">
            Le honey est la monnaie de BeemoBot. Il s’accumule avec ta
            réputation et ton activité. Dépense-le dans le shop pour
            personnaliser ton profil.
          </p>

          <h3 className="text-sm font-semibold text-text uppercase tracking-wide mb-3">
            Gagner du honey
          </h3>
          <Card className="overflow-hidden mb-8 p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-5 text-left font-medium text-text-muted">
                    Action
                  </th>
                  <th className="py-3 px-5 text-left font-medium text-text-muted">
                    Honey gagné
                  </th>
                </tr>
              </thead>
              <tbody>
                {honeyEarnings.map((row) => (
                  <tr
                    key={row.action}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="py-3 px-5 text-text">{row.action}</td>
                    <td className="py-3 px-5 text-text-muted font-mono">
                      {row.honey}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <h3 className="text-sm font-semibold text-text uppercase tracking-wide mb-3">
            Shop
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            {shopItems.map((item) => (
              <Card key={item.name} className="p-5">
                <p className="text-text font-medium mb-1">{item.name}</p>
                <p className="text-text-muted font-mono text-sm mb-2">
                  {item.price}
                </p>
                <p className="text-sm text-text-muted leading-relaxed">
                  {item.desc}
                </p>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-sm text-text-muted">
            Le honey est dépensable — ta réputation, elle, ne l’est pas. Les
            deux évoluent indépendamment.
          </p>
        </section>

        <section id="faq" className="mb-14">
          <h2 className="text-2xl font-semibold text-text mb-4">FAQ</h2>
          <div className="flex flex-col gap-3">
            {faq.map((item) => (
              <Card key={item.q} className="p-0">
                <details className="group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                    <span className="text-text font-medium text-sm">
                      {item.q}
                    </span>
                    <span className="text-text-muted text-xs group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="px-5 pb-5 text-sm text-text-muted leading-relaxed">
                    {item.a}
                  </p>
                </details>
              </Card>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
