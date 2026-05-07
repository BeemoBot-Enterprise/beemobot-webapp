/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/design/cn";

const eyebrowVariants = cva(
  "inline-block font-body uppercase font-bold tracking-[0.15em] text-hf-eyebrow",
  {
    variants: {
      tone: {
        honey: "text-hf-honey-text",
        navy: "text-hf-navy-soft",
      },
    },
    defaultVariants: { tone: "honey" },
  },
);

export interface EyebrowProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof eyebrowVariants> {}

export const Eyebrow = React.forwardRef<HTMLParagraphElement, EyebrowProps>(
  ({ className, tone, children, ...props }, ref) => (
    <p ref={ref} className={cn(eyebrowVariants({ tone }), className)} {...props}>
      {children}
    </p>
  ),
);
Eyebrow.displayName = "Eyebrow";
