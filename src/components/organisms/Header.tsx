/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  RiMenuLine,
  RiCloseFill,
  RiArrowRightUpLongLine,
  RiFlashlightFill,
  RiLayoutGridLine,
  RiPulseFill,
  RiTaskLine,
  RiDiscordFill,
} from "@remixicon/react";
import type { RemixiconComponentType } from "@remixicon/react";
import { LOGO } from "@/assets/images";
import * as Button from "@/components/ui/button";
import * as LinkButton from "@/components/ui/link-button";
import * as CompactButton from "@/components/ui/compact-button";
import { getToken } from "@/lib/store/token";
import { getUser, type User } from "@/lib/store/user";
import { API_URL, BOT_INVITE_URL } from "@/lib/env";

type ColumnLink = { label: string; href: string };

const quickAccess: { icon: RemixiconComponentType; label: string; href: string }[] = [
  { icon: RiLayoutGridLine, label: "Vue d'ensemble", href: "/" },
  { icon: RiPulseFill, label: "Mini-jeux", href: "/game" },
  { icon: RiTaskLine, label: "Leaderboard", href: "/leaderboard" },
];

const toolsLinks: ColumnLink[] = [
  { label: "Recherche de joueurs", href: "/search" },
  { label: "Lier mon compte Riot", href: "/auth/link" },
  { label: "Mon profil", href: "/profile" },
  { label: "Statistiques live", href: "/leaderboard" },
];

const supportLinks: ColumnLink[] = [
  { label: "Documentation", href: "/documentation" },
  { label: "Ressources", href: "/resources" },
  { label: "Discord communautaire", href: "#" },
];

const inlineNav: ColumnLink[] = [
  { label: "Recherche", href: "/search" },
  { label: "Mini-jeux", href: "/game" },
  { label: "Leaderboard", href: "/leaderboard" },
];

const ColumnLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-subheading-2xs text-text-soft-400">{children}</div>
);

const HoverLink = ({
  label,
  href,
  onClick,
}: ColumnLink & { onClick?: () => void }) => (
  <LinkButton.Root variant="gray" size="medium" underline={false} asChild>
    <Link href={href} onClick={onClick} className="group/link">
      {label}
      <LinkButton.Icon
        as={RiArrowRightUpLongLine}
        className="opacity-0 -translate-x-1 transition-all duration-300 group-hover/link:opacity-100 group-hover/link:translate-x-0"
      />
    </Link>
  </LinkButton.Root>
);

const QuickAccessButton = ({
  icon,
  label,
  href,
  onClick,
}: {
  icon: RemixiconComponentType;
  label: string;
  href: string;
  onClick?: () => void;
}) => (
  <Button.Root variant="neutral" mode="stroke" size="xsmall" asChild>
    <Link href={href} onClick={onClick} className="group/btn rounded-full">
      <Button.Icon
        as={icon}
        className="text-text-soft-400 group-hover/btn:text-primary-base transition-colors"
      />
      {label}
    </Link>
  </Button.Root>
);

const NavDropdownMenu = ({ onClose }: { onClose: () => void }) => (
  <div className="flex flex-col bg-bg-weak-50 lg:flex-row lg:gap-10 lg:rounded-20 lg:border lg:border-stroke-soft-200 lg:p-6">
    <div className="flex flex-col gap-4 p-6 lg:p-0 lg:gap-5 lg:min-w-[280px] border-b border-stroke-soft-200 lg:border-0">
      <div className="flex flex-row items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full border border-stroke-soft-200 bg-bg-white-0">
          <RiFlashlightFill className="size-4 text-primary-base" />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-label-sm text-text-strong-950">
            Hub BeemoBot
          </div>
          <div className="text-paragraph-xs text-text-sub-600">
            Tout ton écosystème en un seul endroit.
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {quickAccess.map((item) => (
          <QuickAccessButton key={item.href} {...item} onClick={onClose} />
        ))}
      </div>
      <div className="hidden lg:flex flex-1 items-end text-paragraph-xs text-text-soft-400/70">
        v1.0 · BeemoBot™
      </div>
    </div>

    <div className="relative flex flex-col gap-3 p-6 lg:p-0 lg:gap-4 lg:min-w-[200px] border-b border-stroke-soft-200 lg:border-0 lg:before:absolute lg:before:top-0 lg:before:-left-5 lg:before:h-full lg:before:w-px lg:before:bg-stroke-soft-200 lg:before:content-['']">
      <ColumnLabel>Outils</ColumnLabel>
      <div className="flex flex-col items-start gap-3">
        {toolsLinks.map((link) => (
          <HoverLink key={link.href} {...link} onClick={onClose} />
        ))}
      </div>
    </div>

    <div className="relative flex flex-col gap-3 p-6 lg:p-0 lg:gap-4 lg:min-w-[200px] lg:before:absolute lg:before:top-0 lg:before:-left-5 lg:before:h-full lg:before:w-px lg:before:bg-stroke-soft-200 lg:before:content-['']">
      <ColumnLabel>Support</ColumnLabel>
      <div className="flex flex-col items-start gap-3">
        {supportLinks.map((link) => (
          <HoverLink key={link.href} {...link} onClick={onClose} />
        ))}
      </div>
    </div>
  </div>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [user, setUserState] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted) return;
    const hasToken = !!getToken();
    setAuthed(hasToken);
    if (hasToken) {
      getUser().then((u) => setUserState(u));
    }
  }, [mounted]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (toggleRef.current?.contains(target)) return;
      setIsMenuOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const login = () => {
    if (typeof window !== "undefined") {
      window.location.href = `${API_URL}/auth/discord/redirect`;
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-300 lg:px-6 lg:pt-4">
        <header
          className={twMerge(
            "flex h-14 w-full items-center justify-between gap-4 border-b border-stroke-soft-200 bg-bg-white-0/85 backdrop-blur-md px-4",
            "lg:h-14 lg:w-fit lg:rounded-full lg:border lg:pl-3 lg:pr-2 lg:py-0",
            scrolled ? "lg:bg-bg-weak-50/95" : "lg:bg-bg-weak-50/80",
          )}
        >
          <div className="flex items-center gap-2">
            <div ref={toggleRef}>
              <CompactButton.Root
                variant="ghost"
                size="medium"
                onClick={() => setIsMenuOpen((v) => !v)}
                aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={isMenuOpen}
                className={twMerge(
                  "rounded-full transition-colors",
                  isMenuOpen && "bg-bg-soft-200",
                )}
              >
                <CompactButton.Icon
                  as={isMenuOpen ? RiCloseFill : RiMenuLine}
                />
              </CompactButton.Root>
            </div>

            <Link href="/" className="flex items-center gap-2 px-1">
              <Image
                src={LOGO.teemo}
                alt="BeemoBot"
                width={26}
                height={26}
                className="rounded-full"
              />
              <span className="hidden sm:inline text-label-sm text-text-strong-950">
                BeemoBot
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1 px-2">
            {inlineNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-label-sm text-text-sub-600 hover:bg-bg-soft-200 hover:text-text-strong-950 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <a
              href={BOT_INVITE_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:inline-flex h-8 items-center gap-1.5 rounded-full bg-[#5865F2] px-3 text-label-xs text-white transition-colors hover:bg-[#4752C4]"
            >
              <RiDiscordFill className="size-3.5" />
              Inviter
            </a>
            <span className="hidden lg:block h-6 w-px bg-stroke-soft-200 mx-1" />

            {mounted && authed ? (
              <Link
                href="/profile"
                className="ml-1 flex items-center rounded-full p-0.5 hover:bg-bg-soft-200 transition-colors"
                aria-label="Mon profil"
              >
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.username ?? "Mon profil"}
                    width={28}
                    height={28}
                    className="size-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-7 rounded-full bg-gradient-to-br from-primary-base to-primary-darker flex items-center justify-center text-label-xs text-static-white">
                    {user?.username?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
              </Link>
            ) : (
              <button
                type="button"
                onClick={login}
                className="ml-1 inline-flex h-8 items-center gap-1.5 rounded-full bg-[#5865F2] px-3 text-label-xs text-white transition-colors hover:bg-[#4752C4]"
              >
                <RiDiscordFill className="size-3.5" />
                <span className="hidden sm:inline">Connexion</span>
              </button>
            )}
          </div>
        </header>
      </div>

      <div
        ref={panelRef}
        className={twMerge(
          "fixed inset-x-0 top-14 z-40 transition-all duration-200",
          "lg:top-[72px] lg:flex lg:justify-center lg:px-6",
          isMenuOpen
            ? "visible opacity-100 translate-y-0"
            : "invisible opacity-0 -translate-y-2",
        )}
      >
        <div className="lg:w-fit">
          <NavDropdownMenu onClose={() => setIsMenuOpen(false)} />
        </div>
      </div>

      {isMenuOpen && (
        <button
          aria-hidden
          tabIndex={-1}
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 top-14 lg:top-[72px] z-30 cursor-default bg-bg-white-0/40 backdrop-blur-sm"
        />
      )}

      {/* Spacer so content starts below the fixed header */}
      <div aria-hidden className="h-14 lg:h-[72px]" />
    </>
  );
};

export default Header;
