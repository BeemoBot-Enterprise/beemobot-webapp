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

const TOKEN_KEY = "beemobot_token";

function Spinner() {
  return (
    <svg
      className="animate-spin h-8 w-8 text-text-muted"
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
        <p className="text-text-muted">Connexion en cours…</p>
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

    fetch(`${API_URL}/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((profile) => {
        if (!profile?.linked) {
          router.replace("/auth/link");
        } else {
          router.replace(`/u/${profile.gameName}-${profile.tagLine}`);
        }
      })
      .catch(() => router.replace("/auth/link"));
  }, [params, router]);

  if (error) {
    return (
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-semibold text-text mb-2">
            Connexion impossible
          </h1>
          <p className="text-text-muted mb-6">
            Une erreur est survenue : <code className="text-text">{error}</code>
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
        <p className="text-text-muted">Connexion en cours…</p>
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
