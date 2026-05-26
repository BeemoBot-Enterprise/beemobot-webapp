/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { RiBarChartFill, RiTrophyFill, RiGamepadFill, type RemixiconComponentType } from "@remixicon/react";
import { Card } from "../Card";
import { SectionShell } from "../SectionShell";

type Feature = {
  icon: RemixiconComponentType;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: RiBarChartFill,
    title: "Profils Riot",
    description: "Rank, KDA, masteries, last games — toutes les stats de tes invocateurs depuis l'API officielle.",
  },
  {
    icon: RiTrophyFill,
    title: "Leaderboards",
    description: "Top shrooms, top respects, top honey — par serveur ou global. Ton classement bouge avec tes games.",
  },
  {
    icon: RiGamepadFill,
    title: "Mini-jeux",
    description: "Trivia LoL, Memory, Minesweeper Teemo, Dodge Skillshot — gagne du honey, dépense-le au shop.",
  },
];

export function FeaturesLanding() {
  return (
    <section id="features">
      <SectionShell
        eyebrow="— Fonctionnalités"
        title="Tout pour ta communauté."
        lead="Les outils dont ta guilde a besoin, sans usine à gaz. Tu invites le bot, tu joues, le reste suit."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} variant="interactive" className="p-5">
                <div className="size-10 rounded-hf-card bg-hf-honey-glow text-hf-honey-text flex items-center justify-center mb-4">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-hf-body-lg font-semibold text-hf-navy mb-1.5">{feature.title}</h3>
                <p className="text-hf-body-sm text-hf-navy-soft">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </SectionShell>
    </section>
  );
}
