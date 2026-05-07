/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { cn } from "@/lib/design/cn";

export interface StatNumberProps {
  value: string | number;
  unit?: string;
  label: string;
  tone?: "default" | "win" | "loss";
  className?: string;
}

export function StatNumber({ value, unit, label, tone = "default", className }: StatNumberProps) {
  const toneClass =
    tone === "win" ? "text-hf-win" : tone === "loss" ? "text-hf-loss" : "text-hf-navy";
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className={cn("font-display text-hf-display-2 tabular-nums", toneClass)}>
        {value}
        {unit ? <span className="text-hf-honey-text">{unit}</span> : null}
      </div>
      <div className="text-hf-body-sm text-hf-navy-soft font-medium">{label}</div>
    </div>
  );
}
