"use client";

import React from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";

const stats = [
  {
    value: 50000,
    suffix: "+",
    label: "Serveurs Actifs",
    icon: "🖥️",
    variant: "blue" as const,
  },
  {
    value: 1000000,
    suffix: "+",
    label: "Utilisateurs Satisfaits",
    icon: "👥",
    variant: "gold" as const,
  },
  {
    value: 10000000,
    suffix: "+",
    label: "Commandes Exécutées",
    icon: "⚡",
    variant: "honey" as const,
  },
  {
    value: 99.9,
    suffix: "%",
    label: "Disponibilité",
    icon: "✨",
    variant: "blue" as const,
  },
];

export function StatsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-deep)]/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-sm text-yellow-200 mb-4 backdrop-blur-md">
            Statistiques
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Adopté par la{" "}
            <span className="gradient-text-beemo">Communauté</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Rejoignez des milliers de serveurs Discord qui utilisent déjà BeemoBot
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              value={`${stat.value}${stat.suffix}`}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
