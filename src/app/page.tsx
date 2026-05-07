/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import HeroSection from "@/components/organisms/HeroSection";
import { StatsSection } from "@/components/organisms/StatsSection";
import { FeatureShowcase } from "@/components/organisms/FeatureShowcase";
import { IntegrationsSection } from "@/components/organisms/IntegrationsSection";
import LeaderboardTeaser from "@/components/organisms/LeaderboardTeaser";
import { TeamSection } from "@/components/organisms/TeamSection";
import { FaqSection } from "@/components/organisms/FaqSection";
import { CTASection } from "@/components/organisms/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeatureShowcase />
      <IntegrationsSection />
      <LeaderboardTeaser />
      <TeamSection />
      <CTASection />
      <FaqSection />
    </>
  );
}
