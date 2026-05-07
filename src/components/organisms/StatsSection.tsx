/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import {
  RiFlashlightFill,
  RiBarChartFill,
  RiTeamFill,
  type RemixiconComponentType,
} from "@remixicon/react";
import Eyebrow from "@/components/atoms/Eyebrow";

type Stat = {
  id: string;
  badgeText: string;
  badgeIcon: RemixiconComponentType;
  badgeBg: string;
  badgeText_: string;
  value: string;
  valueLabel: string;
  description: string;
  descriptionStrong: string;
  accentBar: string;
};

const statsData: Stat[] = [
  {
    id: "stat1",
    badgeText: "Configuration express",
    badgeIcon: RiFlashlightFill,
    badgeBg: "bg-primary-alpha-10",
    badgeText_: "text-primary-base",
    value: "< 2min",
    valueLabel: "Setup complet",
    description: "Invite le bot, lance",
    descriptionStrong: "/help_orion — c'est prêt.",
    accentBar: "before:bg-primary-base",
  },
  {
    id: "stat2",
    badgeText: "Stats Riot en direct",
    badgeIcon: RiBarChartFill,
    badgeBg: "bg-warning-lighter",
    badgeText_: "text-warning-base",
    value: "85k+",
    valueLabel: "Parties analysées",
    description: "Ranks, KDA, masteries —",
    descriptionStrong: "tout via l'API officielle.",
    accentBar: "before:bg-warning-base",
  },
  {
    id: "stat3",
    badgeText: "Communautés engagées",
    badgeIcon: RiTeamFill,
    badgeBg: "bg-success-lighter",
    badgeText_: "text-success-base",
    value: "+87%",
    valueLabel: "Activité serveur",
    description: "Mini-jeux et leaderboards qui",
    descriptionStrong: "ramènent les membres en chat.",
    accentBar: "before:bg-success-base",
  },
];

export const StatsSection = () => (
  <section className="border-b border-stroke-soft-200">
    <div className="max-w-[1200px] mx-auto px-6 py-20 flex flex-col gap-10 lg:gap-14">
      <div className="flex flex-col items-start lg:items-center text-left lg:text-center gap-4">
        <Eyebrow>
          Stats &amp; Metrics
        </Eyebrow>
        <h2 className="text-title-h4 md:text-title-h3 text-text-strong-950 max-w-2xl !font-[600]">
          Conçu pour les communautés qui jouent ensemble
        </h2>
        <p className="text-paragraph-md text-text-sub-600 max-w-xl">
          Moins de friction côté admin, plus de temps en game —{" "}
          <span className="text-text-strong-950">
            BeemoBot s'occupe du reste.
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        {statsData.map((stat) => {
          const Icon = stat.badgeIcon;
          return (
            <div
              key={stat.id}
              className="flex flex-1 flex-col rounded-[20px] border border-stroke-soft-200 bg-bg-weak-50 p-8 transition-colors hover:bg-bg-soft-200"
            >
              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full border border-stroke-soft-200 bg-bg-white-0/60 px-2.5 py-1 mb-8 ${stat.badgeText_}`}
              >
                <Icon className="h-3 w-3" />
                <span className="text-[11px] font-medium uppercase tracking-[0.12em]">
                  {stat.badgeText}
                </span>
              </span>

              <div className="mb-8 flex flex-col gap-1 lg:mb-12">
                <div
                  className={`relative pl-6 text-title-h3 lg:text-title-h2 text-text-strong-950 tabular-nums before:absolute before:top-1 before:bottom-1 before:left-0 before:w-0.5 before:content-[''] ${stat.accentBar}`}
                >
                  {stat.value}
                </div>
                <div className="text-paragraph-sm text-text-sub-600 pl-6">
                  {stat.valueLabel}
                </div>
              </div>

              <p className="text-paragraph-sm text-text-sub-600">
                {stat.description}{" "}
                <span className="text-text-strong-950">
                  {stat.descriptionStrong}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default StatsSection;
