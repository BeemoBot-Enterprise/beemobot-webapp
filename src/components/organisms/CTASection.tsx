/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import { RiDiscordFill, RiArrowRightLine } from "@remixicon/react";
import Eyebrow from "@/components/atoms/Eyebrow";
import { BOT_INVITE_URL } from "@/lib/env";

export const CTASection = () => (
  <section className="border-b border-stroke-soft-200">
    <div className="max-w-[1200px] mx-auto px-6 py-20 flex flex-col items-start lg:items-center text-left lg:text-center">
      <Eyebrow className="mb-4">
        Powered by real teamwork
      </Eyebrow>
      <div className="mb-8 flex flex-col gap-4 lg:items-center">
        <h2 className="text-title-h4 md:text-title-h3 lg:text-title-h2 text-text-strong-950 !font-[600]">
          Prêt à passer à l'étape suivante&nbsp;?
        </h2>
        <p className="text-paragraph-md lg:text-paragraph-lg text-text-sub-600 max-w-xl">
          Stats Riot, leaderboards, mini-jeux et économie shrooms — tout depuis
          ton serveur Discord.
        </p>
      </div>
      <a
        href={BOT_INVITE_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-10 items-center gap-3 rounded-10 bg-[#5865F2] px-3.5 text-label-sm text-white transition-colors hover:bg-[#4752C4]"
      >
        <RiDiscordFill className="size-5" />
        Ajouter à Discord
        <RiArrowRightLine className="size-5" />
      </a>
    </div>
  </section>
);

export default CTASection;
