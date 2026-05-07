/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import Link from "next/link";
import Image from "next/image";
import { LOGO } from "@/assets/images";
import {
  RiDiscordFill,
  RiGithubFill,
  RiTwitterXFill,
  RiInstagramFill,
} from "@remixicon/react";
import * as LinkButton from "@/components/ui/link-button";
import { BOT_INVITE_URL } from "@/lib/env";

const footerLinksData = {
  product: [
    { id: "p1", href: "/", text: "Vue d'ensemble" },
    { id: "p2", href: "/game", text: "Mini-jeux" },
    { id: "p3", href: "/search", text: "Recherche" },
    { id: "p4", href: "/leaderboard", text: "Leaderboard" },
  ],
  community: [
    { id: "c1", href: "#", text: "Discord" },
    { id: "c2", href: "/documentation", text: "Documentation" },
    { id: "c3", href: "/resources", text: "Ressources" },
    { id: "c4", href: "#", text: "Contact" },
  ],
  developers: [
    { id: "d1", href: "/documentation#api", text: "API Reference" },
    { id: "d2", href: "https://github.com/", text: "GitHub" },
    { id: "d3", href: "#", text: "Changelog" },
    { id: "d4", href: "#", text: "Status" },
  ],
  legal: [
    { id: "l1", href: "/legal", text: "Mentions légales" },
    { id: "l2", href: "/privacy", text: "Confidentialité" },
    { id: "l3", href: "#", text: "Cookies" },
  ],
};

const socials = [
  {
    id: "discord",
    icon: RiDiscordFill,
    href: "#",
    label: "Discord",
    hover: "hover:text-[#5865F2]",
  },
  {
    id: "github",
    icon: RiGithubFill,
    href: "https://github.com/",
    label: "GitHub",
    hover: "hover:text-text-strong-950",
  },
  {
    id: "twitter",
    icon: RiTwitterXFill,
    href: "#",
    label: "X",
    hover: "hover:text-text-strong-950",
  },
  {
    id: "instagram",
    icon: RiInstagramFill,
    href: "#",
    label: "Instagram",
    hover: "hover:text-[#E4405F]",
  },
];

const FooterLinkColumn = ({
  title,
  links,
}: {
  title: string;
  links: { id: string; href: string; text: string }[];
}) => (
  <div className="flex w-auto flex-col items-start gap-3">
    <h3 className="text-subheading-2xs text-text-soft-400">{title}</h3>
    {links.map((link) => (
      <LinkButton.Root
        key={link.id}
        variant="gray"
        size="medium"
        underline={false}
        asChild
      >
        <Link href={link.href}>{link.text}</Link>
      </LinkButton.Root>
    ))}
  </div>
);

const Footer = () => (
  <footer className="border-t border-stroke-soft-200 bg-bg-white-0 w-full">
    <div className="max-w-[1200px] mx-auto px-6 pt-16 lg:pt-20 pb-6">
      <div className="mb-10 flex flex-wrap items-start lg:flex-nowrap lg:gap-10 xl:gap-14">
        <div className="order-1 flex w-1/2 flex-col gap-3 lg:w-auto xl:min-w-[180px]">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={LOGO.teemo}
              alt="BeemoBot"
              width={26}
              height={26}
              className="rounded-full"
            />
            <span className="text-label-md text-text-strong-950">
              BeemoBot
              <span className="ml-1 text-paragraph-xs text-text-soft-400 align-top">
                ™
              </span>
            </span>
          </Link>
          <p className="text-paragraph-xs text-text-sub-600 max-w-[220px]">
            Le bot Discord pour les communautés League of Legends.
          </p>
        </div>

        <div className="order-3 mt-10 grid w-full flex-1 grid-cols-2 gap-8 border-t border-stroke-soft-200 pt-10 md:grid-cols-4 lg:order-2 lg:mt-0 lg:flex lg:justify-around lg:border-t-0 lg:pt-0 xl:gap-14">
          <FooterLinkColumn title="Produit" links={footerLinksData.product} />
          <FooterLinkColumn
            title="Communauté"
            links={footerLinksData.community}
          />
          <FooterLinkColumn
            title="Développeurs"
            links={footerLinksData.developers}
          />
          <FooterLinkColumn title="Légal" links={footerLinksData.legal} />
        </div>

        <div className="order-2 flex w-1/2 justify-end lg:order-3 lg:w-auto xl:min-w-[180px]">
          <a
            href={BOT_INVITE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#5865F2] px-3 text-label-sm text-white transition-colors hover:bg-[#4752C4]"
          >
            <RiDiscordFill className="size-4" />
            Inviter le bot
          </a>
        </div>
      </div>

      <div className="mb-10 flex items-center justify-between gap-4 border-t border-stroke-soft-200 pt-8">
        <div className="flex gap-4">
          {socials.map((s) => (
            <a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className={`text-text-soft-400 transition-colors ${s.hover}`}
            >
              <s.icon className="size-5" />
            </a>
          ))}
        </div>
        <div className="text-paragraph-xs text-text-soft-400">
          © {new Date().getFullYear()} BeemoBot Enterprise. Tous droits réservés.
        </div>
      </div>

      <div
        aria-hidden
        className="select-none flex justify-center pb-2 leading-none overflow-hidden"
      >
        <span
          className="font-black tracking-tighter"
          style={{
            color: "rgba(154, 160, 176, 0.20)",
            fontSize: "clamp(72px, 19vw, 260px)",
            lineHeight: 0.85,
          }}
        >
          BEEMO
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
