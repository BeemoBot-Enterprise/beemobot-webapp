/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { RiSunLine, RiMoonLine, RiComputerLine } from "@remixicon/react";
import { cn } from "@/lib/design/cn";

type ThemeMode = "light" | "dark" | "system";

const NEXT_MODE: Record<ThemeMode, ThemeMode> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const LABELS: Record<ThemeMode, string> = {
  light: "Activer le thème sombre",
  dark: "Suivre la préférence système",
  system: "Activer le thème clair",
};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Évite un hydration mismatch : tant que le client n'a pas hydraté, on rend
  // une icône neutre (Monitor) car on ignore la préférence système côté SSR.
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const current = (mounted ? (theme as ThemeMode | undefined) : undefined) ?? "system";

  const onClick = () => {
    setTheme(NEXT_MODE[current]);
  };

  const Icon = current === "light" ? RiSunLine : current === "dark" ? RiMoonLine : RiComputerLine;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={LABELS[current]}
      title={LABELS[current]}
      className={cn(
        "flex items-center justify-center size-10 rounded-hf-btn border border-hf-line bg-hf-surface text-hf-navy hover:border-hf-honey hover:text-hf-honey-text transition-colors",
        className,
      )}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
