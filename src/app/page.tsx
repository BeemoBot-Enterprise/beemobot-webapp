"use client";

import { EpicHeroSection } from "@/components/organisms/EpicHeroSection";
import { FeatureShowcase } from "@/components/organisms/FeatureShowcase";
import { StatsSection } from "@/components/organisms/StatsSection";
import { MinigamesPreview } from "@/components/organisms/MinigamesPreview";
import { CTASection } from "@/components/organisms/CTASection";

export default function Home() {
  return (
    <main className="overflow-hidden -mt-20">
      <EpicHeroSection />
      <StatsSection />
      <FeatureShowcase />
      <MinigamesPreview />
      <CTASection />
    </main>
  );
}
