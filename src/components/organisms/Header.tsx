"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaDiscord } from "react-icons/fa";
import { LOGO } from "@/assets/images";
import Navbar from "@/components/molecules/Navbar";
import Button from "@/components/atoms/Button";
import { getToken, removeToken } from "@/lib/store/token";
import { API_URL } from "@/lib/env";
import { twMerge } from "tailwind-merge";

const navItems = [
  { label: "Recherche", href: "/search" },
  { label: "Mini-jeux", href: "/game" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Documentation", href: "/documentation" },
  { label: "Resources", href: "/resources" },
];

const Header = () => {
  const [authed, setAuthed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setAuthed(!!getToken());
  }, [mounted]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const login = () => {
    if (typeof window !== "undefined") {
      window.location.href = `${API_URL}/auth/discord/redirect`;
    }
  };

  const logout = () => {
    removeToken();
    setAuthed(false);
    router.push("/");
  };

  return (
    <header
      className={twMerge(
        "sticky top-0 z-50 h-16 bg-bg transition-colors",
        scrolled && "border-b border-border",
      )}
    >
      <div className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src={LOGO.teemo}
            alt="BeemoBot"
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="font-semibold tracking-tight">BeemoBot</span>
        </Link>

        <nav className="hidden md:block">
          <Navbar items={navItems} />
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {mounted && authed ? (
            <>
              <Link href="/profile">
                <Button variant="secondary" size="sm">Profil</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <Button variant="primary" size="sm" onClick={login}>
              <FaDiscord className="h-4 w-4" />
              Connexion
            </Button>
          )}
        </div>

        <button
          className="md:hidden p-2 -mr-2 text-text"
          aria-label="Menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-16 inset-x-0 bg-surface border-b border-border shadow-md">
          <div className="max-w-[1200px] mx-auto p-4 flex flex-col gap-4">
            <Navbar items={navItems} onMobileNavigate={() => setMenuOpen(false)} />
            <div className="border-t border-border pt-4 flex flex-col gap-2">
              {mounted && authed ? (
                <>
                  <Link href="/profile" onClick={() => setMenuOpen(false)}>
                    <Button variant="secondary" size="md" className="w-full">Profil</Button>
                  </Link>
                  <Button variant="ghost" size="md" className="w-full" onClick={logout}>
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Button variant="primary" size="md" className="w-full" onClick={login}>
                  <FaDiscord className="h-4 w-4" />
                  Connexion
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
