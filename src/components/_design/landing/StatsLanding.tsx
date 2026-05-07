/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { Card } from "../Card";
import { StatNumber } from "../StatNumber";

const STATS = [
  { value: "320", unit: "+", label: "Serveurs Discord actifs" },
  { value: "85", unit: "k", label: "Parties LoL indexées" },
  { value: "+87", unit: "%", label: "Engagement serveur" },
] as const;

export function StatsLanding() {
  return (
    <section className="border-y border-hf-line bg-hf-surface">
      <div className="mx-auto max-w-[1100px] px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <StatNumber value={stat.value} unit={stat.unit} label={stat.label} />
          </Card>
        ))}
      </div>
    </section>
  );
}
