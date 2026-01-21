"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlowOrb } from "@/components/atoms/GlowOrb";

interface ParallaxBackgroundProps {
  className?: string;
}

export function ParallaxBackground({ className }: ParallaxBackgroundProps) {
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax transforms based on scroll
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -50]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 30,
        y: (clientY / innerHeight - 0.5) * 30,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 overflow-hidden pointer-events-none z-0",
        className
      )}
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-void)] via-[var(--bg-deep)] to-[var(--bg-surface)]" />

      {/* Honeycomb pattern */}
      <motion.div
        style={{ y: y3, opacity }}
        className="absolute inset-0 honeycomb-bg animate-honeycomb-pulse"
      />

      {/* Glowing orbs with parallax */}
      <motion.div
        style={{
          y: y1,
          x: mousePosition.x * 2,
        }}
        className="absolute -top-20 -left-20"
      >
        <GlowOrb variant="blue" size="xl" />
      </motion.div>

      <motion.div
        style={{
          y: y2,
          x: mousePosition.x * -1.5,
        }}
        className="absolute top-1/4 -right-32"
      >
        <GlowOrb variant="honey" size="lg" />
      </motion.div>

      <motion.div
        style={{
          y: y1,
          x: mousePosition.x,
        }}
        className="absolute top-2/3 -left-16"
      >
        <GlowOrb variant="gold" size="md" />
      </motion.div>

      <motion.div
        style={{
          y: y3,
          x: mousePosition.x * -1,
        }}
        className="absolute bottom-1/4 right-1/4"
      >
        <GlowOrb variant="purple" size="sm" />
      </motion.div>

      <motion.div
        style={{
          y: y2,
          x: mousePosition.x * 0.5,
        }}
        className="absolute bottom-0 left-1/3"
      >
        <GlowOrb variant="cyan" size="md" />
      </motion.div>

      {/* Hextech grid lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hexGrid"
            width="50"
            height="43.4"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(2)"
          >
            <path
              d="M25 0 L50 14.4 L50 38.4 L25 52.8 L0 38.4 L0 14.4 Z"
              fill="none"
              stroke="var(--hextech-blue)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexGrid)" />
      </svg>

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[var(--bg-void)] opacity-60" />
    </div>
  );
}
