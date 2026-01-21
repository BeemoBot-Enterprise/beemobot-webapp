"use client";

import React from "react";
import { motion } from "framer-motion";
import { HexButton } from "@/components/atoms/HexButton";
import { GlowOrb } from "@/components/atoms/GlowOrb";
import { FaDiscord } from "react-icons/fa";

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
            Ready to <span className="gradient-text-hextech">Climb</span>?
          </h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Join 50,000+ Discord servers using BeemoBot. Add the ultimate League
            of Legends companion to your server today!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <HexButton
              variant="blue"
              size="lg"
              onClick={() =>
                window.open(
                  process.env.NEXT_PUBLIC_BOT_INVITE_URL ||
                    process.env.BOT_INVITE_URL,
                  "_blank",
                )
              }
            >
              <FaDiscord className="w-5 h-5" />
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
                  Welcome to the hive! 🍯 Type{" "}
                  <code className="px-1 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--hextech-blue)]">
                    /help
                  </code>{" "}
                  to see all my commands!
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
