"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { StatCounter } from "@/components/atoms/StatCounter";
import { DiamondBadge } from "@/components/atoms/DiamondBadge";

interface StatCardProps {
  value: number;
  suffix?: string;
  label: string;
  icon: React.ReactNode;
  variant?: "blue" | "gold" | "honey";
  className?: string;
  index?: number;
}

export function StatCard({
  value,
  suffix = "",
  label,
  icon,
  variant = "blue",
  className,
  index = 0,
}: StatCardProps) {
  const colorStyles = {
    blue: {
      text: "text-blue-400",
      glow: "shadow-blue-500/20",
      border: "group-hover:border-blue-500/30",
      bg: "group-hover:bg-blue-500/5",
    },
    gold: {
      text: "text-yellow-400",
      glow: "shadow-yellow-500/20",
      border: "group-hover:border-yellow-500/30",
      bg: "group-hover:bg-yellow-500/5",
    },
    honey: {
      text: "text-orange-400",
      glow: "shadow-orange-500/20",
      border: "group-hover:border-orange-500/30",
      bg: "group-hover:bg-orange-500/5",
    },
  };

  const styles = colorStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "group relative flex flex-col items-center p-8 pt-12 rounded-2xl",
        "bg-[#13151c]/80 backdrop-blur-sm border border-white/5",
        "transition-all duration-300 ease-out hover:transform hover:-translate-y-1",
        "hover:shadow-lg",
        styles.border,
        styles.bg,
        className,
      )}
    >
      {/* Floating Badge */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 drop-shadow-lg z-10 transition-transform duration-200 group-hover:scale-105">
        <DiamondBadge variant={variant} size="lg">
          <span className="text-2xl filter drop-shadow-md">{icon}</span>
        </DiamondBadge>
      </div>

      {/* Value */}
      <div
        className={cn(
          "text-4xl md:text-5xl font-bold mb-3 tracking-tight mt-4",
          styles.text,
        )}
      >
        <StatCounter end={value} suffix={suffix} className="drop-shadow-sm" />
      </div>

      {/* Label */}
      <p className="text-slate-400 text-sm font-medium uppercase tracking-widest group-hover:text-slate-200 transition-colors">
        {label}
      </p>

      {/* Background Decor */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none",
          "bg-gradient-to-b from-transparent to-white/5",
        )}
      />
    </motion.div>
  );
}
