/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import Image from "next/image";
import Link from "next/link";
import { RiDiscordFill, RiArrowRightLine } from "@remixicon/react";
import Eyebrow from "@/components/atoms/Eyebrow";
import * as Button from "@/components/ui/button";
import { BOT_INVITE_URL } from "@/lib/env";

const HeroSection = () => (
  <section className="relative -mt-14 lg:-mt-[72px] flex min-h-screen items-center border-b border-stroke-soft-200 overflow-hidden">
    <Image
      src="/Gemini_Generated_Image_l2f0vll2f0vll2f0.png"
      alt=""
      fill
      priority
      aria-hidden
      className="object-cover object-center -z-10"
    />
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-bg-white-0 via-bg-white-0/80 to-bg-white-0/30" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bg-white-0/90 via-transparent to-bg-white-0/40" />

    <div className="relative w-full max-w-[1200px] mx-auto px-6 pt-28 pb-16 lg:pt-32">
      <div className="max-w-2xl">
        <Eyebrow className="mb-6" tone="live" dot pulse>
          Bot live · 320+ serveurs
        </Eyebrow>

        <h1 className="text-title-h2 lg:text-title-h1 text-text-strong-950 mb-6 !font-[600]">
          Le bot Discord pour ta communauté{" "}
          <span className="text-primary-base">League of Legends</span>.
        </h1>
        <p className="text-paragraph-md lg:text-paragraph-lg text-text-sub-600 mb-8 max-w-xl">
          Stats de joueurs, profils détaillés, leaderboards et mini-jeux —
          directement depuis ton serveur Discord.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={BOT_INVITE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-3 rounded-10 bg-[#5865F2] px-3.5 text-label-sm text-white transition-colors hover:bg-[#4752C4]"
          >
            <RiDiscordFill className="size-5" />
            Ajouter à Discord
          </a>
          <Button.Root variant="neutral" mode="stroke" size="medium" asChild>
            <Link href="#features">
              Voir les fonctionnalités
              <Button.Icon as={RiArrowRightLine} />
            </Link>
          </Button.Root>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
