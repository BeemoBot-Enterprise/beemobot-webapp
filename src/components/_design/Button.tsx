/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/design/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-body font-bold transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hf-honey focus-visible:ring-offset-2 focus-visible:ring-offset-hf-bg disabled:opacity-50 disabled:pointer-events-none active:translate-y-0",
  {
    variants: {
      variant: {
        primary:
          "bg-hf-discord text-white shadow-hf-btn-primary hover:-translate-y-px",
        outline:
          "bg-hf-surface text-hf-navy border-[1.5px] border-hf-navy hover:-translate-y-px",
        ghost:
          "bg-transparent text-hf-navy hover:bg-hf-honey-glow",
        danger:
          "bg-hf-loss text-white hover:-translate-y-px",
      },
      size: {
        sm: "h-9 px-3 text-hf-body-sm rounded-hf-btn",
        md: "h-11 px-5 text-hf-body rounded-hf-btn",
        lg: "h-12 px-6 text-hf-body-lg rounded-hf-btn",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
