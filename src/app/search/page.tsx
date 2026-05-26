/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/_design/Card";
import { Button } from "@/components/_design/Button";
import { Eyebrow } from "@/components/_design/Eyebrow";
import { API_URL } from "@/lib/env";

const REGIONS: { value: string; label: string }[] = [
  { value: "euw1", label: "EUW" },
  { value: "eun1", label: "EUNE" },
  { value: "na1", label: "NA" },
  { value: "br1", label: "BR" },
  { value: "jp1", label: "JP" },
  { value: "kr", label: "KR" },
  { value: "la1", label: "LAN" },
  { value: "la2", label: "LAS" },
  { value: "oc1", label: "OCE" },
  { value: "tr1", label: "TR" },
  { value: "ru", label: "RU" },
];

function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-hf-eyebrow uppercase tracking-wider text-hf-navy-soft">
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "h-11 w-full rounded-hf-btn border border-hf-line bg-hf-surface px-3 text-hf-body text-hf-navy " +
        "placeholder:text-hf-navy-soft/60 focus-visible:outline-none focus-visible:border-hf-honey " +
        "focus-visible:ring-2 focus-visible:ring-hf-honey-glow transition-colors"
      }
    />
  );
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("euw1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setError("Entre un Riot ID au format GameName#TagLine.");
      return;
    }
    // Accepte les deux séparateurs courants (# saisi par l'utilisateur, - dans
    // les URLs Riot officielles). On normalise en `-` pour notre route /profile/.
    const normalized = trimmed.replace("#", "-");
    if (!normalized.includes("-")) {
      setError("Format attendu : GameName#TagLine (ex. Nunch#N7789).");
      return;
    }

    setLoading(true);
    setError(null);

    // On vérifie que le compte existe avant de naviguer, sinon on tombe sur
    // une 404 de /profile/ sans message clair. Cheap : un seul HEAD-equivalent.
    try {
      const res = await fetch(
        `${API_URL}/lol/summoner/${encodeURIComponent(normalized)}?region=${region}`,
      );
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(
            `Aucun invocateur trouvé. Vérifie le format (ex. Nunch#N7789) et la région (${region.toUpperCase()}).`,
          );
        }
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? "Erreur lors de la recherche.");
      }
      router.push(`/profile/${encodeURIComponent(normalized)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-[800px] mx-auto px-6 py-16 flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <Eyebrow>Recherche</Eyebrow>
        <h1 className="font-display text-hf-display-2 text-hf-navy">
          Trouve n&apos;importe quel summoner
        </h1>
        <p className="text-hf-body-lg text-hf-navy-soft">
          Tape un Riot ID, choisis la région, on t&apos;envoie sur son profil
          BeemoBot avec stats, ranks et 4 dernières games.
        </p>
      </header>

      <Card className="p-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Riot ID</Label>
            <Input
              id="q"
              placeholder="Nunch#N7789"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <p className="text-hf-body-sm text-hf-navy-soft">
              Sépare avec <span className="font-mono">#</span> ou{" "}
              <span className="font-mono">-</span>. Le tag est obligatoire.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="region">Région</Label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="h-11 w-full rounded-hf-btn border border-hf-line bg-hf-surface px-3 text-hf-body text-hf-navy focus-visible:outline-none focus-visible:border-hf-honey focus-visible:ring-2 focus-visible:ring-hf-honey-glow transition-colors"
            >
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-hf-btn border border-hf-loss/40 bg-hf-loss/10 p-3">
              <p className="text-hf-body-sm text-hf-loss">{error}</p>
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? "Recherche…" : "Voir le profil"}
          </Button>
        </form>
      </Card>

      <Card variant="accent" className="p-6">
        <Eyebrow>Astuce</Eyebrow>
        <p className="text-hf-body text-hf-navy mt-2">
          Tu peux aussi passer directement par l&apos;URL :{" "}
          <code className="font-mono text-hf-honey-text">
            /profile/Nunch-N7789
          </code>{" "}
          (avec un tiret entre le nom et le tag).
        </p>
      </Card>
    </main>
  );
}
