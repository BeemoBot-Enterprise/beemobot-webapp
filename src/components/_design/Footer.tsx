/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */
import Link from "next/link";
import * as React from "react";
import { RiDiscordFill, RiGithubFill } from "@remixicon/react";
import { cn } from "@/lib/design/cn";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Produit",
    links: [
      { label: "Fonctionnalités", href: "/#features" },
      { label: "Mini-jeux", href: "/game" },
      { label: "Shop", href: "/shop" },
    ],
  },
  {
    title: "Joueurs",
    links: [
      { label: "Mon profil", href: "/profile" },
      { label: "Recherche", href: "/search" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "Documentation", href: "/documentation" },
      { label: "Resources", href: "/resources" },
    ],
  },
];

export function FooterHF({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "border-t border-hf-line bg-hf-surface",
        className,
      )}
    >
      <div className="mx-auto max-w-[1100px] px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="font-display font-bold text-hf-body-lg text-hf-navy">Beemobot</div>
            <p className="mt-2 text-hf-body-sm text-hf-navy-soft max-w-[14rem]">
              Le bot Discord pour ta communauté League of Legends.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <div className="text-hf-eyebrow uppercase tracking-[0.15em] text-hf-honey-text mb-3">
                {col.title}
              </div>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-hf-body-sm text-hf-navy-soft hover:text-hf-navy transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-hf-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-hf-body-sm text-hf-navy-soft">
            © {new Date().getFullYear()} BeemoBot Enterprise.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://discord.com"
              aria-label="Discord"
              className="text-hf-navy-soft hover:text-hf-honey transition-colors"
            >
              <RiDiscordFill className="size-5" />
            </a>
            <a
              href="https://github.com"
              aria-label="GitHub"
              className="text-hf-navy-soft hover:text-hf-honey transition-colors"
            >
              <RiGithubFill className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
