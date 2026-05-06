/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import StatCard from "@/components/molecules/StatCard";

const stats = [
  { label: "Serveurs Discord", value: "150+" },
  { label: "Joueurs trackés", value: "12k+" },
  { label: "Parties analysées", value: "85k+" },
  { label: "Mini-jeux", value: "5" },
];

export const StatsSection = () => (
  <section className="border-b border-border">
    <div className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
    </div>
  </section>
);
