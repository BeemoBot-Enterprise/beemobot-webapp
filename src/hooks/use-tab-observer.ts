"use client";

import * as React from "react";

type Args = {
  onActiveTabChange?: (index: number, element: HTMLElement) => void;
};

export function useTabObserver({ onActiveTabChange }: Args = {}) {
  const [mounted, setMounted] = React.useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);
  const callbackRef = React.useRef(onActiveTabChange);
  callbackRef.current = onActiveTabChange;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const findActive = () => {
      const triggers = Array.from(
        list.querySelectorAll<HTMLElement>('[role="tab"]'),
      );
      const idx = triggers.findIndex(
        (t) => t.getAttribute("data-state") === "active",
      );
      if (idx >= 0) {
        callbackRef.current?.(idx, triggers[idx]);
      }
    };

    findActive();

    const observer = new MutationObserver(findActive);
    observer.observe(list, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-state"],
    });

    return () => observer.disconnect();
  }, [mounted]);

  return { mounted, listRef };
}
