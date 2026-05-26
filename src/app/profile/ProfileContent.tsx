/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/_design/Card";
import { Button } from "@/components/_design/Button";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProfileErrorBoundary } from "@/components/profile/ProfileErrorBoundary";
import { API_URL } from "@/lib/env";
import { fetchProfileByRiotId, type FullProfile } from "@/lib/api";

interface MeData {
  discordId: string | null;
  username: string | null;
  email: string | null;
  avatarUrl: string | null;
  puuid: string | null;
  gameName: string | null;
  tagLine: string | null;
  linked: boolean;
}

const TOKEN_KEY = "beemobot_token";
const USER_KEY = "beemobot_user";

export default function ProfileContent() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [me, setMe] = useState<MeData | null>(null);
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Bootstrap token (URL post-callback ou localStorage).
  useEffect(() => {
    if (typeof window === "undefined") return;

    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      localStorage.setItem(TOKEN_KEY, tokenFromUrl);
      setToken(tokenFromUrl);
      return;
    }

    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) setToken(stored);
  }, [searchParams]);

  // 2. Charge /profile/me + le FullProfile (Beemo + LoL) si lié.
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const meResponse = await fetch(`${API_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meResponse.ok) {
          const expired =
            meResponse.status === 401 || meResponse.status === 403;
          if (expired) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setToken(null);
          }
          throw new Error(
            expired ? "Session expirée." : "Impossible de charger le profil.",
          );
        }
        const meData: MeData = await meResponse.json();
        setMe(meData);
        localStorage.setItem(USER_KEY, JSON.stringify(meData));

        // Si le compte Riot est lié, on récupère le profil riche (stats +
        // ranks + matches) via le même endpoint que pour les profils publics.
        if (meData.linked && meData.gameName && meData.tagLine) {
          const full = await fetchProfileByRiotId(
            meData.gameName,
            meData.tagLine,
          );
          setProfile(full);
        } else {
          setProfile(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/discord/redirect`;
  };

  if (loading) {
    return (
      <main className="max-w-[1100px] mx-auto px-6 py-16">
        <p className="text-hf-navy-soft">Chargement de ton profil…</p>
      </main>
    );
  }

  // Pas connecté → écran d'invitation login Discord.
  if (!token || !me) {
    return (
      <main className="max-w-[600px] mx-auto px-6 py-16">
        <Card variant="accent" className="text-center">
          <h1 className="font-display text-hf-display-2 text-hf-navy mb-2">
            Ton profil t&apos;attend
          </h1>
          <p className="text-hf-body text-hf-navy-soft mb-6">
            Connecte-toi avec Discord pour voir tes shrooms, respects, honey,
            classements et derniers matchs sur un seul écran.
          </p>
          {error && (
            <p className="text-hf-body-sm text-hf-loss mb-4">{error}</p>
          )}
          <Button onClick={handleLogin} variant="primary" size="lg">
            Se connecter avec Discord
          </Button>
        </Card>
      </main>
    );
  }

  // Connecté : on rend TOUJOURS la vue partagée, même si pas (encore) lié à
  // Riot. L'utilisateur n'est pas obligé de lier — on veut au moins lui
  // montrer son identité Discord et un CTA discret. Quand pas lié, on bâtit
  // un FullProfile-stub (compteurs à 0, pas de LoL data) pour que ProfileView
  // s'affiche normalement.
  const renderProfile = profile ?? {
    puuid: "",
    gameName: null,
    tagLine: null,
    linked: false,
    counts: { respects: 0, shrooms: 0 },
    weighted: { respects: 0, shrooms: 0 },
    honey: 0,
    recentEvents: [],
    lol: null,
  };

  return (
    <ProfileErrorBoundary>
      {error && (
        <div className="max-w-[1100px] mx-auto px-6 pt-6">
          <Card className="border-hf-loss/40 bg-hf-loss/5">
            <p className="text-hf-body-sm text-hf-loss">{error}</p>
          </Card>
        </div>
      )}
      <ProfileView
        profile={renderProfile}
        discordName={me.username ?? "Joueur"}
        discordAvatarUrl={me.avatarUrl}
        fallbackGameName={me.gameName ?? undefined}
        fallbackTagLine={me.tagLine ?? undefined}
        ownerActions={
          <>
            {!me.linked && (
              <Link href="/auth/link">
                <Button variant="primary" size="sm">
                  Lier mon compte Riot
                </Button>
              </Link>
            )}
            <Link href="/settings">
              <Button variant="outline" size="sm">
                Paramètres
              </Button>
            </Link>
            {me.linked && (
              <Link href="/auth/link">
                <Button variant="ghost" size="sm">
                  Modifier mon Riot ID
                </Button>
              </Link>
            )}
          </>
        }
      />
    </ProfileErrorBoundary>
  );
}
