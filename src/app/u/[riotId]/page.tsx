/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import { fetchProfileByRiotId } from "@/lib/api";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ riotId: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { riotId } = await params;
  const decoded = decodeURIComponent(riotId);
  const sep = decoded.lastIndexOf("-");
  if (sep < 1) return notFound();
  const gameName = decoded.slice(0, sep);
  const tagLine = decoded.slice(sep + 1);

  const profile = await fetchProfileByRiotId(gameName, tagLine);
  if (!profile) return notFound();

  const netRep = profile.counts.respects - profile.counts.shrooms;

  return (
    <main className="min-h-screen bg-[#0f1117] py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            {profile.gameName}
            <span className="text-gray-500"> #{profile.tagLine}</span>
          </h1>
          {!profile.linked && (
            <p className="text-yellow-400 text-sm mt-2">
              ⚠️ Compte non lié — la rep s&apos;accumule en attendant que ce joueur lie son Discord.
            </p>
          )}
        </header>

        <section className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1a1d28] p-6 rounded-xl border border-gray-700/30 text-center">
            <p className="text-emerald-400 text-4xl font-bold">{profile.counts.respects}</p>
            <p className="text-gray-400 mt-1">Respects ⭐</p>
          </div>
          <div className="bg-[#1a1d28] p-6 rounded-xl border border-gray-700/30 text-center">
            <p className="text-orange-400 text-4xl font-bold">{profile.counts.shrooms}</p>
            <p className="text-gray-400 mt-1">Shrooms 🍄</p>
          </div>
          <div className="bg-[#1a1d28] p-6 rounded-xl border border-gray-700/30 text-center">
            <p className="text-yellow-300 text-4xl font-bold">{profile.honey}</p>
            <p className="text-gray-400 mt-1">Honey 🍯</p>
          </div>
        </section>

        <section className="bg-[#1a1d28] p-6 rounded-xl border border-gray-700/30">
          <h2 className="text-xl font-bold text-white mb-4">
            Score net : <span className={netRep >= 0 ? "text-emerald-400" : "text-red-400"}>{netRep >= 0 ? "+" : ""}{netRep}</span>
          </h2>
          <h3 className="text-white font-semibold mb-2">Récents</h3>
          <ul className="space-y-2">
            {profile.recentEvents.length === 0 && <li className="text-gray-500">Aucun event encore.</li>}
            {profile.recentEvents.map((e) => (
              <li key={e.id} className="text-sm text-gray-300">
                {e.type === "respect" ? "⭐" : "🍄"} match <code className="text-gray-500">{e.match_id}</code> · weight {e.weight}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
