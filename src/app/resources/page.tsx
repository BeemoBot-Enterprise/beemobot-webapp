/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import Eyebrow from "@/components/atoms/Eyebrow";
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
      <div className="flex flex-col gap-3 mb-10">
        <Eyebrow>
          Ressources
        </Eyebrow>
        <h1 className="text-title-h4 md:text-title-h3 text-text-strong-950 !font-[600]">
          Liens, guides et outils
        </h1>
        <p className="text-paragraph-md text-text-sub-600 max-w-2xl">
          Tout ce qui peut t'aider à mieux utiliser BeemoBot ou progresser
          sur League of Legends.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((r) => (
          <a
            key={r.href}
            href={r.href}
            target={r.external ? "_blank" : undefined}
            rel={r.external ? "noreferrer" : undefined}
            className="block"
          >
            <Card className="p-6 rounded-20 border-stroke-soft-200 bg-bg-weak-50 hover:bg-bg-soft-200 transition-colors h-full flex flex-col gap-2">
              <p className="text-subheading-2xs text-text-soft-400">
                {r.category}
              </p>
              <h3 className="text-label-md text-text-strong-950">
                {r.title}
              </h3>
              <p className="text-paragraph-sm text-text-sub-600">
                {r.description}
              </p>
            </Card>
          </a>
        ))}
      </div>
    </main>
  );
}
