import { API_URL } from "astro:env/client";
import { Button } from "./ui/button";
import { getUser, type User } from "../lib/store/user";
import { useEffect, useState } from "react";
import Image from "astro/components/Image.astro";

const redirectToDiscord = () => {
  window.location.href = `${API_URL}/auth/discord/redirect`;
};

const Header = async () => {
  const [user, setUser] = useState<User | null>(() => null);

  useEffect(() => {
    (async () => setUser(await getUser()))();
  }, []);

  return (
    <header className="py-4 px-6 bg-[#2a2e3b]/90 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src="/src/assets/teemo-avatar.png"
            alt="Beemo Logo"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-bold text-xl">Beemo(bot)</span>
        </div>

        <nav className="hidden md:flex space-x-6">
          <div className="relative group">
            <a
              href="/documentation"
              className="hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              Documentation
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </a>
          </div>

          <div className="relative group">
            <a
              href="/resources"
              className="hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              Ressources
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </a>
          </div>

          <div className="relative group">
            <a
              href="/game"
              className="hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              Game
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </a>
          </div>
        </nav>

        {user ? (
          <Image
            src={user.avatar_url}
            alt="User Avatar"
            class="w-10 h-10 rounded-full"
            height={40}
            width={40}
          />
        ) : (
          <Button
            variant="default"
            className="bg-[#5865F2] hover:bg-[#4752c4] text-white border-none flex items-center gap-2"
            onClick={redirectToDiscord}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.02.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02z" />
            </svg>
            Se connecter avec Discord
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
