/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import { FaDiscord } from "react-icons/fa";
import Button from "@/components/atoms/Button";
import { BOT_INVITE_URL } from "@/lib/env";

export const CTASection = () => (
  <section>
    <div className="max-w-[1200px] mx-auto px-6 py-20">
      <div className="rounded-lg border border-border bg-surface p-12 text-center">
        <h2 className="text-3xl font-semibold text-text mb-3">
          Prêt à animer ta communauté ?
        </h2>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          Invite BeemoBot sur ton serveur Discord en moins de deux minutes.
        </p>
        <a href={BOT_INVITE_URL} target="_blank" rel="noreferrer">
          <Button variant="primary" size="lg">
            <FaDiscord className="h-5 w-5" />
            Ajouter à Discord
          </Button>
        </a>
      </div>
    </div>
  </section>
);
