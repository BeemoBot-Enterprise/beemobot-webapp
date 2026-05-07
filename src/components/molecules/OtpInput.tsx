/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";

type OtpInputProps = {
  numInputs?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  className?: string;
};

export const OtpInput = ({
  numInputs = 4,
  value,
  onChange,
  onComplete,
  className,
}: OtpInputProps) => {
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);
  const digits = React.useMemo(() => {
    const arr = value.split("").slice(0, numInputs);
    while (arr.length < numInputs) arr.push("");
    return arr;
  }, [value, numInputs]);

  const focus = (idx: number) => {
    const el = refs.current[idx];
    if (el) {
      el.focus();
      el.select();
    }
  };

  const setAt = (idx: number, char: string) => {
    const arr = digits.slice();
    arr[idx] = char;
    const next = arr.join("").slice(0, numInputs);
    onChange(next);
    if (next.length === numInputs && !next.includes("") && onComplete) {
      onComplete(next);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setAt(idx, "");
      return;
    }
    if (raw.length === 1) {
      setAt(idx, raw);
      if (idx < numInputs - 1) focus(idx + 1);
    } else {
      const arr = digits.slice();
      for (let i = 0; i < raw.length && idx + i < numInputs; i++) {
        arr[idx + i] = raw[i];
      }
      const next = arr.join("").slice(0, numInputs);
      onChange(next);
      const lastFilled = Math.min(idx + raw.length, numInputs) - 1;
      focus(Math.min(lastFilled + 1, numInputs - 1));
      if (next.length === numInputs && !next.includes("") && onComplete) {
        onComplete(next);
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number,
  ) => {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        setAt(idx, "");
      } else if (idx > 0) {
        focus(idx - 1);
        setAt(idx - 1, "");
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      focus(idx - 1);
    } else if (e.key === "ArrowRight" && idx < numInputs - 1) {
      e.preventDefault();
      focus(idx + 1);
    }
  };

  return (
    <div className={twMerge("flex items-center justify-center gap-3", className)}>
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            refs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onFocus={(e) => e.currentTarget.select()}
          className="size-14 rounded-md border border-border bg-bg text-center text-2xl font-semibold text-text tabular-nums transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 md:size-16"
        />
      ))}
    </div>
  );
};

export default OtpInput;
