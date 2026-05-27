/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/_design/Card";
import { Button } from "@/components/_design/Button";
import { Pill } from "@/components/_design/Pill";
import { Eyebrow } from "@/components/_design/Eyebrow";
import { cn } from "@/lib/design/cn";
import { API_URL } from "@/lib/env";

type SearchMode = "discord" | "riot";

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

function ModeToggle({
  mode,
  onChange,
}: {
  mode: SearchMode;
  onChange: (m: SearchMode) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Type de recherche"
      className="inline-flex rounded-hf-pill border border-hf-line bg-hf-surface p-1"
    >
      {(["discord", "riot"] as SearchMode[]).map((m) => (
        <button
          key={m}
          type="button"
          role="radio"
          aria-checked={mode === m}
          onClick={() => onChange(m)}
          className={cn(
            "h-9 px-4 rounded-hf-pill text-hf-body-sm font-semibold transition-colors",
            mode === m
              ? m === "discord"
                ? "bg-hf-discord text-white"
                : "bg-hf-honey text-hf-navy"
              : "text-hf-navy-soft hover:text-hf-navy",
          )}
        >
          {m === "discord" ? "Discord" : "Riot"}
        </button>
      ))}
    </div>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const [mode, setMode] = useState<SearchMode>("discord");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("euw1");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset results quand on switch de mode pour éviter les fantômes.
  useEffect(() => {
    setResults([]);
    setError(null);
  }, [mode]);

  // Autocomplete debouncé sur le mode courant.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setError(null);
      return;
    }
    const ctrl = new AbortController();
    const id = window.setTimeout(async () => {
      try {
        setError(null);
        const res = await fetch(
          `${API_URL}/profile/search?q=${encodeURIComponent(trimmed)}&mode=${mode}&limit=${MAX_RESULTS}`,
          { signal: ctrl.signal },
        );
        if (!res.ok) throw new Error("Recherche impossible.");
        const body = await res.json();
        setResults((body.results ?? []).slice(0, MAX_RESULTS));
      } catch (e) {
        if ((e as { name?: string }).name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Erreur inconnue.");
      }
    }, DEBOUNCE_MS);
    return () => {
      ctrl.abort();
      window.clearTimeout(id);
    };
  }, [query, mode]);

  const riotIdExact = parseRiotId(query);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setError(
        mode === "discord"
          ? "Tape un pseudo Discord."
          : "Tape un nom Riot (Nunch) ou un Riot ID complet (Nunch#N7789).",
      );
      return;
    }

    // Si on tape un Riot ID exact ET on est en mode Riot → tentative de
    // résolution cross-région auprès de Riot (couvre les comptes jamais
    // vus par BeemoBot).
    if (riotIdExact && mode === "riot") {
      const riotId = `${riotIdExact.gameName}-${riotIdExact.tagLine}`;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_URL}/lol/summoner/${encodeURIComponent(riotId)}?region=${region}`,
        );
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(
              `Aucun invocateur ${riotIdExact.gameName}#${riotIdExact.tagLine} sur ${region.toUpperCase()}. Vérifie la région.`,
            );
          }
          throw new Error("Erreur lors de la résolution Riot.");
        }
        router.push(`/profile/${encodeURIComponent(riotId)}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Sinon : on attend que l'utilisateur clique dans la liste d'autocomplete.
    if (results.length === 0) {
      setError(
        mode === "discord"
          ? "Aucun pseudo Discord trouvé sur BeemoBot."
          : "Aucun Riot ID trouvé sur BeemoBot. Tape le Riot ID complet (Nunch#N7789) + choisis une région pour chercher cross-région.",
      );
      return;
    }
    const linked = results.find((r) => r.linked && r.gameName && r.tagLine);
    if (linked) {
      router.push(
        `/profile/${encodeURIComponent(`${linked.gameName}-${linked.tagLine}`)}`,
      );
      return;
    }
    setError("Aucun résultat n'a de compte Riot lié.");
  };

  const placeholder =
    mode === "discord"
      ? "ex. nunch, john.doe, lavarobeu…"
      : "ex. Nunch ou Nunch#N7789";

  const showRegion = mode === "riot" && riotIdExact !== null;

  return (
    <main className="max-w-[820px] mx-auto px-6 py-16 flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <Eyebrow>Recherche</Eyebrow>
        <h1 className="font-display text-hf-display-2 text-hf-navy">
          Trouve un joueur
        </h1>
        <p className="text-hf-body-lg text-hf-navy-soft">
          Choisis ton mode, tape ton texte — les résultats apparaissent au fur
          et à mesure.
        </p>
      </header>

      <Card className="p-6 flex flex-col gap-5">
        <div className="flex items-center gap-3 flex-wrap">
          <ModeToggle mode={mode} onChange={setMode} />
          <span className="text-hf-body-sm text-hf-navy-soft">
            {mode === "discord"
              ? "Cherche dans les pseudos Discord BeemoBot."
              : "Cherche dans les Riot IDs BeemoBot. Tape un Riot ID complet pour fouiller cross-région."}
          </span>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            id="q"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            autoComplete="off"
            className="h-12 w-full rounded-hf-btn border border-hf-line bg-hf-surface px-4 text-hf-body-lg text-hf-navy placeholder:text-hf-navy-soft/60 focus-visible:outline-none focus-visible:border-hf-honey focus-visible:ring-2 focus-visible:ring-hf-honey-glow transition-colors"
          />

          {showRegion && (
            <div className="flex items-center gap-3 flex-wrap">
              <label
                htmlFor="region"
                className="text-hf-eyebrow uppercase tracking-wider text-hf-navy-soft"
              >
                Région Riot
              </label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="h-10 rounded-hf-btn border border-hf-line bg-hf-surface px-3 text-hf-body text-hf-navy focus-visible:outline-none focus-visible:border-hf-honey focus-visible:ring-2 focus-visible:ring-hf-honey-glow transition-colors"
              >
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <div className="rounded-hf-btn border border-hf-loss/40 bg-hf-loss/10 p-3">
              <p className="text-hf-body-sm text-hf-loss">{error}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button type="submit" variant="primary" size="md" disabled={loading}>
              {loading
                ? "Recherche…"
                : riotIdExact && mode === "riot"
                  ? `Chercher ${riotIdExact.gameName}#${riotIdExact.tagLine} sur ${region.toUpperCase()}`
                  : "Voir le profil"}
            </Button>
            <span className="text-hf-body-sm text-hf-navy-soft">
              ou clique un résultat ci-dessous
            </span>
          </div>
        </form>
      </Card>

      {/* Résultats autocomplete (5 max) */}
      {results.length > 0 && (
        <section className="flex flex-col gap-2">
          <Eyebrow tone="navy">
            {results.length} résultat{results.length > 1 ? "s" : ""}
            {results.length === MAX_RESULTS ? " (les 5 premiers)" : ""}
          </Eyebrow>
          {results.map((r) => {
            const linkable = r.linked && r.gameName && r.tagLine;
            const href = linkable
              ? `/profile/${encodeURIComponent(`${r.gameName}-${r.tagLine}`)}`
              : null;
            const inner = (
              <Card
                variant={linkable ? "interactive" : "default"}
                className="!p-4 flex items-center gap-4"
              >
                {r.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.avatarUrl}
                    alt={`Avatar de ${r.username ?? ""}`}
                    width={44}
                    height={44}
                    className="rounded-full border border-hf-line bg-hf-surface-alt shrink-0"
                  />
                ) : (
                  <div className="size-11 rounded-full bg-hf-surface-alt border border-hf-line shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-hf-navy truncate">
                    {mode === "riot" && r.gameName
                      ? `${r.gameName}#${r.tagLine ?? "?"}`
                      : (r.username ?? "Joueur")}
                  </div>
                  <div className="text-hf-body-sm text-hf-navy-soft truncate">
                    {mode === "riot" && r.gameName
                      ? r.username
                        ? `Discord · ${r.username}`
                        : "Non lié à un Discord"
                      : linkable
                        ? `Riot · ${r.gameName}#${r.tagLine}`
                        : "Pas encore de compte Riot lié"}
                  </div>
                </div>
                {linkable ? (
                  <Pill variant="honey">Voir →</Pill>
                ) : (
                  <Pill variant="default">Non lié</Pill>
                )}
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

      <Card variant="accent" className="p-6">
        <Eyebrow>Astuce</Eyebrow>
        <p className="text-hf-body text-hf-navy mt-2">
          Tu peux raffiner un Riot ID en tapant son tag :{" "}
          <code className="font-mono text-hf-honey-text">Nunch#N7</code>{" "}
          matche{" "}
          <code className="font-mono text-hf-honey-text">Nunch#N7789</code>.
          Pour un compte jamais vu par BeemoBot, tape le Riot ID complet en
          mode Riot.
        </p>
      </Card>
    </main>
  );
}
