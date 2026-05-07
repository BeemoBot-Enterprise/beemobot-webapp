/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";
import {
  FaChevronRight,
  FaSearch,
  FaLock,
  FaShieldAlt,
  FaKey,
  FaIdCard,
  FaHistory,
  FaSync,
  FaGift,
  FaQuestionCircle,
  FaTimes,
} from "react-icons/fa";
import type { IconType } from "react-icons";
import Button from "@/components/atoms/Button";

type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "right" | "left";
};

const DashedDivider = () => (
  <div
    className="h-px w-full text-border"
    role="separator"
    style={{
      backgroundImage:
        "linear-gradient(90deg, currentColor 4px, transparent 4px)",
      backgroundSize: "8px 1px",
      backgroundRepeat: "repeat-x",
      backgroundPosition: "left center",
    }}
  />
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 px-5 py-3">
    <div className="h-px flex-1 bg-border" />
    <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
      {children}
    </span>
    <div className="h-px flex-1 bg-border" />
  </div>
);

const NumberedItem = ({
  num,
  label,
}: {
  num: number;
  label: string;
}) => (
  <div className="flex items-center gap-3">
    <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
      {num}
    </span>
    <span className="text-sm text-text">{label}</span>
  </div>
);

const SuggestionRow = ({
  icon: Icon,
  label,
}: {
  icon: IconType;
  label: string;
}) => (
  <div className="flex items-center gap-2.5">
    <Icon className="h-4 w-4 shrink-0 text-text-muted" />
    <span className="text-sm text-text truncate">{label}</span>
  </div>
);

const ActionRow = ({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
}: {
  icon: IconType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}) => (
  <div className="cursor-pointer rounded-md p-2 hover:bg-bg/50 transition-colors">
    <div className="flex items-center gap-3">
      <div
        className={twMerge(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          iconBg,
        )}
      >
        <Icon className={twMerge("h-4 w-4", iconColor)} />
      </div>
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <div className="text-sm font-medium text-text truncate">{title}</div>
        <div className="text-xs text-text-muted truncate">{description}</div>
      </div>
      <FaChevronRight className="h-3 w-3 shrink-0 text-text-muted" />
    </div>
  </div>
);

export const SupportDrawer = ({
  open,
  onOpenChange,
  side = "right",
}: DrawerProps) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  return (
    <div
      aria-hidden={!open}
      className={twMerge(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div
        onClick={() => onOpenChange(false)}
        className={twMerge(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        className={twMerge(
          "absolute inset-y-2 mx-2 flex w-[min(420px,calc(100%-16px))] flex-col rounded-2xl border border-border bg-surface shadow-2xl transition-transform duration-300 ease-out",
          side === "right" ? "right-0" : "left-0",
          open
            ? "translate-x-0"
            : side === "right"
              ? "translate-x-[calc(100%+16px)]"
              : "-translate-x-[calc(100%+16px)]",
        )}
      >
        <header className="flex items-start justify-between gap-4 px-5 pt-5 pb-4">
          <div className="flex flex-col gap-1">
            <span className="text-base font-semibold text-text">
              Support BeemoBot
            </span>
            <span className="text-xs text-text-muted">
              Réponses rapides &amp; statut du bot (24/7)
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Fermer"
            className="flex size-8 items-center justify-center rounded-md text-text-muted hover:bg-bg hover:text-text transition-colors"
          >
            <FaTimes className="h-3.5 w-3.5" />
          </button>
        </header>

        <div className="px-5 pb-4">
          <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-bg px-3 transition-colors focus-within:border-accent">
            <FaSearch className="h-3.5 w-3.5 shrink-0 text-text-muted" />
            <input
              placeholder="Rechercher dans l'aide…"
              className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted/70 focus:outline-none"
            />
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SectionLabel>Bot indisponible ?</SectionLabel>
          <div className="flex flex-col gap-3 px-5 py-2">
            <NumberedItem
              num={1}
              label="Le bot ne répond pas aux commandes"
            />
            <NumberedItem
              num={2}
              label="Erreur 401 sur les requêtes Riot API"
            />
            <Button variant="ghost" size="sm" className="w-full mt-2">
              Comment résoudre ?
            </Button>
          </div>

          <SectionLabel>Suggestions populaires</SectionLabel>
          <div className="flex flex-col gap-4 px-5 py-3">
            <SuggestionRow
              icon={FaHistory}
              label="Voir l'historique de mes shrooms"
            />
            <SuggestionRow
              icon={FaSync}
              label="Resynchroniser mon compte Riot ?"
            />
            <SuggestionRow
              icon={FaGift}
              label="Comment gagner des respects ?"
            />
          </div>

          <SectionLabel>Self-service</SectionLabel>
          <div className="flex flex-col gap-1 px-3 pb-4">
            <ActionRow
              icon={FaLock}
              iconBg="bg-emerald-500/10"
              iconColor="text-emerald-400"
              title="Reset mot de passe"
              description="Réinitialise ton mot de passe."
            />
            <DashedDivider />
            <ActionRow
              icon={FaShieldAlt}
              iconBg="bg-amber-500/10"
              iconColor="text-amber-400"
              title="Sécurité du compte"
              description="Met à jour ta 2FA et sessions."
            />
            <DashedDivider />
            <ActionRow
              icon={FaKey}
              iconBg="bg-accent/10"
              iconColor="text-accent"
              title="Récupérer mon compte"
              description="Reprends accès à BeemoBot."
            />
            <DashedDivider />
            <ActionRow
              icon={FaIdCard}
              iconBg="bg-fuchsia-500/10"
              iconColor="text-fuchsia-400"
              title="Lier mon Riot ID"
              description="Vérifie via icône d'invocateur."
            />
          </div>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
          <div className="flex items-center gap-1.5 text-text-muted">
            <FaQuestionCircle className="h-4 w-4" />
            <span className="text-sm">Support</span>
            <span className="text-xs">(8)</span>
          </div>
          <Button variant="primary" size="sm">
            Voir les horaires
          </Button>
        </footer>
      </aside>
    </div>
  );
};

export default SupportDrawer;
