"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  serverName: string;
  avatar?: string;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  role,
  serverName,
  avatar,
  className,
}: TestimonialCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "relative flex flex-col p-6 rounded-xl glass min-w-[300px] max-w-[400px]",
        "border border-transparent hover:border-[var(--hextech-blue)]/30",
        "transition-all duration-300",
        className
      )}
    >
      {/* Quote icon */}
      <div className="absolute -top-3 left-6 text-4xl text-[var(--hextech-blue)] opacity-50">
        &ldquo;
      </div>

      {/* Quote text */}
      <p className="text-muted-foreground mb-6 pt-4 italic leading-relaxed">
        {quote}
      </p>

      {/* Author info */}
      <div className="flex items-center gap-3 mt-auto">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[var(--hextech-blue)] to-[var(--rune-purple)]">
          {avatar ? (
            <img
              src={avatar}
              alt={author}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg font-bold">
              {author.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name and role */}
        <div>
          <p className="font-semibold text-white">{author}</p>
          <p className="text-sm text-muted-foreground">
            {role} • <span className="text-[var(--hextech-gold)]">{serverName}</span>
          </p>
        </div>
      </div>

      {/* Decorative corner */}
      <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--hextech-blue)]/20 rounded-br-xl" />
      </div>
    </motion.div>
  );
}
