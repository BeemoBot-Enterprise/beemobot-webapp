"use client";

import React from "react";
import { motion } from "framer-motion";
import { FeatureCard } from "@/components/molecules/FeatureCard";
import { GlowingText } from "@/components/atoms/GlowingText";

const features = [
  {
    icon: "⚔️",
    title: "Champion Stats",
    description:
      "Get detailed statistics for any champion including win rates, pick rates, ban rates, and matchup data across all ranks.",
    variant: "blue" as const,
  },
  {
    icon: "🛠️",
    title: "Build Recommendations",
    description:
      "Optimal item builds, runes, and skill orders based on millions of games analyzed. Stay ahead of the meta!",
    variant: "gold" as const,
  },
  {
    icon: "👥",
    title: "Community Tools",
    description:
      "Custom welcome messages, role management, server stats, and moderation tools to keep your community thriving.",
    variant: "honey" as const,
  },
  {
    icon: "📈",
    title: "Player Tracking",
    description:
      "Track your ranked progress, match history, and performance metrics. Set goals and watch your LP climb!",
    variant: "blue" as const,
  },
  {
    icon: "🎮",
    title: "Minigames",
    description:
      "5 fun LoL-themed minigames including Minesweeper, Champion Quiz, Trivia, Memory Match, and Dodge the Skillshot!",
    variant: "gold" as const,
  },
  {
    icon: "🔔",
    title: "Live Notifications",
    description:
      "Get notified when your favorite streamers go live, when patches drop, or when friends start a game.",
    variant: "honey" as const,
  },
];

export function FeatureShowcase() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 honeycomb-bg opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full glass-hextech text-sm text-[var(--hextech-blue)] mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <GlowingText variant="gold" as="span" animate={false}>
              Dominate
            </GlowingText>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Packed with powerful features to enhance your League of Legends
            Discord experience
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              variant={feature.variant}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
