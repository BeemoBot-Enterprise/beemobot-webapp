/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import { API_URL } from "@/lib/env";

const REGIONS = [
  "euw1",
  "eun1",
  "na1",
  "br1",
  "jp1",
  "kr",
  "la1",
  "la2",
  "oc1",
  "tr1",
  "ru",
];
const TOKEN_KEY = "beemobot_token";

export default function LinkPage() {
  const router = useRouter();
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [region, setRegion] = useState("euw1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem(TOKEN_KEY)
          : null;
      if (!token) throw new Error("Token Discord manquant. Reconnecte-toi.");

      const res = await fetch(`${API_URL}/auth/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameName, tagLine, region }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Échec de la liaison.");
      }
      const data = await res.json();
      if (data.phantomEvents && data.phantomEvents > 0) {
        alert(
          `Tu avais ${data.phantomEvents} events de réputation en attente — ils sont maintenant à toi !`,
        );
      }
      router.push(`/u/${data.gameName}-${data.tagLine}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12">
      <Card className="max-w-md w-full p-8">
        <h1 className="text-2xl font-semibold text-text mb-2">
          Lie ton compte Riot
        </h1>
        <p className="text-text-muted mb-6 text-sm">
          Une seule fois. Sans ça, tu ne peux pas donner de shrooms ou de
          respects.
        </p>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gameName">Game name</Label>
            <Input
              id="gameName"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tagLine">Tag line</Label>
            <Input
              id="tagLine"
              value={tagLine}
              onChange={(e) => setTagLine(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="region">Région</Label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Vérification…" : "Lier le compte"}
            </Button>
            <Link
              href="/"
              className="text-sm text-text-muted hover:text-text transition-colors"
            >
              Retour
            </Link>
          </div>
        </form>
      </Card>
    </main>
  );
}
