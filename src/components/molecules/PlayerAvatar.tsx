/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import Image from "next/image";
import { twMerge } from "tailwind-merge";

type Size = "sm" | "md" | "lg";

const SIZE_PX: Record<Size, { box: number; text: string }> = {
  sm: { box: 28, text: "text-[10px]" },
  md: { box: 36, text: "text-xs" },
  lg: { box: 48, text: "text-sm" },
};

const GRADIENTS = [
  "from-blue-500 to-indigo-700",
  "from-amber-500 to-rose-600",
  "from-emerald-400 to-teal-700",
  "from-fuchsia-500 to-purple-700",
  "from-cyan-400 to-blue-700",
  "from-orange-500 to-red-700",
  "from-violet-500 to-pink-600",
];

function pickGradient(seed: string | null | undefined) {
  if (!seed) return GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

type Props = {
  avatarUrl?: string | null;
  username?: string | null;
  fallbackKey?: string | null;
  size?: Size;
  className?: string;
};

export const PlayerAvatar = ({
  avatarUrl,
  username,
  fallbackKey,
  size = "md",
  className,
}: Props) => {
  const { box, text } = SIZE_PX[size];
  const initial = (username?.[0] ?? "?").toUpperCase();
  const gradient = pickGradient(fallbackKey ?? username ?? "?");

  return (
    <div
      className={twMerge(
        "shrink-0 rounded-full overflow-hidden ring-1 ring-stroke-soft-200 flex items-center justify-center",
        className,
      )}
      style={{ width: box, height: box }}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={username ?? ""}
          width={box}
          height={box}
          className="size-full object-cover"
        />
      ) : (
        <div
          className={twMerge(
            "size-full flex items-center justify-center bg-gradient-to-br font-semibold text-white/95 select-none",
            gradient,
            text,
          )}
        >
          {initial}
        </div>
      )}
    </div>
  );
};

export default PlayerAvatar;
