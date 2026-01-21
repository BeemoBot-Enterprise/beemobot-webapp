"use client";

import { Suspense } from "react";
import GameTabs from "@/components/organisms/GameTabs";
import { GlowOrb } from "@/components/atoms/GlowOrb";

function GameTabsLoading() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-pulse text-center">
        <span className="text-4xl">🎮</span>
        <p className="text-muted-foreground mt-4">Loading games...</p>
      </div>
    </div>
  );
}

export default function Game() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background orbs */}
      <GlowOrb variant="honey" size="lg" className="-top-20 -right-20" />
      <GlowOrb variant="blue" size="xl" className="top-1/3 -left-32" />
      <GlowOrb variant="purple" size="lg" className="bottom-20 right-10" />

      {/* Honeycomb pattern */}
      <div className="absolute inset-0 honeycomb-bg opacity-20" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-hextech">
            Beemo Minigames
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take on the challenge with our League of Legends themed minigames and
            prove your skills!
          </p>
        </div>

        <div className="glass rounded-2xl overflow-hidden shadow-xl mb-12">
          <Suspense fallback={<GameTabsLoading />}>
            <GameTabs />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
