/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { RiDiscordFill } from "@remixicon/react";
import { Button } from "../Button";
import { TeemoMascot } from "../TeemoMascot";
import { BOT_INVITE_URL } from "@/lib/env";

export function CtaLanding() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -bottom-32 size-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, var(--hf-honey-glow) 0%, transparent 60%)" }}
      />
      <div className="relative mx-auto max-w-[1100px] px-6 py-20 lg:py-28">
        <div className="rounded-hf-card-lg border border-hf-line bg-hf-surface px-8 py-12 lg:px-14 lg:py-16 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
          <div>
            <h2 className="font-display text-hf-display-2 text-hf-navy mb-4">
              Prêt à booster ta guilde ?
            </h2>
            <p className="text-hf-body-lg text-hf-navy-soft max-w-lg mb-7">
              Setup en 2 minutes. Aucune config. Ton serveur va kiffer, et toi aussi.
            </p>
            <a href={BOT_INVITE_URL} target="_blank" rel="noreferrer" className="inline-flex">
              <Button size="lg" variant="primary">
                <RiDiscordFill className="size-5" />
                Ajouter à Discord
              </Button>
            </a>
          </div>
          <div className="flex justify-center lg:justify-end">
            <TeemoMascot size="lg" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
