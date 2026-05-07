/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import * as React from "react";
import { cn } from "@/lib/design/cn";
import { Eyebrow } from "./Eyebrow";

export interface SectionShellProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title: string;
  lead?: string;
  withHaloHoney?: boolean;
}

export function SectionShell({
  eyebrow,
  title,
  lead,
  withHaloHoney = false,
  className,
  children,
  ...props
}: SectionShellProps) {
  return (
    <section
      className={cn(
        "relative px-6 py-14 lg:py-20",
        withHaloHoney && "overflow-hidden",
        className,
      )}
      {...props}
    >
      {withHaloHoney && (
        <div
          aria-hidden
          className="absolute -right-32 -top-40 size-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--hf-honey-glow) 0%, transparent 65%)" }}
        />
      )}
      <div className="relative mx-auto max-w-[1100px]">
        <header className="mb-10 max-w-2xl">
          {eyebrow ? <Eyebrow className="mb-2">{eyebrow}</Eyebrow> : null}
          <h2 className="font-display text-hf-display-2 text-hf-navy">{title}</h2>
          {lead ? <p className="mt-3 text-hf-body-lg text-hf-navy-soft">{lead}</p> : null}
        </header>
        {children}
      </div>
    </section>
  );
}
