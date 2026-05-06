/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import { fetchProfileByRiotId } from "@/lib/api";
import { notFound } from "next/navigation";
import { Card } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

interface Props {
  params: Promise<{ riotId: string }>;
}

export default async function PublicProfilePage({ params }: Props) {
  const { riotId } = await params;
  const decoded = decodeURIComponent(riotId);
  const sep = decoded.lastIndexOf("-");
  if (sep < 1) return notFound();
  const gameName = decoded.slice(0, sep);
  const tagLine = decoded.slice(sep + 1);

  const profile = await fetchProfileByRiotId(gameName, tagLine);
  if (!profile) return notFound();

  const netRep = profile.counts.respects - profile.counts.shrooms;
  const netLabel = netRep >= 0 ? `+${netRep}` : `${netRep}`;

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <header className="flex items-center justify-between flex-wrap gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-semibold text-text">
            {profile.gameName}
            <span className="text-text-muted"> #{profile.tagLine}</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">Profil public Riot</p>
        </div>
        {!profile.linked && (
          <Badge variant="gold">Compte non lié</Badge>
        )}
      </header>

      {!profile.linked && (
        <Card className="p-4 mb-8">
          <p className="text-sm text-text-muted">
            La réputation s’accumule en attendant que ce joueur lie son compte
            Discord.
          </p>
        </Card>
      )}

      <section className="grid md:grid-cols-3 gap-4 mb-10">
        <Card className="p-6">
          <div className="text-sm text-text-muted">Respects</div>
          <div className="text-3xl font-semibold text-text mt-1">
            {profile.counts.respects}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-text-muted">Shrooms</div>
          <div className="text-3xl font-semibold text-text mt-1">
            {profile.counts.shrooms}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-text-muted">Honey</div>
          <div className="text-3xl font-semibold text-text mt-1">
            {profile.honey}
          </div>
        </Card>
      </section>

      <section className="grid md:grid-cols-[1fr_2fr] gap-4">
        <Card className="p-6">
          <div className="text-sm text-text-muted mb-1">Score net</div>
          <div className="text-3xl font-semibold text-text">{netLabel}</div>
          <p className="text-xs text-text-muted mt-2">
            Respects − shrooms (immuable).
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-base font-semibold text-text mb-4">
            Évènements récents
          </h2>
          {profile.recentEvents.length === 0 ? (
            <p className="text-sm text-text-muted">Aucun évènement encore.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {profile.recentEvents.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-3 text-sm border-b border-border last:border-b-0 pb-2 last:pb-0"
                >
                  <span className="flex items-center gap-2">
                    <Badge
                      variant={e.type === "respect" ? "accent" : "default"}
                    >
                      {e.type}
                    </Badge>
                    <code className="text-text-muted font-mono text-xs">
                      {e.match_id}
                    </code>
                  </span>
                  <span className="text-text-muted text-xs">
                    weight {e.weight}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </main>
  );
}
