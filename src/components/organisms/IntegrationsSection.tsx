/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import { RiArrowRightUpLongLine } from "@remixicon/react";
import {
  SiDiscord,
  SiRiotgames,
  SiTwitch,
} from "react-icons/si";
import type { IconType } from "react-icons";
import Eyebrow from "@/components/atoms/Eyebrow";
import * as LinkButton from "@/components/ui/link-button";

type Integration = {
  name: string;
  icon: IconType;
  iconColor: string;
  description: string;
  bold: string;
};

const integrations: Integration[] = [
  {
    name: "Discord",
    icon: SiDiscord,
    iconColor: "text-[#5865F2]",
    description: "Slash commands, embeds riches et OAuth ",
    bold: "directement depuis ton serveur.",
  },
  {
    name: "Riot Games",
    icon: SiRiotgames,
    iconColor: "text-[#D13639]",
    description: "Stats live, ranks, masteries et historique ",
    bold: "via l'API officielle.",
  },
  {
    name: "Twitch",
    icon: SiTwitch,
    iconColor: "text-[#9146FF]",
    description: "Alertes de live et drops synchronisés ",
    bold: "avec ta communauté Discord.",
  },
];

const proofs = [
  { label: "Uptime", value: "99.8%" },
  { label: "Latency", value: "< 120ms" },
];

export const IntegrationsSection = () => (
  <section className="border-b border-stroke-soft-200">
    <div className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
        <div className="flex w-full flex-col justify-between gap-10 lg:w-[392px] lg:shrink-0">
          <div className="flex flex-col gap-5">
            <Eyebrow>
              Intégrations
            </Eyebrow>
            <h2 className="text-title-h4 lg:text-title-h3 text-text-strong-950 !font-[600]">
              Branché aux outils que ta communauté utilise déjà
            </h2>
            <p className="text-paragraph-md text-text-sub-600">
              Connecte Discord, Riot Games et Twitch sans config — BeemoBot
              <span className="text-text-strong-950"> orchestre le reste pour toi.</span>
            </p>
            <LinkButton.Root variant="primary" size="medium" asChild>
              <a href="#features" className="group">
                Voir toutes les fonctionnalités
                <LinkButton.Icon
                  as={RiArrowRightUpLongLine}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </LinkButton.Root>
          </div>
          <div className="flex items-center gap-6">
            {proofs.map((proof) => (
              <div key={proof.label} className="flex flex-col gap-1">
                <span className="text-title-h6 tabular-nums text-text-strong-950">
                  {proof.value}
                </span>
                <span className="text-subheading-2xs text-text-soft-400">
                  {proof.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 lg:max-w-[600px]">
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <div key={integration.name} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-stroke-soft-200 bg-bg-weak-50">
                    <Icon className={`h-7 w-7 ${integration.iconColor}`} />
                  </div>
                  {index < integrations.length - 1 && (
                    <div className="mt-2 h-8 w-px bg-stroke-soft-200" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 pt-1">
                  <h3 className="text-label-md text-text-strong-950">
                    {integration.name}
                  </h3>
                  <p className="text-paragraph-sm text-text-sub-600">
                    {integration.description}
                    <span className="text-text-strong-950">{integration.bold}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default IntegrationsSection;
