/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";
import type { IconType } from "react-icons";

type AuthCardProps = {
  icon: IconType;
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export const AuthCard = ({
  icon: Icon,
  title,
  subtitle,
  children,
  className,
}: AuthCardProps) => (
  <div
    className={twMerge(
      "flex w-full max-w-[440px] flex-col gap-6 rounded-20 border border-stroke-soft-200 bg-bg-weak-50 p-6 md:p-8",
      className,
    )}
  >
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex size-[68px] shrink-0 items-center justify-center rounded-full md:size-24 before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-primary-alpha-24 before:to-transparent">
        <div className="relative z-10 flex size-12 items-center justify-center rounded-full border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs md:size-16">
          <Icon className="size-6 text-text-strong-950 md:size-7" />
        </div>
      </div>
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-title-h6 md:text-title-h5 text-text-strong-950">
          {title}
        </h1>
        <p className="text-paragraph-sm md:text-paragraph-md text-text-sub-600">
          {subtitle}
        </p>
      </div>
    </div>

    <div className="h-px bg-stroke-soft-200" />

    {children}
  </div>
);

export default AuthCard;
