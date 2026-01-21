"use client";

import { LOGO } from "@/assets/images";
import Navbar from "@/components/molecules/Navbar";
import { getUser, type User } from "@/lib/store/user";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HexButton } from "@/components/atoms/HexButton";

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 50], [0, 1]);
  const headerBlur = useTransform(scrollY, [0, 50], [0, 12]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  const redirectToDiscord = () => {
    window.location.href = `${process.env.API_URL}/auth/discord/redirect`;
  };

  const navItems = [
    { label: "Documentation", href: "/documentation" },
    { label: "Ressources", href: "/resources" },
    { label: "Jeux", href: "/game" },
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
        <Link 
          className="flex items-center gap-3 group" 
          href={"/"}
        >
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
          {user ? (
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <span className="text-sm font-medium text-slate-300">
                {user.username}
              </span>
              <div className="relative">
                <Image
                  src={user.avatar_url}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-blue-500/30"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0f]" />
              </div>
            </div>
          ) : (
            <HexButton
              variant="blue"
              size="sm"
              onClick={redirectToDiscord}
              className="!py-2 !px-4"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
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
