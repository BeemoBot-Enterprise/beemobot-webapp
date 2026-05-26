/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/_design/Card";
import { Button } from "@/components/_design/Button";
import { Pill } from "@/components/_design/Pill";
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
        <p className="text-hf-navy-soft">Chargement…</p>
      </main>
    );
  }

  if (!token || !user) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <Card className="p-10 text-center">
          <h1 className="font-display text-hf-display-3 text-hf-navy mb-2">
            Connexion requise
          </h1>
          <p className="text-hf-body text-hf-navy-soft mb-6">
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
          <div className="h-24 w-24 rounded-full bg-hf-surface-alt border border-hf-line overflow-hidden flex items-center justify-center">
            <Image
              src={getAvatarUrl(user)}
              alt={`Avatar de ${user.username}`}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-display text-hf-display-2 text-hf-navy">
              {user.username}
            </h1>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              {user.linked && user.gameName ? (
                <>
                  <Pill variant="honey">
                    {user.gameName}
                    <span className="opacity-70 ml-1">#{user.tagLine}</span>
                  </Pill>
                  <span className="text-hf-body-sm text-hf-navy-soft">Compte lié</span>
                </>
              ) : (
                <Pill variant="honey">Compte Riot non lié</Pill>
              )}
            </div>
            {user.email && (
              <p className="text-hf-body-sm text-hf-navy-soft mt-1">{user.email}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {publicProfileHref && (
            <Link href={publicProfileHref}>
              <Button variant="outline" size="sm">Voir mon profil public</Button>
            </Link>
          )}
          <Link href="/settings">
            <Button variant="ghost" size="sm">Paramètres</Button>
          </Link>
        </div>
      </section>

      {error && (
        <Card className="p-4 mb-8 border-hf-loss/40">
          <p className="text-hf-body-sm text-hf-loss">{error}</p>
        </Card>
      )}

      {/* CTA si non lié */}
      {!user.linked && (
        <Card variant="accent" className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-hf-display-3 text-hf-navy mb-1">
              Lie ton compte Riot pour activer ton profil
            </h2>
            <p className="text-hf-body-sm text-hf-navy-soft">
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
          <div className="text-hf-eyebrow uppercase text-hf-navy-soft">Respects</div>
          <div className="font-display text-hf-display-3 text-hf-navy mt-1">
            {respects}
          </div>
          {profile && profile.weighted.respects !== respects && (
            <div className="text-hf-body-sm text-hf-navy-soft mt-1">
              pondéré · {profile.weighted.respects}
            </div>
          )}
        </Card>
        <Card className="p-6">
          <div className="text-hf-eyebrow uppercase text-hf-navy-soft">Shrooms</div>
          <div className="font-display text-hf-display-3 text-hf-navy mt-1">{shrooms}</div>
          {profile && profile.weighted.shrooms !== shrooms && (
            <div className="text-hf-body-sm text-hf-navy-soft mt-1">
              pondéré · {profile.weighted.shrooms}
            </div>
          )}
        </Card>
        <Card className="p-6">
          <div className="text-hf-eyebrow uppercase text-hf-navy-soft">Honey</div>
          <div className="font-display text-hf-display-3 text-hf-honey-text mt-1">
            {honey}
          </div>
          <div className="text-hf-body-sm text-hf-navy-soft mt-1">monnaie du shop</div>
        </Card>
        <Card className="p-6">
          <div className="text-hf-eyebrow uppercase text-hf-navy-soft">Score net</div>
          <div
            className={`font-display text-hf-display-3 mt-1 ${
              netRep > 0
                ? "text-hf-win"
                : netRep < 0
                  ? "text-hf-loss"
                  : "text-hf-navy"
            }`}
          >
            {netLabel}
          </div>
          <div className="text-hf-body-sm text-hf-navy-soft mt-1">
            respects − shrooms
          </div>
        </Card>
      </section>

      {/* Ratio + events */}
      <section className="grid md:grid-cols-[1fr_2fr] gap-4 mb-10">
        <Card className="p-6">
          <div className="text-hf-eyebrow uppercase text-hf-navy-soft mb-3">Ratio de respect</div>
          {totalEvents === 0 ? (
            <p className="text-hf-body-sm text-hf-navy-soft">
              Pas encore d&apos;évènements.
            </p>
          ) : (
            <>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-display text-hf-display-3 text-hf-navy">
                  {ratio}%
                </span>
                <span className="text-hf-body-sm text-hf-navy-soft">
                  ({respects}/{totalEvents})
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-hf-surface-alt overflow-hidden">
                <div
                  className="h-full bg-hf-honey transition-all"
                  style={{ width: `${ratio}%` }}
                />
              </div>
              <p className="text-hf-body-sm text-hf-navy-soft mt-3">
                Part de respects dans le total des évènements reçus.
              </p>
            </>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-hf-display-3 text-hf-navy">
              Évènements récents
            </h2>
            {profile && profile.recentEvents.length > 0 && (
              <span className="text-hf-body-sm text-hf-navy-soft">
                {profile.recentEvents.length} derniers
              </span>
            )}
          </div>
          {!profile || profile.recentEvents.length === 0 ? (
            <p className="text-hf-body-sm text-hf-navy-soft">
              {user.linked
                ? "Aucun évènement encore. Joue, fais-toi des amis."
                : "Lie ton compte pour voir ton historique."}
            </p>
          ) : (
            <ul className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              {profile.recentEvents.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-3 text-hf-body-sm border-b border-hf-line last:border-b-0 pb-2 last:pb-0"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Pill variant={e.type === "respect" ? "honey" : "default"}>
                      {e.type}
                    </Pill>
                    <code className="text-hf-navy-soft font-mono text-hf-body-sm truncate">
                      {e.match_id}
                    </code>
                  </span>
                  <span className="text-hf-navy-soft text-hf-body-sm whitespace-nowrap">
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
          <Button variant="outline" size="sm">Leaderboard</Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline" size="sm">Shop</Button>
        </Link>
        {user.linked && (
          <Link href="/auth/link">
            <Button variant="ghost" size="sm">Modifier mon Riot ID</Button>
          </Link>
        )}
      </section>
    </main>
  );
}
