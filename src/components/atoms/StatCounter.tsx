import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface StatCounterProps {
  value: number | string;
  label: string;
  className?: string;
}

const StatCounter = ({ value, label, className }: StatCounterProps) => (
  <div className={twMerge("flex flex-col items-center gap-1", className)}>
    <span className="text-3xl font-semibold text-text">{value}</span>
    <span className="text-sm text-text-muted">{label}</span>
  </div>
);

export default StatCounter;
