/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { use } from "react";

const GAMES: Record<string, ReturnType<typeof dynamic>> = {
  trivia: dynamic(
    () =>
      import("@/components/organisms/LoLTriviaGame").then((m) => ({
        default: m.LoLTriviaGame,
      })),
    { ssr: false },
  ),
  memory: dynamic(
    () =>
      import("@/components/organisms/MemoryMatchGame").then((m) => ({
        default: m.MemoryMatchGame,
      })),
    { ssr: false },
  ),
  minesweeper: dynamic(
    () => import("@/components/organisms/TeemoMinesweeper"),
    { ssr: false },
  ),
  skillshot: dynamic(
    () =>
      import("@/components/organisms/DodgeSkillshotGame").then((m) => ({
        default: m.DodgeSkillshotGame,
      })),
    { ssr: false },
  ),
  guess: dynamic(
    () =>
      import("@/components/organisms/GuessChampionGame").then((m) => ({
        default: m.GuessChampionGame,
      })),
    { ssr: false },
  ),
};

export default function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const Game = GAMES[slug];
  if (!Game) notFound();
  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <Game />
    </main>
  );
}
