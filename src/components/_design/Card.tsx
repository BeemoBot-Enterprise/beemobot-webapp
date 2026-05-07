/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/design/cn";

const cardVariants = cva(
  "rounded-hf-card-lg border p-6",
  {
    variants: {
      variant: {
        default: "bg-hf-surface border-hf-line",
        accent:
          "border-hf-line text-hf-navy bg-hf-surface-alt relative overflow-hidden " +
          "before:content-[''] before:absolute before:right-[-60px] before:top-[-60px] " +
          "before:size-48 before:rounded-full before:bg-hf-honey-glow before:pointer-events-none",
        interactive:
          "bg-hf-surface border-hf-line transition-[transform,border-color,box-shadow] duration-150 " +
          "hover:-translate-y-[2px] hover:border-hf-honey hover:shadow-hf-card-hover cursor-pointer",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, children, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props}>
      <div className="relative">{children}</div>
    </div>
  ),
);
Card.displayName = "Card";
