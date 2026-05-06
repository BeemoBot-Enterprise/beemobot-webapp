/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/env";

const TOKEN_KEY = "beemobot_token";

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      router.replace("/");
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

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f1117]">
      <p className="text-white text-lg">Connexion...</p>
    </main>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-[#0f1117]">
          <p className="text-white text-lg">Connexion...</p>
        </main>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
