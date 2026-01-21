"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HexButton } from "@/components/atoms/HexButton";
import { TypewriterText } from "@/components/atoms/TypewriterText";
import { ParticleCanvas } from "@/components/atoms/ParticleCanvas";
import { ParallaxBackground } from "./ParallaxBackground";
import { ScrollIndicator } from "@/components/molecules/ScrollIndicator";
import { BEEMO } from "@/assets/images";

export function EpicHeroSection() {
  const [typingComplete, setTypingComplete] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0f] to-black">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <ParallaxBackground />
      <ParticleCanvas particleCount={60} speed={0.3} color="#00A0FF" />

      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md mb-8 hover:bg-blue-500/20 transition-colors cursor-default"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              <span className="text-sm font-medium text-blue-200 tracking-wide">
                #1 League of Legends Discord Bot
              </span>
            </motion.div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
              <span className="block text-white mb-2">The Ultimate</span>
              <span className="bg-gradient-to-r from-[#00A0FF] via-[#00E5CC] to-[#00A0FF] bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                Teemo Companion
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Level up your Discord server with real-time stats, pro builds, and
              addictive minigames. Join the revolution of the Rift!
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
            >
              <HexButton
                variant="blue"
                size="lg"
                onClick={() =>
                  window.open(process.env.NEXT_PUBLIC_BOT_INVITE_URL, "_blank")
                }
                className="shadow-[0_0_30px_-5px_rgba(0,160,255,0.4)] hover:shadow-[0_0_40px_-5px_rgba(0,160,255,0.6)]"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                  </svg>
                  <span className="font-bold">Add to Discord</span>
                </div>
              </HexButton>

              <HexButton
                variant="gold"
                size="lg"
                onClick={() => (window.location.href = "/documentation")}
                className="bg-white/5 border-white/10 hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Documentation</span>
                </div>
              </HexButton>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10 flex items-center gap-6 justify-center lg:justify-start"
            >
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#0a0a0f] flex items-center justify-center text-xs text-slate-500"
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#0a0a0f] flex items-center justify-center text-[10px] font-bold text-white z-10">
                  +50k
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Trusted by <span className="text-white font-semibold">50,000+</span> servers worldwide
              </p>
            </motion.div>
          </motion.div>

          {/* Right side - 2D Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] lg:h-[600px] flex items-center justify-center"
          >
            {/* Glow effect behind mascot */}
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full transform translate-y-10" />
            
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full max-w-[500px]"
            >
              <Image
                src={BEEMO.mascot}
                alt="Beemo Bot Mascot"
                fill
                className="object-contain drop-shadow-[0_0_50px_rgba(0,160,255,0.2)]"
                priority
              />
            </motion.div>

            {/* Floating Cards */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1, y: [0, -10, 0] }}
              transition={{ 
                x: { delay: 0.8, duration: 0.5 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
              className="absolute top-20 -right-4 bg-slate-800/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl max-w-[180px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400">⚡</div>
                <div className="text-sm font-bold text-white">Fast Response</div>
              </div>
              <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "95%" }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="h-full bg-yellow-400 rounded-full"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1, y: [0, 10, 0] }}
              transition={{ 
                x: { delay: 1, duration: 0.5 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
              }}
              className="absolute bottom-32 -left-4 bg-slate-800/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                  99%
                </div>
                <div>
                  <div className="text-xs text-slate-400">Win Rate Prediction</div>
                  <div className="text-sm font-bold text-white">High Accuracy</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}
