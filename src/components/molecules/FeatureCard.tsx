"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { HexagonFrame } from "@/components/atoms/HexagonFrame";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: "blue" | "gold" | "honey";
  className?: string;
  index?: number;
}

export function FeatureCard({
  icon,
  title,
  description,
  variant = "blue",
  className,
  index = 0,
}: FeatureCardProps) {
  const colorStyles = {
    blue: {
      borderHover: "hover:border-blue-500/30",
      shadowHover: "hover:shadow-lg",
      corner: "border-blue-500/20",
      titleHover: "group-hover:text-blue-400",
      glowFrom: "group-hover:from-blue-500/3",
      glowTo: "group-hover:to-cyan-500/3",
    },
    gold: {
      borderHover: "hover:border-yellow-500/30",
      shadowHover: "hover:shadow-lg",
      corner: "border-yellow-500/20",
      titleHover: "group-hover:text-yellow-400",
      glowFrom: "group-hover:from-yellow-500/3",
      glowTo: "group-hover:to-orange-500/3",
    },
    honey: {
      borderHover: "hover:border-orange-500/30",
      shadowHover: "hover:shadow-lg",
      corner: "border-orange-500/20",
      titleHover: "group-hover:text-orange-400",
      glowFrom: "group-hover:from-orange-500/3",
      glowTo: "group-hover:to-amber-500/3",
    },
  };

  const styles = colorStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      className={cn(
        "group relative p-8 rounded-xl transition-all duration-200",
        "bg-[#0a0a0f]/60 backdrop-blur-sm border border-white/5",
        styles.borderHover,
        "hover:bg-[#0a0a0f]/80",
        `shadow-md ${styles.shadowHover}`,
        className,
      )}
    >
      {/* Hextech corner accents */}
      <div
        className={cn(
          "absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:w-4 group-hover:h-4",
          styles.corner,
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-xl opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:w-4 group-hover:h-4",
          styles.corner,
        )}
      />

      {/* Icon */}
      <div className="mb-6 transform group-hover:scale-105 transition-transform duration-200">
        <HexagonFrame variant={variant} size="md" glow>
          <span className="text-3xl">{icon}</span>
        </HexagonFrame>
      </div>

      {/* Content */}
      <h3
        className={cn(
          "text-xl font-bold mb-3 text-white transition-colors",
          styles.titleHover,
        )}
      >
        {title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
        {description}
      </p>

      {/* Hover glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 transition-all duration-300 -z-10",
          styles.glowFrom,
          styles.glowTo,
        )}
      />
    </motion.div>
  );
}
