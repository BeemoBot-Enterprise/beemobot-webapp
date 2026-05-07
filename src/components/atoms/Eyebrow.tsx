/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import * as React from "react";
import { twMerge } from "tailwind-merge";

type Tone = "neutral" | "live" | "primary" | "warning" | "success";

const TONE_DOT: Record<Tone, string> = {
  neutral: "",
  live: "bg-emerald-500",
  primary: "bg-primary-base",
  warning: "bg-warning-base",
  success: "bg-success-base",
};

type Props = {
  children: React.ReactNode;
  tone?: Tone;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
};

/**
 * Polished section eyebrow — small uppercase chip with subtle border + bg.
 * Use above section headings for consistent typographic rhythm.
 */
export const Eyebrow = ({
  children,
  tone = "neutral",
  dot = false,
  pulse = false,
  className,
}: Props) => (
  <span
    className={twMerge(
      "inline-flex w-fit items-center gap-2 rounded-full border border-stroke-soft-200 bg-bg-weak-50/60 px-2.5 py-1 backdrop-blur-sm",
      "text-[11px] font-medium uppercase tracking-[0.12em] text-text-sub-600",
      className,
    )}
  >
    {dot && (
      <span className="relative flex size-1.5">
        {pulse && (
          <span
            className={twMerge(
              "absolute inline-flex size-full animate-ping rounded-full opacity-75",
              TONE_DOT[tone] || "bg-primary-base",
            )}
          />
        )}
        <span
          className={twMerge(
            "relative inline-flex size-1.5 rounded-full",
            TONE_DOT[tone] || "bg-text-soft-400",
          )}
        />
      </span>
    )}
    {children}
  </span>
);

export default Eyebrow;
