"use client";

import { LOGO } from "@/assets/images";
import DiscordIcon from "@/assets/svg/DiscordIcon";
import Button from "@/components/atoms/Button";
import Navbar from "@/components/molecules/Navbar";
import { getUser, type User } from "@/lib/store/user";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Header = () => {
  const [user, setUser] = useState<User | null>(null);

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
    <header className="py-4 px-6 bg-[#2a2e3b]/90 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link className="flex items-center space-x-2" href={"/"}>
          <Image
            src={LOGO.teemo}
            alt="Beemo Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-bold text-xl">Beemo(bot)</span>
        </Link>

        <Navbar items={navItems} />

        {user ? (
          <Image
            src={user.avatar_url}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <Button
            variant="default"
            className="bg-[#5865F2] hover:bg-[#4752c4] text-white border-none flex items-center gap-2"
            onClick={redirectToDiscord}
          >
            <DiscordIcon height={20} width={20} color="white" />
            Se connecter avec Discord
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
