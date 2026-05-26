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

interface SearchResult {
  discordId: string | null;
  username: string | null;
  avatarUrl: string | null;
  gameName: string | null;
  tagLine: string | null;
  linked: boolean;
}

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

// Reconnaît un Riot ID complet : gameName + (# ou -) + tagLine non vides.
function parseRiotId(input: string): { gameName: string; tagLine: string } | null {
  const trimmed = input.trim();
  const m = trimmed.match(/^([^#-]+)\s*[#-]\s*([^#-]+)$/);
  if (!m) return null;
  return { gameName: m[1].trim(), tagLine: m[2].trim() };
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("euw1");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce l'autocomplete sur les recherches "libres" (pseudo Discord ou
  // début de Riot ID). Pas la peine de spammer l'API à chaque frappe.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setError(null);
      return;
    }
    if (parseRiotId(trimmed)) {
      // Riot ID complet → pas d'autocomplete, c'est résolu au submit.
      setResults([]);
      setError(null);
      return;
    }
    const ctrl = new AbortController();
    const id = window.setTimeout(async () => {
      try {
        setError(null);
        const res = await fetch(
          `${API_URL}/profile/search?q=${encodeURIComponent(trimmed)}`,
          { signal: ctrl.signal },
        );
        if (!res.ok) throw new Error("Recherche impossible.");
        const body = await res.json();
        setResults(body.results ?? []);
      } catch (e) {
        if ((e as { name?: string }).name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Erreur inconnue.");
      }
    }, 220);
    return () => {
      ctrl.abort();
      window.clearTimeout(id);
    };
  }, [query]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setError("Entre un nom Discord ou un Riot ID.");
      return;
    }

    // 1) Riot ID complet → on vérifie auprès de Riot et on redirige sec.
    const parsed = parseRiotId(trimmed);
    if (parsed) {
      const riotId = `${parsed.gameName}-${parsed.tagLine}`;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_URL}/lol/summoner/${encodeURIComponent(riotId)}?region=${region}`,
        );
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(
              `Aucun invocateur trouvé sur ${region.toUpperCase()} pour ${parsed.gameName}#${parsed.tagLine}. Vérifie la région.`,
            );
          }
          throw new Error("Erreur lors de la recherche.");
        }
        router.push(`/profile/${encodeURIComponent(riotId)}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // 2) Texte libre → si un seul résultat lié, on y va directement. Sinon
    //    on laisse l'utilisateur cliquer dans la liste autocomplete.
    const linked = results.filter((r) => r.linked && r.gameName && r.tagLine);
    if (linked.length === 1) {
      const r = linked[0];
      router.push(
        `/profile/${encodeURIComponent(`${r.gameName}-${r.tagLine}`)}`,
      );
      return;
    }
    if (linked.length === 0) {
      setError(
        "Aucun joueur BeemoBot trouvé. Si tu cherches un Riot ID exact, utilise le format GameName#TagLine.",
      );
      return;
    }
    setError(
      `${linked.length} joueurs correspondent — clique sur celui que tu veux.`,
    );
  };

  const showAutocomplete = results.length > 0 && !parseRiotId(query.trim());

  return (
    <main className="max-w-[820px] mx-auto px-6 py-16 flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <Eyebrow>Recherche</Eyebrow>
        <h1 className="font-display text-hf-display-2 text-hf-navy">
          Trouve un joueur
        </h1>
        <p className="text-hf-body-lg text-hf-navy-soft">
          Tape un pseudo Discord, un nom Riot, ou un Riot ID complet —
          on t&apos;envoie sur son profil BeemoBot.
        </p>
      </header>

      <Card className="p-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Pseudo Discord ou Riot ID</Label>
            <Input
              id="q"
              placeholder="ex. Nunch  ·  Nunch#N7789  ·  john.doe"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              autoComplete="off"
            />
            <p className="text-hf-body-sm text-hf-navy-soft">
              Avec un <span className="font-mono">#</span> ou{" "}
              <span className="font-mono">-</span> on cherche le Riot ID
              direct (région requise). Sinon on autocomplete sur les comptes
              BeemoBot.
            </p>
          </div>

          {parseRiotId(query.trim()) && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="region">Région Riot</Label>
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
          )}

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

      {/* Résultats autocomplete (uniquement quand on cherche par texte libre) */}
      {showAutocomplete && (
        <section className="flex flex-col gap-2">
          <Eyebrow tone="navy">{results.length} résultat{results.length > 1 ? "s" : ""}</Eyebrow>
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
                    alt={`Avatar Discord de ${r.username ?? ""}`}
                    width={44}
                    height={44}
                    className="rounded-full border border-hf-line bg-hf-surface-alt shrink-0"
                  />
                ) : (
                  <div className="size-11 rounded-full bg-hf-surface-alt border border-hf-line shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-hf-navy truncate">
                    {r.username ?? "Joueur"}
                  </div>
                  {linkable ? (
                    <div className="text-hf-body-sm text-hf-navy-soft truncate">
                      {r.gameName}
                      <span className="opacity-70">#{r.tagLine}</span>
                    </div>
                  ) : (
                    <div className="text-hf-body-sm text-hf-navy-soft">
                      Pas encore de compte Riot lié
                    </div>
                  )}
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
          URL directe :{" "}
          <code className="font-mono text-hf-honey-text">
            /profile/Nunch-N7789
          </code>{" "}
          (avec un tiret entre le nom et le tag).
        </p>
      </Card>
    </main>
  );
}
