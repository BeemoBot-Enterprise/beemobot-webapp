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
        <div className="flex flex-col gap-2">
          <span className="text-subheading-2xs text-text-soft-400">
            Profil public · Riot ID
          </span>
          <h1 className="text-title-h4 md:text-title-h3 text-text-strong-950 !font-[600]">
            {profile.gameName}
            <span className="text-text-sub-600"> #{profile.tagLine}</span>
          </h1>
        </div>
        {!profile.linked && (
          <span className="inline-flex items-center gap-2 rounded-full border border-warning-base/30 bg-warning-lighter px-3 py-1.5 text-label-xs text-warning-base">
            <span className="size-1.5 rounded-full bg-warning-base" />
            Compte non lié
          </span>
        )}
      </header>

      {!profile.linked && (
        <Card className="p-4 mb-8">
          <p className="text-sm text-text-sub-600">
            La réputation s’accumule en attendant que ce joueur lie son compte
            Discord.
          </p>
        </Card>
      )}

      <section className="grid md:grid-cols-3 gap-4 mb-10">
        <Card className="p-6 rounded-20 border-stroke-soft-200 bg-bg-weak-50">
          <div className="text-subheading-2xs text-text-soft-400">Respects</div>
          <div className="text-title-h4 text-text-strong-950 !font-[600] mt-2 tabular-nums">
            {profile.counts.respects}
          </div>
        </Card>
        <Card className="p-6 rounded-20 border-stroke-soft-200 bg-bg-weak-50">
          <div className="text-subheading-2xs text-text-soft-400">Shrooms</div>
          <div className="text-title-h4 text-text-strong-950 !font-[600] mt-2 tabular-nums">
            {profile.counts.shrooms}
          </div>
        </Card>
        <Card className="p-6 rounded-20 border-stroke-soft-200 bg-bg-weak-50">
          <div className="text-subheading-2xs text-text-soft-400">Honey</div>
          <div className="text-title-h4 text-warning-base !font-[600] mt-2 tabular-nums">
            {profile.honey}
          </div>
        </Card>
      </section>

      <section className="grid md:grid-cols-[1fr_2fr] gap-4">
        <Card className="p-6">
          <div className="text-sm text-text-sub-600 mb-1">Score net</div>
          <div className="text-title-h3 text-text-strong-950 !font-[600]">{netLabel}</div>
          <p className="text-xs text-text-sub-600 mt-2">
            Respects − shrooms (immuable).
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-label-md text-text-strong-950 mb-4">
            Évènements récents
          </h2>
          {profile.recentEvents.length === 0 ? (
            <p className="text-sm text-text-sub-600">Aucun évènement encore.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {profile.recentEvents.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-3 text-sm border-b border-stroke-soft-200 last:border-b-0 pb-2 last:pb-0"
                >
                  <span className="flex items-center gap-2">
                    <Badge
                      variant={e.type === "respect" ? "accent" : "default"}
                    >
                      {e.type}
                    </Badge>
                    <code className="text-text-sub-600 font-mono text-xs">
                      {e.match_id}
                    </code>
                  </span>
                  <span className="text-text-sub-600 text-xs">
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
