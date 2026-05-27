/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import { API_URL } from "@/lib/env";
import { setUser } from "@/lib/store/user";

const TOKEN_KEY = "beemobot_token";
const RETURN_TO_KEY = "beemobot_return_to";

// N'autorise que les chemins internes (commençant par "/" mais pas "//"
// qui serait un protocol-relative URL). Évite l'open-redirect.
function safeReturnTo(value: string | null): string | null {
  if (!value) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  return value;
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-8 w-8 text-text-sub-600"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.2"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CallbackFallback() {
  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4">
        <Spinner />
        <p className="text-text-sub-600">Connexion en cours…</p>
      </div>
    </main>
  );
}

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = params.get("token");
    const err = params.get("error");

    if (err) {
      setError(err);
      return;
    }
    if (!token) {
      setError("missing_token");
      return;
    }

    localStorage.setItem(TOKEN_KEY, token);

    const returnTo = safeReturnTo(localStorage.getItem(RETURN_TO_KEY));
    if (returnTo) {
      localStorage.removeItem(RETURN_TO_KEY);
      router.replace(returnTo);
      return;
    }

    fetch(`${API_URL}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((profile) => {
        // On persiste tout de suite le profil pour que useAuth voie l'utilisateur
        // comme connecté sans refaire un /profile/me au prochain mount.
        if (profile) setUser(profile);
        // Toujours rediriger sur /profile (page propre) : elle gère elle-même
        // le cas non-lié (CTA "Lier mon compte Riot") et le cas lié (vue
        // complète). Garde une URL canonique stable pour l'utilisateur.
        router.replace("/profile");
      })
      .catch(() => router.replace("/profile"));
  }, [params, router]);

  if (error) {
    return (
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-title-h5 text-text-strong-950 !font-[600] mb-2">
            Connexion impossible
          </h1>
          <p className="text-text-sub-600 mb-6">
            Une erreur est survenue : <code className="text-text-strong-950">{error}</code>
          </p>
          <Link href="/">
            <Button variant="primary">Retour à l&apos;accueil</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4">
        <Spinner />
        <p className="text-text-sub-600">Connexion en cours…</p>
      </div>
    </main>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <CallbackContent />
    </Suspense>
  );
}
