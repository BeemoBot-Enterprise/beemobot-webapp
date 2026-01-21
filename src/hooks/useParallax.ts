"use client";

import { useEffect, useState } from "react";

interface ParallaxValues {
  x: number;
  y: number;
  scrollY: number;
}

export function useParallax(speed: number = 0.5): ParallaxValues {
  const [values, setValues] = useState<ParallaxValues>({
    x: 0,
    y: 0,
    scrollY: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate position relative to center (-1 to 1)
      const x = ((clientX / innerWidth) - 0.5) * 2 * speed * 50;
      const y = ((clientY / innerHeight) - 0.5) * 2 * speed * 50;

      setValues((prev) => ({ ...prev, x, y }));
    };

    const handleScroll = () => {
      const scrollY = window.scrollY * speed;
      setValues((prev) => ({ ...prev, scrollY }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [speed]);

  return values;
}
