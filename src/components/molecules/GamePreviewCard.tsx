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
      glow: "shadow-blue-500/20",
      bgHover: "hover:bg-blue-500/10",
      text: "text-blue-400",
      gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
      border: "border-blue-500/20",
    },
    gold: {
      glow: "shadow-yellow-500/20",
      bgHover: "hover:bg-yellow-500/10",
      text: "text-yellow-400",
      gradient: "from-yellow-500/20 via-yellow-500/5 to-transparent",
      border: "border-yellow-500/20",
    },
    honey: {
      glow: "shadow-orange-500/20",
      bgHover: "hover:bg-orange-500/10",
      text: "text-orange-400",
      gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
      border: "border-orange-500/20",
    },
    cyan: {
      glow: "shadow-cyan-500/20",
      bgHover: "hover:bg-cyan-500/10",
      text: "text-cyan-400",
      gradient: "from-cyan-500/20 via-cyan-500/5 to-transparent",
      border: "border-cyan-500/20",
    },
    purple: {
      glow: "shadow-purple-500/20",
      bgHover: "hover:bg-purple-500/10",
      text: "text-purple-400",
      gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
      border: "border-purple-500/20",
    },
  };

  const styles = colorStyles[color];

  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -4, scale: 1.01 }}
        className={cn(
          "group relative p-6 h-full rounded-2xl overflow-hidden cursor-pointer",
          "bg-[#13151c]/80 backdrop-blur-sm border border-white/5",
          "shadow-lg transition-all duration-300 ease-out",
          "hover:shadow-xl",
          `hover:border-opacity-50 ${styles.border}`,
          className,
        )}
      >
        {/* Subtle Gradient Background */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-70 transition-opacity duration-300",
            styles.gradient,
          )}
        />

        {/* Top Highlight Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header with Icon */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={cn(
                "p-3 rounded-xl bg-white/5 backdrop-blur-sm ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-200",
                `group-hover:bg-${color}-500/10`, // Dynamic background tint on hover if feasible, or relying on parent gradient
              )}
            >
              <span className="text-3xl filter drop-shadow-lg transform group-hover:scale-105 transition-transform duration-200 block">
                {icon}
              </span>
            </div>

            {/* Arrow icon that appears on hover */}
            <div
              className={cn(
                "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200",
                styles.text,
              )}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3
            className={cn(
              "text-xl font-bold mb-2 text-white transition-colors duration-200",
              `group-hover:${styles.text}`,
            )}
          >
            {title}
          </h3>

          {/* Description */}
          <p className="text-slate-400 text-sm leading-relaxed mb-4 group-hover:text-slate-300 transition-colors duration-200 flex-grow">
            {description}
          </p>

          {/* Bottom decorative bar */}
          <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
            <div
              className={cn(
                "h-full w-0 group-hover:w-full transition-all duration-500 ease-out",
                `bg-${color}-500`, // Fallback
                color === "blue" && "bg-blue-500",
                color === "gold" && "bg-yellow-500",
                color === "honey" && "bg-orange-500",
                color === "cyan" && "bg-cyan-500",
                color === "purple" && "bg-purple-500",
              )}
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
