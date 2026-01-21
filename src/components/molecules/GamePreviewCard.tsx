"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface GamePreviewCardProps {
  title: string;
  description: string;
  icon: string;
  color: "blue" | "gold" | "honey" | "cyan" | "purple";
  href: string;
  className?: string;
  index?: number;
}

export function GamePreviewCard({
  title,
  description,
  icon,
  color,
  href,
  className,
  index = 0,
}: GamePreviewCardProps) {
  const colorStyles = {
    blue: {
      border: "border-blue-500/50",
      glow: "shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]",
      bg: "from-blue-500/10 to-transparent",
      text: "text-blue-400",
    },
    gold: {
      border: "border-yellow-500/50",
      glow: "shadow-[0_0_20px_-5px_rgba(234,179,8,0.5)]",
      bg: "from-yellow-500/10 to-transparent",
      text: "text-yellow-400",
    },
    honey: {
      border: "border-orange-500/50",
      glow: "shadow-[0_0_20px_-5px_rgba(249,115,22,0.5)]",
      bg: "from-orange-500/10 to-transparent",
      text: "text-orange-400",
    },
    cyan: {
      border: "border-cyan-500/50",
      glow: "shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]",
      bg: "from-cyan-500/10 to-transparent",
      text: "text-cyan-400",
    },
    purple: {
      border: "border-purple-500/50",
      glow: "shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)]",
      bg: "from-purple-500/10 to-transparent",
      text: "text-purple-400",
    },
  };

  const styles = colorStyles[color];

  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        className={cn(
          "group relative p-6 rounded-xl overflow-hidden cursor-pointer",
          "bg-[#0a0a0f]/60 backdrop-blur-md border border-white/5",
          `hover:${styles.border}`,
          `hover:${styles.glow}`,
          "transition-all duration-300",
          className
        )}
      >
        {/* Background gradient */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            styles.bg
          )}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-md">
            {icon}
          </div>

          {/* Title */}
          <h3
            className={cn(
              "text-lg font-bold mb-2 transition-colors duration-300 text-white",
              `group-hover:${styles.text}`
            )}
          >
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
            {description}
          </p>

          {/* Play button */}
          <div
            className={cn(
              "mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider",
              styles.text,
              "opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
            )}
          >
            Play Now
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>

        {/* Hextech corner decorations - simplified */}
        <div
          className={cn(
            "absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-all duration-300",
            styles.border
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-lg opacity-0 group-hover:opacity-100 transition-all duration-300",
            styles.border
          )}
        />
      </motion.div>
    </Link>
  );
}
