/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RiSearchLine, RiLoader4Line } from "@remixicon/react";
import { Card } from "@/components/_design/Card";
import { Eyebrow } from "@/components/_design/Eyebrow";
import { API_URL } from "@/lib/env";

interface SearchResult {
  discordId: string | null;
  username: string | null;
  avatarUrl: string | null;
  gameName: string | null;
  tagLine: string | null;
  linked: boolean;
}

const MAX_RESULTS = 5;
const DEBOUNCE_MS = 220;

function parseRiotId(input: string): { gameName: string; tagLine: string } | null {
  const trimmed = input.trim();
  const m = trimmed.match(/^([^#-]+)\s*[#-]\s*([^#-]+)$/);
  if (!m) return null;
  return { gameName: m[1].trim(), tagLine: m[2].trim() };
}

// Profile URL : route Riot canonique si lié, fallback sur la route Discord
// pour les utilisateurs qui ont un compte Beemo mais pas encore lié à Riot.
function profileHref(r: SearchResult): string | null {
  if (r.linked && r.gameName && r.tagLine) {
    return `/profile/${encodeURIComponent(`${r.gameName}-${r.tagLine}`)}`;
  }
  if (r.discordId) {
    return `/profile/discord/${encodeURIComponent(r.discordId)}`;
  }
  return null;
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setError(null);
      setSearching(false);
      return;
    }
    const ctrl = new AbortController();
    const id = window.setTimeout(async () => {
      setSearching(true);
      try {
        setError(null);
        const res = await fetch(
          `${API_URL}/profile/search?q=${encodeURIComponent(trimmed)}&mode=both&limit=${MAX_RESULTS}`,
          { signal: ctrl.signal },
        );
        if (!res.ok) throw new Error("Recherche indisponible.");
        const body = await res.json();
        setResults((body.results ?? []).slice(0, MAX_RESULTS));
      } catch (e) {
        if ((e as { name?: string }).name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Erreur inconnue.");
      } finally {
        setSearching(false);
      }
    }, DEBOUNCE_MS);
    return () => {
      ctrl.abort();
      window.clearTimeout(id);
    };
  }, [query]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseRiotId(query);
    if (parsed) {
      router.push(
        `/profile/${encodeURIComponent(`${parsed.gameName}-${parsed.tagLine}`)}`,
      );
      return;
    }
    // Premier résultat exploitable (linké ou pas — la route Discord
    // marche dans les deux cas si on a un discordId).
    const first = results.find((r) => profileHref(r) !== null);
    if (first) {
      const href = profileHref(first);
      if (href) router.push(href);
      return;
    }
    setError("Aucun résultat. Tape plus de caractères ou utilise le format Nunch#N7789.");
  };

  return (
    <main className="max-w-[680px] mx-auto px-6 py-16 flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Eyebrow>Recherche</Eyebrow>
        <h1 className="font-display text-hf-display-2 text-hf-navy">
          Trouve un joueur
        </h1>
        <p className="text-hf-body text-hf-navy-soft">
          Tape un pseudo Discord, un nom Riot, ou un Riot ID complet
          (<span className="font-mono">Nunch#N7789</span>).
        </p>
      </header>

      <form onSubmit={onSubmit} className="relative">
        <RiSearchLine
          className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-hf-navy-soft pointer-events-none"
          aria-hidden
        />
        <input
          type="text"
          placeholder="Nunch, john.doe, Nunch#N7789…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          autoComplete="off"
          aria-label="Pseudo Discord ou Riot ID"
          className="h-14 w-full rounded-hf-card border border-hf-line bg-hf-surface pl-12 pr-12 text-hf-body-lg text-hf-navy placeholder:text-hf-navy-soft/60 focus-visible:outline-none focus-visible:border-hf-honey focus-visible:ring-2 focus-visible:ring-hf-honey-glow transition-colors"
        />
        {searching && (
          <RiLoader4Line
            className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-hf-honey animate-spin pointer-events-none"
            aria-hidden
          />
        )}
      </form>

      {error && (
        <div className="rounded-hf-btn border border-hf-loss/40 bg-hf-loss/10 p-3">
          <p className="text-hf-body-sm text-hf-loss">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <section className="flex flex-col gap-2">
          {results.map((r) => {
            const href = profileHref(r);
            const inner = (
              <Card
                variant={href ? "interactive" : "default"}
                className="!p-4 flex items-center gap-4"
              >
                {r.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.avatarUrl}
                    alt={`Avatar de ${r.username ?? ""}`}
                    width={44}
                    height={44}
                    className="size-11 rounded-full border border-hf-line bg-hf-surface-alt shrink-0 object-cover"
                  />
                ) : (
                  <div className="size-11 rounded-full bg-hf-surface-alt border border-hf-line shrink-0 flex items-center justify-center text-hf-navy-soft text-hf-body font-bold">
                    {(r.username ?? r.gameName ?? "?").slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-hf-navy truncate flex items-center gap-2">
                    {r.username ?? r.gameName ?? "Joueur"}
                    {r.linked && (
                      <span
                        className="inline-block size-1.5 rounded-full bg-hf-win shrink-0"
                        aria-label="Compte lié"
                        title="Compte lié à Riot"
                      />
                    )}
                  </div>
                  <div className="text-hf-body-sm text-hf-navy-soft truncate">
                    {r.linked && r.gameName ? (
                      <>
                        <span className="font-medium text-hf-navy">
                          {r.gameName}
                        </span>
                        <span className="opacity-70">#{r.tagLine}</span>
                        <span className="opacity-50"> · Riot lié</span>
                      </>
                    ) : (
                      <>
                        Discord {r.discordId ? `· ID ${r.discordId.slice(-6)}` : ""}
                        <span className="opacity-50"> · Non lié à Riot</span>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
            return href ? (
              <Link key={r.discordId ?? r.username} href={href} className="block">
                {inner}
              </Link>
            ) : (
              <div key={r.discordId ?? r.username}>{inner}</div>
            );
          })}
        </section>
      )}

      {!searching &&
        query.trim().length >= 2 &&
        results.length === 0 &&
        !error && (
          <p className="text-hf-body-sm text-hf-navy-soft text-center">
            Aucun joueur BeemoBot ne correspond. Si tu connais le Riot ID
            complet, tape-le pour atterrir directement sur son profil.
          </p>
        )}
    </main>
  );
}
