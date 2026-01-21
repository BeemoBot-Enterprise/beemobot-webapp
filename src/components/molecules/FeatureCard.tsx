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
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className={cn(
        "group relative p-8 rounded-xl transition-all duration-300",
        "bg-[#0a0a0f]/60 backdrop-blur-md border border-white/5",
        "hover:border-blue-500/50 hover:bg-[#0a0a0f]/80",
        "shadow-[0_0_20px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_-5px_rgba(0,160,255,0.2)]",
        className
      )}
    >
      {/* Hextech corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/30 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:w-4 group-hover:h-4" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/30 rounded-br-xl opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:w-4 group-hover:h-4" />

      {/* Icon */}
      <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
        <HexagonFrame variant={variant} size="md" glow>
          <span className="text-3xl">{icon}</span>
        </HexagonFrame>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
        {description}
      </p>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 -z-10" />
    </motion.div>
  );
}
