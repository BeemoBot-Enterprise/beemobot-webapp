/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import FeatureCard from "@/components/molecules/FeatureCard";
import {
  FaChartBar,
  FaUserShield,
  FaTrophy,
  FaGamepad,
  FaSearch,
  FaBolt,
} from "react-icons/fa";
import Eyebrow from "@/components/atoms/Eyebrow";

const features = [
  {
    icon: <FaChartBar />,
    title: "Stats en temps réel",
    description:
      "Connecte ton compte Riot et affiche tes performances directement sur Discord.",
  },
  {
    icon: <FaSearch />,
    title: "Recherche de joueurs",
    description: "Trouve n'importe quel summoner par GameName#Tag et région.",
  },
  {
    icon: <FaTrophy />,
    title: "Leaderboards",
    description: "Classements shrooms et respects pour ta communauté.",
  },
  {
    icon: <FaGamepad />,
    title: "5 mini-jeux",
    description:
      "Trivia, Memory, Minesweeper, Skillshot, Guess the Champion.",
  },
  {
    icon: <FaUserShield />,
    title: "Profils Riot complets",
    description: "Rang, masteries, derniers matchs et historique.",
  },
  {
    icon: <FaBolt />,
    title: "Setup en 2 minutes",
    description: "Invite, configure, c'est prêt — pas de config bancale.",
  },
];

export const FeatureShowcase = () => (
  <section id="features" className="border-b border-stroke-soft-200">
    <div className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="max-w-2xl mb-12 flex flex-col gap-3">
        <Eyebrow>
          Fonctionnalités
        </Eyebrow>
        <h2 className="text-title-h4 md:text-title-h3 text-text-strong-950 !font-[600]">
          Tout ce qu'il faut pour animer ta communauté
        </h2>
        <p className="text-paragraph-md text-text-sub-600">
          Le pack complet pour ton serveur LoL — sans config bancale, sans
          surprise.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </div>
  </section>
);
