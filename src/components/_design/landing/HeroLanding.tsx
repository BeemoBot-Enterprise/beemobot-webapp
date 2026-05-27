/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { RiDiscordFill, RiArrowRightLine } from "@remixicon/react";
import { Button } from "../Button";
import { Pill } from "../Pill";
import { TeemoMascot } from "../TeemoMascot";
import { BOT_INVITE_URL } from "@/lib/env";

export function HeroLanding() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-32 size-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, var(--hf-honey-glow) 0%, transparent 60%)" }}
      />
      <div className="relative mx-auto max-w-[1100px] px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="font-display text-hf-display-1 text-hf-navy mb-6">
              Le bot Discord que ta guilde{" "}
              <span className="bg-[linear-gradient(180deg,transparent_64%,var(--hf-honey-soft)_64%)] px-1 -mx-1">
                League
              </span>{" "}
              mérite.
            </h1>
            <p className="text-hf-body-lg text-hf-navy-soft max-w-xl mb-8">
              Stats Riot, leaderboards, mini-jeux et un peu de honey à gagner. Setup en 2 minutes,
              sans config.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <a href={BOT_INVITE_URL} target="_blank" rel="noreferrer" className="inline-flex">
                <Button size="lg" variant="primary">
                  <RiDiscordFill className="size-5" />
                  Ajouter à Discord
                </Button>
              </a>
              <a href="#features" className="inline-flex">
                <Button size="lg" variant="outline">
                  Voir la démo
                  <RiArrowRightLine className="size-4" />
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex shrink-0">
                <Avatar gradient="linear-gradient(135deg, #5865F2, #785AF0)" />
                <Avatar gradient="linear-gradient(135deg, #FFD93D, #E5A422)" />
                <Avatar gradient="linear-gradient(135deg, #2DA66B, #1A7A4F)" />
                <Avatar gradient="linear-gradient(135deg, #FF6B6B, #C93838)" />
              </div>
              <p className="text-hf-body-sm text-hf-navy-soft">
                <span className="text-hf-navy font-semibold">+12 000 joueurs</span> ont lié leur compte Riot.
              </p>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <TeemoMascot size="xl" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Avatar({ gradient }: { gradient: string }) {
  return (
    <span
      aria-hidden
      className="inline-block size-7 rounded-full border-2 border-hf-bg -ml-2 first:ml-0"
      style={{ background: gradient }}
    />
  );
}
