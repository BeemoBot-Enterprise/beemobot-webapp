"use client";

import React from "react";
import { motion } from "framer-motion";
import { HexButton } from "@/components/atoms/HexButton";
import { GlowOrb } from "@/components/atoms/GlowOrb";

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with radial glow */}
      <div className="absolute inset-0 bg-[var(--bg-void)]" />

      {/* Glow orbs */}
      <GlowOrb
        variant="blue"
        size="xl"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      <GlowOrb
        variant="gold"
        size="lg"
        className="absolute top-1/4 right-1/4"
      />
      <GlowOrb
        variant="honey"
        size="md"
        className="absolute bottom-1/4 left-1/4"
      />

      {/* Honeycomb pattern */}
      <div className="absolute inset-0 honeycomb-bg opacity-10" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-hextech mb-6"
          >
            <span className="text-lg">🐝</span>
            <span className="text-sm text-[var(--hextech-gold)]">
              Free Forever
            </span>
          </motion.div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to{" "}
            <span className="gradient-text-hextech">Climb</span>?
          </h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Join 50,000+ Discord servers using BeemoBot. Add the ultimate
            League of Legends companion to your server today!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <HexButton
              variant="blue"
              size="lg"
              onClick={() =>
                window.open(process.env.NEXT_PUBLIC_BOT_INVITE_URL, "_blank")
              }
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Add to Discord
            </HexButton>

            <HexButton
              variant="gold"
              size="lg"
              onClick={() => (window.location.href = "/game")}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Try Minigames
            </HexButton>
          </div>

          {/* Discord embed preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="glass rounded-lg p-4 max-w-md mx-auto text-left"
          >
            <div className="flex items-start gap-3">
              {/* Bot avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--beemo-honey)] to-[var(--hextech-gold)] flex items-center justify-center text-lg">
                🐝
              </div>

              {/* Message */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[var(--hextech-gold)]">
                    BeemoBot
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-xs bg-[var(--hextech-blue)] text-white">
                    BOT
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Welcome to the hive! 🍯 Type <code className="px-1 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--hextech-blue)]">/help</code> to see all my commands!
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
