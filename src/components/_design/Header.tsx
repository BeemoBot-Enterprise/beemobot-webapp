/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
"use client";
import Link from "next/link";
import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { RiDiscordFill, RiMenuLine, RiCloseLine, RiSearchLine } from "@remixicon/react";
import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/design/cn";
import { BOT_INVITE_URL } from "@/lib/env";

const NAV = [
  { label: "Recherche", href: "/search" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Mini-jeux", href: "/game" },
  { label: "Documentation", href: "/documentation" },
];

export function HeaderHF({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <header
      className={cn(
        "sticky top-0 z-50 backdrop-blur-md bg-hf-bg/85 border-b border-hf-line",
        className,
      )}
    >
      <div className="mx-auto max-w-[1100px] px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-hf-navy">
          <BeeMark />
          <span className="text-hf-body-lg tracking-tight">Beemobot</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-hf-body-sm font-medium text-hf-navy-soft hover:text-hf-honey-text transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Rechercher un joueur"
            title="Rechercher un joueur"
            className="hidden sm:flex items-center justify-center size-10 rounded-hf-btn border border-hf-line bg-hf-surface text-hf-navy hover:border-hf-honey hover:text-hf-honey-text transition-colors"
          >
            <RiSearchLine className="size-5" aria-hidden />
          </Link>
          <Link
            href="/profile"
            className="hidden sm:inline-block text-hf-body-sm font-medium text-hf-navy-soft hover:text-hf-navy transition-colors"
          >
            Mon profil
          </Link>
          <ThemeToggle className="hidden sm:flex" />
          <a href={BOT_INVITE_URL} target="_blank" rel="noreferrer" className="hidden md:inline-flex">
            <Button size="sm" variant="primary">
              <RiDiscordFill className="size-4" />
              Ajouter
            </Button>
          </a>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Ouvrir le menu"
                className="md:hidden flex items-center justify-center size-10 rounded-hf-btn border border-hf-line bg-hf-surface text-hf-navy hover:border-hf-honey transition-colors"
              >
                <RiMenuLine className="size-5" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-hf-navy/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out" />
              <Dialog.Content
                className="fixed inset-x-0 top-0 z-50 bg-hf-bg border-b border-hf-line p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top"
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Navigation principale du site
                </Dialog.Description>
                <div className="flex items-center justify-between mb-6">
                  <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 font-display font-bold text-hf-navy">
                    <BeeMark />
                    <span className="text-hf-body-lg tracking-tight">Beemobot</span>
                  </Link>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Fermer le menu"
                      className="flex items-center justify-center size-10 rounded-hf-btn border border-hf-line bg-hf-surface text-hf-navy hover:border-hf-honey transition-colors"
                    >
                      <RiCloseLine className="size-5" />
                    </button>
                  </Dialog.Close>
                </div>
                <nav className="flex flex-col">
                  {NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="py-3 border-b border-hf-line text-hf-body-lg font-medium text-hf-navy hover:text-hf-honey-text transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="py-3 border-b border-hf-line text-hf-body-lg font-medium text-hf-navy hover:text-hf-honey-text transition-colors"
                  >
                    Mon profil
                  </Link>
                </nav>
                <div className="mt-6 flex items-center gap-3">
                  <ThemeToggle />
                  <span className="text-hf-body-sm text-hf-navy-soft">Thème</span>
                </div>
                <a
                  href={BOT_INVITE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full"
                  onClick={() => setOpen(false)}
                >
                  <Button size="lg" variant="primary" className="w-full">
                    <RiDiscordFill className="size-5" />
                    Ajouter à Discord
                  </Button>
                </a>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}

function BeeMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="14" fill="var(--hf-honey)" />
      <ellipse cx="16" cy="16" rx="14" ry="4" fill="var(--hf-navy)" />
    </svg>
  );
}
