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
  const borderColors = {
    blue: "border-blue-500",
    gold: "border-yellow-400",
    honey: "border-orange-400",
  };

  const textColors = {
    blue: "text-blue-400",
    gold: "text-yellow-400",
    honey: "text-orange-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "relative flex flex-col items-center p-8 rounded-xl",
        "bg-[#0a0a0f]/60 backdrop-blur-md border border-white/5",
        `border-b-4 ${borderColors[variant]}`,
        "hover:bg-[#0a0a0f]/80 hover:-translate-y-1 transition-all duration-300",
        "shadow-lg",
        className
      )}
    >
      {/* Diamond badge with icon */}
      <div className="mb-6 -mt-14 drop-shadow-lg">
        <DiamondBadge variant={variant} size="lg">
          <span className="text-2xl">{icon}</span>
        </DiamondBadge>
      </div>

      {/* Value with counter animation */}
      <div className={cn("text-4xl md:text-5xl font-bold mb-2 tracking-tight", textColors[variant])}>
        <StatCounter
          end={value}
          suffix={suffix}
          className="drop-shadow-sm"
        />
      </div>

      {/* Label */}
      <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">
        {label}
      </p>
    </motion.div>
  );
}
