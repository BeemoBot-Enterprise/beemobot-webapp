/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import GamePreviewCard from "@/components/molecules/GamePreviewCard";
import Eyebrow from "@/components/atoms/Eyebrow";
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
      <div className="flex flex-col gap-3 mb-10">
        <Eyebrow>Mini-jeux</Eyebrow>
        <h1 className="text-title-h4 md:text-title-h3 text-text-strong-950 !font-[600]">
          Choisis un jeu, c'est parti
        </h1>
        <p className="text-paragraph-md text-text-sub-600 max-w-2xl">
          Cinq mini-jeux dans le thème League of Legends — gagne du honey,
          défie tes amis, ou affronte le RNG.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((g) => (
          <GamePreviewCard key={g.slug} {...g} />
        ))}
      </div>
    </main>
  );
}
