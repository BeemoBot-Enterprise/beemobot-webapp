"use client";

import React from "react";
import { motion } from "framer-motion";
import { GamePreviewCard } from "@/components/molecules/GamePreviewCard";

const games = [
  {
    title: "Teemo Minesweeper",
    description: "Trouvez tous les champignons sans les déclencher ! Le démineur classique à la sauce Teemo.",
    icon: "🍄",
    color: "honey" as const,
    href: "/game?tab=minesweeper",
  },
  {
    title: "Guess the Champion",
    description: "Pouvez-vous identifier le champion par ses compétences ? Testez vos connaissances LoL !",
    icon: "🎯",
    color: "blue" as const,
    href: "/game?tab=guess",
  },
  {
    title: "Dodge the Skillshot",
    description: "Contrôlez Beemo et esquivez les skillshots ! Combien de temps pouvez-vous survivre ?",
    icon: "⚡",
    color: "cyan" as const,
    href: "/game?tab=dodge",
  },
  {
    title: "LoL Trivia",
    description: "Testez vos connaissances League of Legends avec des questions sur les champions, les objets et le lore.",
    icon: "🧠",
    color: "purple" as const,
    href: "/game?tab=trivia",
  },
  {
    title: "Memory Match",
    description: "Associez les portraits de champions dans ce jeu de mémoire classique. À quelle vitesse pouvez-vous terminer ?",
    icon: "🃏",
    color: "gold" as const,
    href: "/game?tab=memory",
  },
];

export function MinigamesPreview() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-surface)]/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-sm text-yellow-200 mb-4 backdrop-blur-md">
            Minigames
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text-beemo">5 Mini-jeux</span> Amusants
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Faites une pause de la Faille avec notre collection de mini-jeux sur le thème de LoL
          </p>
        </motion.div>

        {/* Games grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.slice(0, 3).map((game, index) => (
            <GamePreviewCard
              key={game.title}
              title={game.title}
              description={game.description}
              icon={game.icon}
              color={game.color}
              href={game.href}
              index={index}
            />
          ))}
        </div>

        {/* Second row - centered */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-6">
          {games.slice(3).map((game, index) => (
            <GamePreviewCard
              key={game.title}
              title={game.title}
              description={game.description}
              icon={game.icon}
              color={game.color}
              href={game.href}
              index={index + 3}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="/game"
            className="inline-flex items-center gap-2 text-[var(--hextech-blue)] hover:text-[var(--hextech-gold)] transition-colors"
          >
            Voir Tous les Jeux
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
