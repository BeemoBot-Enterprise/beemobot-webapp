"use client";

import { useEffect, useState, useRef } from "react";

interface UseCountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  delay?: number;
  easing?: "linear" | "easeOut" | "easeIn" | "easeInOut";
}

export function useCountUp({
  start = 0,
  end,
  duration = 2000,
  delay = 0,
  easing = "easeOut",
}: UseCountUpOptions): number {
  const [count, setCount] = useState(start);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const easingFunctions = {
    linear: (t: number) => t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
    easeIn: (t: number) => Math.pow(t, 3),
    easeInOut: (t: number) =>
      t < 0.5 ? 4 * Math.pow(t, 3) : 1 - Math.pow(-2 * t + 2, 3) / 2,
  };

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFunctions[easing](progress);
        const currentValue = start + (end - start) * easedProgress;

        setCount(Math.floor(currentValue));

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [start, end, duration, delay, easing]);

  return count;
}
