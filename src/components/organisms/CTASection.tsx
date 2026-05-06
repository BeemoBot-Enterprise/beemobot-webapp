"use client";

import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import { FaDiscord } from "react-icons/fa";
import { BOT_INVITE_URL } from "@/lib/env";

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with radial glow */}
      <div className="absolute inset-0 bg-[var(--bg-void)]" />

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
              Gratuit pour toujours
            </span>
          </motion.div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Prêt à <span className="gradient-text-hextech">Grimper</span> ?
          </h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            Rejoignez plus de 50 000 serveurs Discord utilisant BeemoBot. Ajoutez le compagnon League of Legends ultime à votre serveur dès aujourd'hui !
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.open(BOT_INVITE_URL, "_blank")}
            >
              <FaDiscord className="w-5 h-5" />
              Ajouter à Discord
            </Button>

            <Button
              variant="secondary"
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
              Essayer les Mini-jeux
            </Button>
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
                  Bienvenue dans la ruche ! 🍯 Tapez{" "}
                  <code className="px-1 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--hextech-blue)]">
                    /help
                  </code>{" "}
                  pour voir toutes mes commandes !
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
