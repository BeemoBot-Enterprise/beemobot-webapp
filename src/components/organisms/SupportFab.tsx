/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useState } from "react";
import { FaLifeRing } from "react-icons/fa";
import SupportDrawer from "@/components/organisms/SupportDrawer";

const SupportFab = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Ouvrir le support"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex h-10 items-center gap-2 rounded-full border border-stroke-soft-200 bg-bg-weak-50 px-4 text-label-sm text-text-strong-950 hover:bg-bg-soft-200 transition-colors"
      >
        <FaLifeRing className="size-3.5 text-text-soft-400" />
        <span className="hidden sm:inline">Support</span>
      </button>

      <SupportDrawer open={open} onOpenChange={setOpen} />
    </>
  );
};

export default SupportFab;
