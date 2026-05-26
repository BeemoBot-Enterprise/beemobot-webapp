/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { API_URL } from "@/lib/env";

interface DiscordUser {
  id: string;
  username: string;
  avatarUrl: string | null;
  email?: string | null;
  puuid: string | null;
  gameName: string | null;
  tagLine: string | null;
  linked: boolean;
}

interface RiotProfile {
  counts: { respects: number; shrooms: number };
  weighted: { respects: number; shrooms: number };
  honey: number;
  recentEvents: Array<{
    id: number;
    type: "shroom" | "respect";
    giver_puuid: string;
    match_id: string;
    weight: number;
    created_at: string;
  }>;
}

const TOKEN_KEY = "beemobot_token";
const USER_KEY = "beemobot_user";

export default function ProfileContent() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [profile, setProfile] = useState<RiotProfile | null>(null);
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

        const userResponse = await fetch(`${API_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userResponse.ok) {
          // Seul un 401/403 invalide réellement le token ; sur 5xx ou réseau
          // on remonte une erreur "soft" qui ne déconnectera pas l'utilisateur.
          const expired = userResponse.status === 401 || userResponse.status === 403;
          const e = new Error(expired ? "Token invalide ou expiré." : "Erreur de chargement");
          (e as Error & { expired?: boolean }).expired = expired;
          throw e;
        }
        const userData = await userResponse.json();
        const nextUser: DiscordUser = {
          id: userData.discordId ?? "0",
          username: userData.username ?? "User",
          avatarUrl: userData.avatarUrl ?? null,
          email: userData.email ?? null,
          puuid: userData.puuid ?? null,
          gameName: userData.gameName ?? null,
          tagLine: userData.tagLine ?? null,
          linked: !!userData.linked,
        };
        setUser(nextUser);
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));

        if (nextUser.puuid) {
          const profileResponse = await fetch(
            `${API_URL}/profile/${encodeURIComponent(nextUser.puuid)}`,
          );
          if (profileResponse.ok) {
            setProfile(await profileResponse.json());
          } else {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
        // On ne purge le token que si l'API a explicitement rejeté (401/403).
        if ((err as Error & { expired?: boolean })?.expired) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/discord/redirect`;
  };

  const getAvatarUrl = (u: DiscordUser) => {
    if (u.avatarUrl) return u.avatarUrl;
    return `https://cdn.discordapp.com/embed/avatars/0.png`;
  };

  if (loading) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <p className="text-text-sub-600">Chargement…</p>
      </main>
    );
  }

  if (!token || !user) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <Card className="p-10 text-center">
          <h1 className="text-title-h5 text-text-strong-950 !font-[600] mb-2">
            Connexion requise
          </h1>
          <p className="text-text-sub-600 mb-6">
            Connecte-toi avec Discord pour accéder à ton profil.
          </p>
          <Button onClick={handleLogin} variant="primary">
            Se connecter avec Discord
          </Button>
        </Card>
      </main>
    );
  }

  const respects = profile?.counts.respects ?? 0;
  const shrooms = profile?.counts.shrooms ?? 0;
  const honey = profile?.honey ?? 0;
  const netRep = respects - shrooms;
  const netLabel = netRep >= 0 ? `+${netRep}` : `${netRep}`;
  const totalEvents = respects + shrooms;
  const ratio =
    totalEvents > 0 ? Math.round((respects / totalEvents) * 100) : 0;
  const publicProfileHref = user.linked
    ? `/u/${encodeURIComponent(`${user.gameName}-${user.tagLine}`)}`
    : null;

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      {/* Header profil */}
      <section className="flex flex-wrap items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-bg-weak-50 border border-stroke-soft-200 overflow-hidden flex items-center justify-center">
            <Image
              src={getAvatarUrl(user)}
              alt={`Avatar de ${user.username}`}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-title-h3 text-text-strong-950 !font-[600]">
              {user.username}
            </h1>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              {user.linked && user.gameName ? (
                <>
                  <Badge variant="accent">
                    {user.gameName}
                    <span className="opacity-70 ml-1">#{user.tagLine}</span>
                  </Badge>
                  <span className="text-xs text-text-sub-600">Compte lié</span>
                </>
              ) : (
                <Badge variant="gold">Compte Riot non lié</Badge>
              )}
            </div>
            {user.email && (
              <p className="text-text-sub-600 text-xs mt-1">{user.email}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {publicProfileHref && (
            <Link href={publicProfileHref}>
              <Button variant="secondary">Voir mon profil public</Button>
            </Link>
          )}
          <Link href="/settings">
            <Button variant="ghost">Paramètres</Button>
          </Link>
        </div>
      </section>

      {error && (
        <Card className="p-4 mb-8 border-danger/40">
          <p className="text-sm text-error-base">{error}</p>
        </Card>
      )}

      {/* CTA si non lié */}
      {!user.linked && (
        <Card className="p-6 mb-10 flex flex-wrap items-center justify-between gap-4 border-accent-gold/40">
          <div>
            <h2 className="text-label-lg text-text-strong-950 mb-1">
              Lie ton compte Riot pour activer ton profil
            </h2>
            <p className="text-sm text-text-sub-600">
              Sans ça, impossible de cumuler des shrooms, respects ou honey.
            </p>
          </div>
          <Link href="/auth/link">
            <Button variant="primary">Lier mon compte Riot</Button>
          </Link>
        </Card>
      )}

      {/* Stats principales */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Card className="p-6">
          <div className="text-sm text-text-sub-600">Respects</div>
          <div className="text-title-h3 text-text-strong-950 !font-[600] mt-1">
            {respects}
          </div>
          {profile && profile.weighted.respects !== respects && (
            <div className="text-xs text-text-sub-600 mt-1">
              pondéré · {profile.weighted.respects}
            </div>
          )}
        </Card>
        <Card className="p-6">
          <div className="text-sm text-text-sub-600">Shrooms</div>
          <div className="text-title-h3 text-text-strong-950 !font-[600] mt-1">{shrooms}</div>
          {profile && profile.weighted.shrooms !== shrooms && (
            <div className="text-xs text-text-sub-600 mt-1">
              pondéré · {profile.weighted.shrooms}
            </div>
          )}
        </Card>
        <Card className="p-6">
          <div className="text-sm text-text-sub-600">Honey</div>
          <div className="text-3xl font-semibold text-primary-base-gold mt-1">
            {honey}
          </div>
          <div className="text-xs text-text-sub-600 mt-1">monnaie du shop</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-text-sub-600">Score net</div>
          <div
            className={`text-3xl font-semibold mt-1 ${
              netRep > 0
                ? "text-primary-base"
                : netRep < 0
                  ? "text-error-base"
                  : "text-text-strong-950"
            }`}
          >
            {netLabel}
          </div>
          <div className="text-xs text-text-sub-600 mt-1">
            respects − shrooms
          </div>
        </Card>
      </section>

      {/* Ratio + events */}
      <section className="grid md:grid-cols-[1fr_2fr] gap-4 mb-10">
        <Card className="p-6">
          <div className="text-sm text-text-sub-600 mb-3">Ratio de respect</div>
          {totalEvents === 0 ? (
            <p className="text-sm text-text-sub-600">
              Pas encore d&apos;évènements.
            </p>
          ) : (
            <>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-title-h3 text-text-strong-950 !font-[600]">
                  {ratio}%
                </span>
                <span className="text-xs text-text-sub-600">
                  ({respects}/{totalEvents})
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-bg-weak-50 overflow-hidden">
                <div
                  className="h-full bg-primary-base transition-all"
                  style={{ width: `${ratio}%` }}
                />
              </div>
              <p className="text-xs text-text-sub-600 mt-3">
                Part de respects dans le total des évènements reçus.
              </p>
            </>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-label-md text-text-strong-950">
              Évènements récents
            </h2>
            {profile && profile.recentEvents.length > 0 && (
              <span className="text-xs text-text-sub-600">
                {profile.recentEvents.length} derniers
              </span>
            )}
          </div>
          {!profile || profile.recentEvents.length === 0 ? (
            <p className="text-sm text-text-sub-600">
              {user.linked
                ? "Aucun évènement encore. Joue, fais-toi des amis."
                : "Lie ton compte pour voir ton historique."}
            </p>
          ) : (
            <ul className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              {profile.recentEvents.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-3 text-sm border-b border-stroke-soft-200 last:border-b-0 pb-2 last:pb-0"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Badge
                      variant={e.type === "respect" ? "accent" : "default"}
                    >
                      {e.type}
                    </Badge>
                    <code className="text-text-sub-600 font-mono text-xs truncate">
                      {e.match_id}
                    </code>
                  </span>
                  <span className="text-text-sub-600 text-xs whitespace-nowrap">
                    ×{e.weight} ·{" "}
                    {new Date(e.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      {/* Liens utiles */}
      <section className="flex flex-wrap gap-3">
        <Link href="/leaderboard">
          <Button variant="secondary">Leaderboard</Button>
        </Link>
        <Link href="/shop">
          <Button variant="secondary">Shop</Button>
        </Link>
        {user.linked && (
          <Link href="/auth/link">
            <Button variant="ghost">Modifier mon Riot ID</Button>
          </Link>
        )}
      </section>
    </main>
  );
}
