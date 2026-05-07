/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import Image, { type StaticImageData } from "next/image";
import * as React from "react";
import { LOGO } from "@/assets/images";

const LOGOS: { src: StaticImageData; alt: string }[] = [
  { src: LOGO.discord, alt: "Discord" },
  { src: LOGO.riotGames, alt: "Riot Games" },
  { src: LOGO.opgg, alt: "OP.GG" },
  { src: LOGO.github, alt: "GitHub" },
];

export function IntegrationsLanding() {
  return (
    <section className="bg-hf-surface-alt border-y border-hf-line">
      <div className="mx-auto max-w-[1100px] px-6 py-10">
        <p className="text-hf-eyebrow uppercase tracking-[0.15em] font-bold text-hf-navy-soft text-center mb-6">
          Construit avec et pour
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 grayscale opacity-70">
          {LOGOS.map((logo) => (
            <div key={logo.alt} className="relative h-10 w-28">
              <Image src={logo.src} alt={logo.alt} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
