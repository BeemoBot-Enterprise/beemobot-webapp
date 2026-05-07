/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
"use client";
import Link from "next/link";
import * as React from "react";
import { RiDiscordFill } from "@remixicon/react";
import { Button } from "./Button";
import { cn } from "@/lib/design/cn";

const NAV = [
  { label: "Fonctionnalités", href: "/#features" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Mini-jeux", href: "/game" },
  { label: "Documentation", href: "/documentation" },
];

export function HeaderHF({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 backdrop-blur-md bg-hf-bg/85 border-b border-hf-line",
        className,
      )}
    >
      <div className="mx-auto max-w-[1100px] px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-hf-navy">
          <BeeMark />
          <span className="text-hf-body-lg tracking-tight">Beemobot</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-hf-body-sm font-medium text-hf-navy-soft hover:text-hf-honey transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="hidden sm:inline-block text-hf-body-sm font-medium text-hf-navy-soft hover:text-hf-navy transition-colors"
          >
            Mon profil
          </Link>
          <Button size="sm" variant="primary">
            <RiDiscordFill className="size-4" />
            Ajouter
          </Button>
        </div>
      </div>
    </header>
  );
}

function BeeMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="14" fill="var(--hf-honey)" />
      <ellipse cx="16" cy="16" rx="14" ry="4" fill="var(--hf-navy)" />
    </svg>
  );
}
