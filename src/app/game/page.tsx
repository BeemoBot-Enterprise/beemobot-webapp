/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

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

export default function GameHubPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-text mb-2">Mini-jeux</h1>
      <p className="text-text-muted mb-8">Choisis un jeu et c&apos;est parti.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((g) => (
          <GamePreviewCard key={g.slug} {...g} />
        ))}
      </div>
    </main>
  );
}
