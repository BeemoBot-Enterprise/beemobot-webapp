/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { API_URL } from "@/lib/env";

interface UserStats {
  username: string;
  totalShrooms: number;
  totalRespects: number;
}

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
}

const TOKEN_KEY = "beemobot_token";
const USER_KEY = "beemobot_user";

export default function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      localStorage.setItem(TOKEN_KEY, tokenFromUrl);
      setToken(tokenFromUrl);
      return;
    }

    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userResponse = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userResponse.ok) {
          throw new Error("Token invalide ou expiré.");
        }
        const userData = await userResponse.json();
        const nextUser: DiscordUser = {
          id: userData.id ?? "0",
          username: userData.username ?? "User",
          discriminator: userData.discriminator ?? "0",
          avatar: userData.avatar ?? null,
        };
        setUser(nextUser);
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));

        const statsResponse = await fetch(
          `${API_URL}/game/stats/${encodeURIComponent(nextUser.username)}`,
        );
        if (statsResponse.ok) {
          setStats(await statsResponse.json());
        } else {
          setStats({
            username: nextUser.username,
            totalShrooms: 0,
            totalRespects: 0,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/discord/redirect`;
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setStats(null);
    router.push("/");
  };

  const getAvatarUrl = (u: DiscordUser) => {
    if (u.avatar) {
      return `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png`;
    }
    return `https://cdn.discordapp.com/embed/avatars/${
      parseInt(u.discriminator || "0") % 5
    }.png`;
  };

  if (loading) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <p className="text-text-muted">Chargement…</p>
      </main>
    );
  }

  if (!token || !user) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <Card className="p-10 text-center">
          <h1 className="text-2xl font-semibold text-text mb-2">
            Connexion requise
          </h1>
          <p className="text-text-muted mb-6">
            Connecte-toi avec Discord pour accéder à ton profil.
          </p>
          <Button onClick={handleLogin} variant="primary">
            Se connecter avec Discord
          </Button>
        </Card>
      </main>
    );
  }

  const repScore = stats ? stats.totalRespects - stats.totalShrooms : 0;

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      {/* Header profil */}
      <section className="flex items-center gap-6 mb-10">
        <div className="h-24 w-24 rounded-full bg-surface border border-border overflow-hidden flex items-center justify-center">
          <Image
            src={getAvatarUrl(user)}
            alt={`Avatar de ${user.username}`}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-text">{user.username}</h1>
          <p className="text-text-muted text-sm">
            {user.discriminator !== "0" ? `#${user.discriminator}` : "Discord"}
          </p>
        </div>
      </section>

      {error && (
        <Card className="p-4 mb-8 border-danger/40">
          <p className="text-sm text-danger">{error}</p>
        </Card>
      )}

      {/* Stats */}
      {stats && (
        <section className="grid md:grid-cols-3 gap-4 mb-10">
          <Card className="p-6">
            <div className="text-sm text-text-muted">Shrooms</div>
            <div className="text-3xl font-semibold text-text mt-1">
              {stats.totalShrooms}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-text-muted">Respects</div>
            <div className="text-3xl font-semibold text-text mt-1">
              {stats.totalRespects}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-text-muted">Rep score</div>
            <div className="text-3xl font-semibold text-text mt-1">
              {repScore >= 0 ? `+${repScore}` : repScore}
            </div>
          </Card>
        </section>
      )}

      <Button onClick={handleLogout} variant="secondary">
        Se déconnecter
      </Button>
    </main>
  );
}
