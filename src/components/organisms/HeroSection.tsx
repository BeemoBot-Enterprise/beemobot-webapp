/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import Image from "next/image";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import Button from "@/components/atoms/Button";
import { BEEMO } from "@/assets/images";
import { BOT_INVITE_URL } from "@/lib/env";

const HeroSection = () => (
  <section className="border-b border-border">
    <div className="max-w-[1200px] mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-text mb-5">
          Le bot Discord pour ta communauté{" "}
          <span className="text-accent">League of Legends</span>.
        </h1>
        <p className="text-lg text-text-muted leading-relaxed mb-8 max-w-xl">
          Stats de joueurs, profils détaillés, leaderboards et mini-jeux —
          directement depuis ton serveur Discord.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href={BOT_INVITE_URL} target="_blank" rel="noreferrer">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <FaDiscord className="h-5 w-5" />
              Ajouter à Discord
            </Button>
          </a>
          <Link href="#features">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Voir les fonctionnalités
            </Button>
          </Link>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="aspect-square relative rounded-lg border border-border bg-surface overflow-hidden">
          <Image
            src={BEEMO.mascot}
            alt="BeemoBot mascot"
            fill
            className="object-contain p-12"
            priority
          />
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
