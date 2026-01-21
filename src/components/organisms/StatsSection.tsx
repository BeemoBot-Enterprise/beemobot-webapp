"use client";

import React from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/molecules/StatCard";

const stats = [
  {
    value: 50000,
    suffix: "+",
    label: "Active Servers",
    icon: "🖥️",
    variant: "blue" as const,
  },
  {
    value: 1000000,
    suffix: "+",
    label: "Happy Users",
    icon: "👥",
    variant: "gold" as const,
  },
  {
    value: 10000000,
    suffix: "+",
    label: "Commands Run",
    icon: "⚡",
    variant: "honey" as const,
  },
  {
    value: 99.9,
    suffix: "%",
    label: "Uptime",
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
          <span className="inline-block px-4 py-1 rounded-full glass-hextech text-sm text-[var(--hextech-blue)] mb-4">
            Stats
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Trusted by the{" "}
            <span className="gradient-text-beemo">Community</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of Discord servers already using BeemoBot
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
              variant={stat.variant}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
