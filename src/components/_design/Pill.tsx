/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/design/cn";

const pillVariants = cva(
  "inline-flex items-center gap-2 rounded-hf-pill px-3 py-1 font-body text-hf-body-sm font-semibold",
  {
    variants: {
      variant: {
        default: "bg-hf-surface border border-hf-line text-hf-navy-soft",
        live: "bg-hf-surface border border-hf-line text-hf-navy-soft",
        honey: "bg-hf-honey-glow text-hf-honey-text border border-transparent",
        riot: "bg-hf-navy text-white border border-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface PillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {}

export const Pill = React.forwardRef<HTMLSpanElement, PillProps>(
  ({ className, variant, children, ...props }, ref) => (
    <span ref={ref} className={cn(pillVariants({ variant }), className)} {...props}>
      {variant === "live" ? <LiveDot /> : null}
      {children}
    </span>
  ),
);
Pill.displayName = "Pill";

function LiveDot() {
  return (
    <span
      aria-hidden
      className="inline-block size-[7px] rounded-full bg-hf-win shadow-[0_0_0_3px_rgba(16,185,129,0.18)]"
    />
  );
}
