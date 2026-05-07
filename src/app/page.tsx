/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import {
  HeroLanding,
  StatsLanding,
  FeaturesLanding,
  IntegrationsLanding,
  LeaderboardTeaserLanding,
  FaqLanding,
  CtaLanding,
} from "@/components/_design/landing";

export default function HomePage() {
  return (
    <>
      <HeroLanding />
      <StatsLanding />
      <FeaturesLanding />
      <IntegrationsLanding />
      <LeaderboardTeaserLanding />
      <FaqLanding />
      <CtaLanding />
    </>
  );
}
