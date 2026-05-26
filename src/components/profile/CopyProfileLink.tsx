/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import * as React from "react";
import { RiLinkM, RiCheckLine } from "@remixicon/react";
import { cn } from "@/lib/design/cn";

interface Props {
  /** Riot ID au format `gameName-tagLine`. */
  riotId: string;
  className?: string;
}

export function CopyProfileLink({ riotId, className }: Props) {
  const [copied, setCopied] = React.useState(false);

  const onClick = async () => {
    // L'URL absolue est plus utile pour le partage qu'un chemin relatif :
    // on copie le href complet construit côté client.
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/profile/${encodeURIComponent(riotId)}`
        : `/profile/${encodeURIComponent(riotId)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback silencieux : pas de toast pour ne pas surprendre l'utilisateur.
      // Les navigateurs récents ont tous l'API Clipboard sur HTTPS.
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={copied ? "Lien copié" : "Copier le lien du profil"}
      title={copied ? "Lien copié" : "Copier le lien du profil"}
      className={cn(
        "inline-flex items-center gap-2 rounded-hf-btn border border-hf-line bg-hf-surface px-3 h-10 text-hf-body-sm font-semibold text-hf-navy hover:border-hf-honey transition-colors",
        copied && "border-hf-win text-hf-win",
        className,
      )}
    >
      {copied ? (
        <>
          <RiCheckLine className="size-4" aria-hidden />
          Copié
        </>
      ) : (
        <>
          <RiLinkM className="size-4" aria-hidden />
          Copier le lien
        </>
      )}
    </button>
  );
}
