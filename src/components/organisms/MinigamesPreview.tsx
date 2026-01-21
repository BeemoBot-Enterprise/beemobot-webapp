"use client";

import React from "react";
import { motion } from "framer-motion";
import { GamePreviewCard } from "@/components/molecules/GamePreviewCard";

const games = [
  {
    title: "Teemo Minesweeper",
    description: "Find all the mushrooms without triggering them! Classic minesweeper with a Teemo twist.",
    icon: "🍄",
    color: "honey" as const,
    href: "/game?tab=minesweeper",
  },
  {
    title: "Guess the Champion",
    description: "Can you identify the champion from their abilities? Test your LoL knowledge!",
    icon: "🎯",
    color: "blue" as const,
    href: "/game?tab=guess",
  },
  {
    title: "Dodge the Skillshot",
    description: "Control Beemo and dodge incoming skillshots! How long can you survive?",
    icon: "⚡",
    color: "cyan" as const,
    href: "/game?tab=dodge",
  },
  {
    title: "LoL Trivia",
    description: "Test your League of Legends knowledge with questions about champions, items, and lore.",
    icon: "🧠",
    color: "purple" as const,
    href: "/game?tab=trivia",
  },
  {
    title: "Memory Match",
    description: "Match champion portraits in this classic memory game. How fast can you clear the board?",
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
            <span className="gradient-text-beemo">5 Fun Games</span> to Play
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Take a break from the Rift with our collection of LoL-themed minigames
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
            View All Games
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
