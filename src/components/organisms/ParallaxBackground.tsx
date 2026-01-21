"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { GlowOrb } from "@/components/atoms/GlowOrb";
import Image from "next/image";
import { BACKGROUNDS } from "@/assets/images";

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
  const bgScale = useTransform(scrollY, [0, 1000], [1, 1.1]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 20,
        y: (clientY / innerHeight - 0.5) * 20,
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
      {/* Base Background Image */}
      <motion.div 
        style={{ 
          scale: bgScale,
          x: mousePosition.x * 0.5,
          y: mousePosition.y * 0.5
        }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={BACKGROUNDS.bg1}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Light overlay for text readability only, not to hide the image */}
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Honeycomb pattern - Reduced opacity to not block image */}
      <motion.div
        style={{ y: y3, opacity }}
        className="absolute inset-0 honeycomb-bg animate-honeycomb-pulse opacity-10"
      />

      {/* Glowing orbs - Reduced opacity */}
      <motion.div
        style={{
          y: y1,
          x: mousePosition.x * 2,
        }}
        className="absolute -top-20 -left-20 opacity-20"
      >
        <GlowOrb variant="blue" size="xl" />
      </motion.div>

      <motion.div
        style={{
          y: y2,
          x: mousePosition.x * -1.5,
        }}
        className="absolute top-1/4 -right-32 opacity-20"
      >
        <GlowOrb variant="honey" size="lg" />
      </motion.div>

      {/* Radial vignette for focus */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/80" />
    </div>
  );
}
