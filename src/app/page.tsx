/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import HeroSection from "@/components/organisms/HeroSection";
import { StatsSection } from "@/components/organisms/StatsSection";
import { FeatureShowcase } from "@/components/organisms/FeatureShowcase";
import { MinigamesPreview } from "@/components/organisms/MinigamesPreview";
import { CTASection } from "@/components/organisms/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeatureShowcase />
      <MinigamesPreview />
      <CTASection />
    </>
  );
}
