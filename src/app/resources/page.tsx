/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import { Card } from "@/components/atoms/Card";
import { BOT_INVITE_URL } from "@/lib/env";

interface Resource {
  title: string;
  description: string;
  href: string;
  category: string;
  external?: boolean;
}

const resources: Resource[] = [
  {
    title: "Inviter BeemoBot",
    description:
      "Ajoute le bot à ton serveur Discord en quelques clics — permissions admin requises.",
    href: BOT_INVITE_URL,
    category: "BeemoBot",
    external: true,
  },
  {
    title: "Documentation",
    description:
      "Quick start, système de réputation, honey & shop, FAQ.",
    href: "/documentation",
    category: "BeemoBot",
  },
  {
    title: "Mini-jeux",
    description:
      "Trivia, memory, dodge skillshot, devine le champion, démineur Teemo.",
    href: "/game",
    category: "BeemoBot",
  },
  {
    title: "Riot Games",
    description: "Site officiel de l’éditeur de League of Legends.",
    href: "https://www.riotgames.com",
    category: "Officiel",
    external: true,
  },
  {
    title: "League of Legends",
    description: "Site officiel du jeu, patch notes et téléchargement.",
    href: "https://www.leagueoflegends.com",
    category: "Officiel",
    external: true,
  },
  {
    title: "OP.GG",
    description:
      "Stats, builds et matchups — la référence pour analyser ses parties.",
    href: "https://www.op.gg",
    category: "Stats",
    external: true,
  },
  {
    title: "Riot Developer Portal",
    description:
      "API publique Riot — utilisée par BeemoBot pour vérifier les matches.",
    href: "https://developer.riotgames.com",
    category: "Dev",
    external: true,
  },
  {
    title: "Discord Developer Portal",
    description:
      "Documentation officielle pour comprendre le fonctionnement des bots Discord.",
    href: "https://discord.com/developers/docs",
    category: "Dev",
    external: true,
  },
];

export default function ResourcesPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-text mb-2">Ressources</h1>
      <p className="text-text-muted mb-8">
        Liens, guides et outils utiles pour utiliser BeemoBot et League of
        Legends.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((r) => (
          <a
            key={r.href}
            href={r.href}
            target={r.external ? "_blank" : undefined}
            rel={r.external ? "noreferrer" : undefined}
            className="block"
          >
            <Card className="p-6 hover:bg-surface-hover transition-colors h-full flex flex-col gap-2">
              <p className="text-xs uppercase tracking-wide text-text-muted">
                {r.category}
              </p>
              <h3 className="text-lg font-semibold text-text">{r.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {r.description}
              </p>
            </Card>
          </a>
        ))}
      </div>
    </main>
  );
}
