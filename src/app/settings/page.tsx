/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Eyebrow from "@/components/atoms/Eyebrow";
import { API_URL } from "@/lib/env";

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

function SettingsContent() {
  const router = useRouter();
  const [me, setMe] = useState<MeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unlinking, setUnlinking] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.replace("/");
      return;
    }
    fetch(`${API_URL}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (!r.ok) {
          const expired = r.status === 401 || r.status === 403;
          // On ne purge le token QUE si l'API rejette explicitement (401/403).
          // Sur 5xx / réseau / CORS on garde le token pour éviter de déconnecter
          // l'utilisateur à la moindre intermittence.
          if (expired) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          }
          throw new Error(expired ? "Token invalide ou expiré." : "Erreur de chargement");
        }
        return r.json();
      })
      .then((data) => setMe(data))
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleUnlink = async () => {
    if (!confirm("Délier ton compte Riot ? Ton historique reste mais tu ne pourras plus recevoir de shrooms/respects tant que tu n'es pas re-lié.")) {
      return;
    }
    setUnlinking(true);
    setError(null);
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) throw new Error("Non authentifié.");
      const res = await fetch(`${API_URL}/auth/unlink`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Échec du déliage.");
      }
      setMe((prev) =>
        prev
          ? { ...prev, puuid: null, gameName: null, tagLine: null, linked: false }
          : prev,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setUnlinking(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    router.push("/");
  };

  if (loading) {
    return (
      <main className="max-w-[800px] mx-auto px-6 py-12">
        <p className="text-text-sub-600">Chargement…</p>
      </main>
    );
  }

  if (!me) {
    return (
      <main className="max-w-[800px] mx-auto px-6 py-12">
        <Card className="p-10 text-center">
          <h1 className="text-title-h5 text-text-strong-950 !font-[600] mb-2">
            Connexion requise
          </h1>
          <p className="text-text-sub-600 mb-6">
            Connecte-toi avec Discord pour accéder à tes paramètres.
          </p>
          <Button
            variant="primary"
            onClick={() =>
              (window.location.href = `${API_URL}/auth/discord/redirect`)
            }
          >
            Se connecter avec Discord
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-[800px] mx-auto px-6 py-12">
      <header className="mb-10 flex flex-col gap-3">
        <Eyebrow>Paramètres</Eyebrow>
        <h1 className="text-title-h4 md:text-title-h3 text-text-strong-950 !font-[600]">
          Gère ton compte BeemoBot
        </h1>
        <p className="text-paragraph-md text-text-sub-600">
          Comptes liés, session, préférences — tout est ici.
        </p>
      </header>

      {error && (
        <Card className="p-4 mb-6 border-danger/40">
          <p className="text-sm text-error-base">{error}</p>
        </Card>
      )}

      {/* Compte Discord */}
      <section className="mb-8">
        <h2 className="text-label-lg text-text-strong-950 mb-3">Compte Discord</h2>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            {me.avatarUrl && (
              <Image
                src={me.avatarUrl}
                alt={`Avatar de ${me.username ?? "user"}`}
                width={56}
                height={56}
                className="rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-label-md text-text-strong-950">
                {me.username ?? "Utilisateur"}
              </div>
              {me.email && (
                <div className="text-xs text-text-sub-600 truncate">
                  {me.email}
                </div>
              )}
              <div className="text-xs text-text-sub-600 mt-0.5">
                Discord ID · <code className="font-mono">{me.discordId}</code>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Compte Riot */}
      <section className="mb-8">
        <h2 className="text-label-lg text-text-strong-950 mb-3">Compte Riot</h2>
        {me.linked ? (
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-label-md text-text-strong-950">
                    {me.gameName}
                    <span className="text-text-sub-600">#{me.tagLine}</span>
                  </span>
                  <Badge variant="accent">Lié</Badge>
                </div>
                <p className="text-xs text-text-sub-600">
                  Ton historique de réputation est suivi sur ce compte.
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/u/${encodeURIComponent(`${me.gameName}-${me.tagLine}`)}`}
                >
                  <Button variant="secondary" size="sm">
                    Voir le profil
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUnlink}
                  disabled={unlinking}
                >
                  {unlinking ? "…" : "Délier"}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-label-md text-text-strong-950">
                    Aucun compte lié
                  </span>
                  <Badge variant="gold">Recommandé</Badge>
                </div>
                <p className="text-sm text-text-sub-600">
                  Lie ton compte Riot pour cumuler tes shrooms, respects et
                  honey.
                </p>
              </div>
              <Link href="/auth/link">
                <Button variant="primary">Lier mon compte Riot</Button>
              </Link>
            </div>
          </Card>
        )}
      </section>

      {/* Session */}
      <section>
        <h2 className="text-label-lg text-text-strong-950 mb-3">Session</h2>
        <Card className="p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-text-sub-600">
              Te déconnecter supprime le token local. Tu pourras te reconnecter
              à tout moment.
            </p>
            <Button variant="ghost" onClick={handleLogout}>
              Se déconnecter
            </Button>
          </div>
        </Card>
      </section>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <main className="max-w-[800px] mx-auto px-6 py-12">
          <p className="text-text-sub-600">Chargement…</p>
        </main>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
