"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BeeIcon } from "@/components/atoms/BeeIcon";

interface ScrollIndicatorProps {
  className?: string;
}

export function ScrollIndicator({ className }: ScrollIndicatorProps) {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <motion.button
      onClick={scrollToContent}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className={cn(
        "absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group",
        className
      )}
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        <BeeIcon size={32} animate />

        <motion.div
          className="w-6 h-10 rounded-full border-2 border-[var(--hextech-blue)] flex justify-center mt-2"
          whileHover={{ borderColor: "var(--hextech-gold)" }}
        >
          <motion.div
            className="w-1.5 h-3 bg-[var(--hextech-blue)] rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      <span className="text-sm text-muted-foreground group-hover:text-[var(--hextech-gold)] transition-colors">
        Scroll to explore
      </span>
    </motion.button>
  );
}
