"use client";

import React from "react";
import { motion } from "framer-motion";
import { FeatureCard } from "@/components/molecules/FeatureCard";
import { GlowingText } from "@/components/atoms/GlowingText";

const features = [
  {
    icon: "⚔️",
    title: "Stats de Champions",
    description:
      "Obtenez des statistiques détaillées pour n'importe quel champion : taux de victoire, taux de sélection, taux de ban et données de matchup à tous les rangs.",
    variant: "blue" as const,
  },
  {
    icon: "🛠️",
    title: "Recommandations de Builds",
    description:
      "Builds d'objets optimaux, runes et ordres de compétences basés sur des millions de parties analysées. Gardez une longueur d'avance sur la méta !",
    variant: "gold" as const,
  },
  {
    icon: "👥",
    title: "Outils Communautaires",
    description:
      "Messages de bienvenue personnalisés, gestion des rôles, stats du serveur et outils de modération pour garder votre communauté active.",
    variant: "honey" as const,
  },
  {
    icon: "📈",
    title: "Suivi de Joueurs",
    description:
      "Suivez votre progression en classé, votre historique de matchs et vos performances. Fixez des objectifs et regardez vos LP grimper !",
    variant: "blue" as const,
  },
  {
    icon: "🎮",
    title: "Mini-jeux",
    description:
      "5 mini-jeux amusants sur le thème de LoL : Démineur, Quiz Champion, Trivia, Memory et Esquive le Skillshot !",
    variant: "gold" as const,
  },
  {
    icon: "🔔",
    title: "Notifications en Direct",
    description:
      "Soyez notifié quand vos streamers préférés sont en live, quand les patchs sortent ou quand vos amis lancent une partie.",
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
          <span className="inline-block px-4 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-sm text-yellow-200 mb-4 backdrop-blur-md">
            Fonctionnalités
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Tout ce qu'il Vous Faut pour{" "}
            <GlowingText variant="gold" as="span" animate={false}>
              Dominer
            </GlowingText>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des fonctionnalités puissantes pour améliorer votre expérience League of Legends sur Discord
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
