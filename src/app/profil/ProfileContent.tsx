"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Image from "next/image";

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
  email?: string;
}

export default function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      localStorage.setItem("beemobot_token", tokenFromUrl);
      router.replace("/profil");
    } else {
      const storedToken = localStorage.getItem("beemobot_token");
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.API_URL ||
        "http://localhost:3333";

      const tokenData = token.replace("beemo_", "");

      const statsResponse = await fetch(`${apiUrl}/game/stats/USER`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);

        setUser({
          id: "1",
          username: statsData.username,
          discriminator: "0",
          avatar: null,
        });
      } else {
        throw new Error("Impossible de récupérer les statistiques");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.API_URL ||
      "http://localhost:3333";
    window.location.href = `${apiUrl}/auth/discord/redirect`;
  };

  const handleLogout = () => {
    localStorage.removeItem("beemobot_token");
    setToken(null);
    setUser(null);
    setStats(null);
    router.push("/");
  };

  const getAvatarUrl = (user: DiscordUser) => {
    if (user.avatar) {
      return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
    }
    return `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || "0") % 5}.png`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0f1117] py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-white text-2xl">Chargement...</div>
        </div>
      </main>
    );
  }

  if (!token || !user) {
    return (
      <main className="min-h-screen bg-[#0f1117] py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-[#1a1d28] border-gray-700/30 text-center p-12">
            <CardContent>
              <div className="text-6xl mb-6">🔐</div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Connexion requise
              </h1>
              <p className="text-gray-300 mb-8 text-lg">
                Connectez-vous avec Discord pour accéder à votre profil
              </p>
              <Button
                onClick={handleLogin}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:scale-[1.02]"
              >
                Se connecter avec Discord
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f1117] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-[#1a1d28] border-gray-700/30 overflow-hidden mb-8">
          <CardHeader className="bg-[#5865F2]/10 border-b border-gray-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={getAvatarUrl(user)}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-[#5865F2]"
                />
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {user.username}
                    {user.discriminator !== "0" && (
                      <span className="text-gray-400">
                        #{user.discriminator}
                      </span>
                    )}
                  </h1>
                  <p className="text-gray-300">Profil BeemoBot</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                Déconnexion
              </Button>
            </div>
          </CardHeader>
        </Card>

        {error && (
          <Card className="bg-red-900/20 border-red-700/30 mb-8">
            <CardContent className="p-6">
              <p className="text-red-400 flex items-center gap-2">
                <span>⚠️</span> {error}
              </p>
            </CardContent>
          </Card>
        )}

        {stats && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-[#1a1d28] border-gray-700/30">
              <CardHeader className="bg-[#0f1117] border-b border-gray-700/30">
                <CardTitle className="text-xl flex items-center gap-2">
                  🍄 Shrooms
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-orange-400 mb-2">
                    {stats.totalShrooms}
                  </div>
                  <p className="text-gray-400">Points de réputation négatifs</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1d28] border-gray-700/30">
              <CardHeader className="bg-[#0f1117] border-b border-gray-700/30">
                <CardTitle className="text-xl flex items-center gap-2">
                  ⭐ Respects
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-emerald-400 mb-2">
                    {stats.totalRespects}
                  </div>
                  <p className="text-gray-400">Points de réputation positifs</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {stats && (
          <Card className="bg-[#1a1d28] border-gray-700/30">
            <CardHeader className="bg-[#0f1117] border-b border-gray-700/30">
              <CardTitle className="text-2xl text-white">
                📊 Score de Réputation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">
                  <span
                    className={
                      stats.totalRespects - stats.totalShrooms >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {stats.totalRespects - stats.totalShrooms >= 0 ? "+" : ""}
                    {stats.totalRespects - stats.totalShrooms}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-8 text-lg">
                  <div className="text-emerald-400">
                    +{stats.totalRespects} Respects
                  </div>
                  <div className="text-gray-500">-</div>
                  <div className="text-orange-400">
                    {stats.totalShrooms} Shrooms
                  </div>
                </div>
                <div className="mt-6 p-4 bg-[#0f1117] rounded-lg border border-gray-700/30">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {stats.totalRespects - stats.totalShrooms >= 10 ? (
                      <>
                        🏆 Excellent joueur ! Tu es respecté par la communauté.
                      </>
                    ) : stats.totalRespects - stats.totalShrooms >= 0 ? (
                      <>👍 Bon joueur, continue comme ça !</>
                    ) : stats.totalRespects - stats.totalShrooms >= -10 ? (
                      <>⚠️ Attention, ta réputation est négative.</>
                    ) : (
                      <>
                        🚫 Ta réputation est très mauvaise. Améliore ton
                        comportement !
                      </>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
