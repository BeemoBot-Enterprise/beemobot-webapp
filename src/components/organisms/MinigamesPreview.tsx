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
