import Link from "next/link";
import Image from "next/image";
import { LOGO } from "@/assets/images";
import { FaGithub, FaDiscord, FaTwitter } from "react-icons/fa";

const sections = [
  {
    title: "Produit",
    links: [
      { label: "Mini-jeux", href: "/game" },
      { label: "Recherche", href: "/search" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
  },
  {
    title: "Communauté",
    links: [
      { label: "Documentation", href: "/documentation" },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions légales", href: "/legal" },
      { label: "Confidentialité", href: "/privacy" },
    ],
  },
];

const socials = [
  { icon: FaDiscord, href: "https://discord.gg/", label: "Discord" },
  { icon: FaGithub, href: "https://github.com/", label: "GitHub" },
  { icon: FaTwitter, href: "https://twitter.com/", label: "Twitter" },
];

const Footer = () => (
  <footer className="border-t border-border bg-bg">
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-3">
            <Image src={LOGO.teemo} alt="BeemoBot" width={24} height={24} className="rounded-full" />
            <span className="font-semibold">BeemoBot</span>
          </Link>
          <p className="text-sm text-text-muted max-w-xs">
            Le bot Discord pour ta communauté League of Legends.
          </p>
          <div className="flex gap-3 mt-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="text-text-muted hover:text-text transition-colors"
              >
                <s.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
        {sections.map((section) => (
          <div key={section.title}>
            <h4 className="text-sm font-semibold text-text mb-3">{section.title}</h4>
            <ul className="flex flex-col gap-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between gap-2 text-xs text-text-muted">
        <span>© {new Date().getFullYear()} BeemoBot Enterprise. Tous droits réservés.</span>
        <span>Made with care.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
