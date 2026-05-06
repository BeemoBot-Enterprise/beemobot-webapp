/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/env";
import Button from "@/components/atoms/Button";

const REGIONS = ["euw1", "eun1", "na1", "br1", "jp1", "kr", "la1", "la2", "oc1", "tr1", "ru"];
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
      const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
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
        alert(`🎉 Tu avais ${data.phantomEvents} events de réputation en attente — ils sont maintenant à toi !`);
      }
      router.push(`/u/${data.gameName}-${data.tagLine}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[#0f1117]">
      <form onSubmit={submit} className="bg-[#1a1d28] p-8 rounded-xl border border-gray-700/30 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-2">Lie ton compte Riot</h1>
        <p className="text-gray-400 mb-6">
          Une seule fois. Sans ça, tu ne peux pas donner de shrooms ou de respects.
        </p>
        <label className="block text-sm text-gray-300 mb-1">Game name</label>
        <input
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 bg-[#0f1117] border border-gray-700 rounded text-white"
        />
        <label className="block text-sm text-gray-300 mb-1">Tag line</label>
        <input
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 bg-[#0f1117] border border-gray-700 rounded text-white"
        />
        <label className="block text-sm text-gray-300 mb-1">Région</label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full mb-6 px-3 py-2 bg-[#0f1117] border border-gray-700 rounded text-white"
        >
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r.toUpperCase()}
            </option>
          ))}
        </select>
        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
          {loading ? "Vérification..." : "Lier le compte"}
        </Button>
      </form>
    </main>
  );
}
