"use client";

import { EpicHeroSection } from "@/components/organisms/EpicHeroSection";
import { FeatureShowcase } from "@/components/organisms/FeatureShowcase";
import { StatsSection } from "@/components/organisms/StatsSection";
import { MinigamesPreview } from "@/components/organisms/MinigamesPreview";
import { TestimonialsSection } from "@/components/organisms/TestimonialsSection";
import { CTASection } from "@/components/organisms/CTASection";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <EpicHeroSection />
      <StatsSection />
      <FeatureShowcase />
      <MinigamesPreview />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
