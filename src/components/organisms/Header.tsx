"use client";

import { LOGO } from "@/assets/images";
import Navbar from "@/components/molecules/Navbar";
import { getToken, removeToken } from "@/lib/store/token";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HexButton } from "@/components/atoms/HexButton";
import { useRouter } from "next/navigation";
import { FaDiscord } from "react-icons/fa";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const token = getToken();
    setIsAuthenticated(!!token);
  }, [mounted]);

  const redirectToDiscord = () => {
    if (typeof window !== "undefined") {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.API_URL ||
        "http://localhost:65397";
      window.location.href = `${apiUrl}/auth/discord/redirect`;
    }
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    router.push("/");
  };

  const navItems = [
    { label: "Documentation", href: "/documentation" },
    { label: "Ressources", href: "/resources" },
    { label: "Jeux", href: "/game" },
    { label: "Recherche", href: "/search" },
  ];

  return (
    <motion.header
      style={{
        backgroundColor: "rgba(10, 10, 15, 0.6)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      }}
      className="fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300"
    >
      <div className="container mx-auto px-6 h-full flex justify-between items-center">
        <Link className="flex items-center gap-3 group" href={"/"}>
          <div className="relative w-10 h-10 transition-transform group-hover:scale-110 duration-300">
            <div className="absolute inset-0 bg-blue-500/50 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image
              src={LOGO.teemo}
              alt="Beemo Logo"
              width={40}
              height={40}
              className="rounded-full relative z-10 border-2 border-white/10"
            />
          </div>
          <span className="font-bold text-xl tracking-tight">
            Beemo<span className="text-blue-400">Bot</span>
          </span>
        </Link>

        <Navbar items={navItems} />

        <div className="hidden md:block">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link href="/profil">
                <HexButton variant="blue" size="sm" className="!py-2 !px-4">
                  Profil
                </HexButton>
              </Link>
              <HexButton
                variant="gold"
                size="sm"
                onClick={handleLogout}
                className="!py-2 !px-4"
              >
                Déconnexion
              </HexButton>
            </div>
          ) : (
            <HexButton
              variant="blue"
              size="sm"
              onClick={redirectToDiscord}
              className="!py-2 !px-4"
            >
              <div className="flex items-center gap-2">
                <FaDiscord className="w-5 h-5" />
                <span>Login</span>
              </div>
            </HexButton>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
