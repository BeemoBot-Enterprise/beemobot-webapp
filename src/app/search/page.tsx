"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/_design/Card";
import { Button } from "@/components/_design/Button";
import { Pill } from "@/components/_design/Pill";
import { Eyebrow } from "@/components/_design/Eyebrow";
import { API_URL } from "@/lib/env";

// Input + Label HF inline (pas d'atoms HF dédiés)
function Label({ htmlFor, className, children }: { htmlFor?: string; className?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={className ?? "text-hf-eyebrow uppercase tracking-wider text-hf-navy-soft"}>
      {children}
    </label>
  );
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "h-10 w-full rounded-hf-btn border border-hf-line bg-hf-surface px-3 text-hf-body text-hf-navy " +
        "placeholder:text-hf-navy-soft/60 focus-visible:outline-none focus-visible:border-hf-honey " +
        "focus-visible:ring-2 focus-visible:ring-hf-honey-glow transition-colors"
      }
    />
  );
}

interface Summoner {
  puuid: string;
  name: string;
  gameName: string;
  tagLine: string;
  profileIconId: number;
  summonerLevel: number;
  revisionDate: number;
}

interface Rank {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  winRate: string;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
}

interface Champion {
  championId: number;
  championName: string;
  championImage: string;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
}

interface Match {
  matchId: string;
  gameMode: string;
  gameCreation: number;
  gameDuration: number;
  participant: {
    championName: string;
    championId: number;
    kills: number;
    deaths: number;
    assists: number;
    totalDamageDealtToChampions: number;
    goldEarned: number;
    champLevel: number;
    totalMinionsKilled: number;
    visionScore: number;
    win: boolean;
    items: number[];
    teamPosition: string;
  };
}

interface PlayerProfile {
  summoner: Summoner;
  ranks: Rank[];
  topChampions: Champion[];
  recentMatches: Match[];
  totalMatches: number;
}

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

function getQueueName(queueType: string) {
  switch (queueType) {
    case "RANKED_SOLO_5x5":
      return "Solo/Duo";
    case "RANKED_FLEX_SR":
      return "Flex 5v5";
    default:
      return queueType;
  }
}

function formatDuration(seconds: number) {
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("euw1");
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPlayer = async () => {
    if (!query.trim()) {
      setError("Entre un nom au format GameName#TagLine ou GameName-TagLine.");
      return;
    }

    setLoading(true);
    setError(null);
    setProfile(null);

    try {
      let formattedQuery = query.trim();
      if (formattedQuery.includes("#")) {
        formattedQuery = formattedQuery.replace("#", "-");
      }

      const response = await fetch(
        `${API_URL}/lol/summoner/${encodeURIComponent(formattedQuery)}/profile?region=${region}`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "Invocateur non trouvé. Vérifie le format (ex: nunch#N7789) et la région.",
          );
        }
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message ?? "Erreur lors de la recherche.");
      }

      const profileData = await response.json();
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchPlayer();
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <div className="flex flex-col gap-3 mb-10">
        <Eyebrow>Recherche</Eyebrow>
        <h1 className="font-display text-hf-display-2 text-hf-navy !font-[600]">
          Trouve n'importe quel summoner
        </h1>
        <p className="text-hf-body-lg text-hf-navy-soft max-w-2xl">
          Tape un Riot ID au format <span className="text-hf-navy">GameName#TagLine</span>,
          choisis la région, et BeemoBot ramène stats, ranks et derniers
          matchs depuis l'API officielle.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col md:flex-row gap-3 mb-10"
      >
        <div className="flex-1">
          <Label htmlFor="q" className="sr-only">
            Joueur
          </Label>
          <Input
            id="q"
            placeholder="GameName#TagLine"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          aria-label="Région"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="h-10 rounded-md border border-hf-line bg-hf-surface-alt px-3 text-sm text-hf-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hf-honey focus-visible:ring-offset-2 focus-visible:ring-offset-hf-bg"
        >
          {REGIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Recherche…" : "Rechercher"}
        </Button>
      </form>

      {error && (
        <Card className="p-4 mb-8 border-hf-loss">
          <p className="text-sm text-hf-loss">{error}</p>
        </Card>
      )}

      {profile && (
        <div className="space-y-8">
          {/* Header profil */}
          <section className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-hf-surface-alt border border-hf-line overflow-hidden flex items-center justify-center">
              <Image
                src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${profile.summoner.profileIconId}.png`}
                alt="Profile Icon"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-display text-hf-display-3 text-hf-navy !font-[600]">
                {profile.summoner.gameName}
              </h2>
              <p className="text-hf-navy-soft text-sm">
                #{profile.summoner.tagLine} · Niveau{" "}
                {profile.summoner.summonerLevel}
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {profile.ranks?.[0] && (
                  <Pill variant="honey">
                    {profile.ranks[0].tier} {profile.ranks[0].rank}
                  </Pill>
                )}
                {profile.topChampions?.[0] && (
                  <Pill>
                    Main {profile.topChampions[0].championName}
                  </Pill>
                )}
              </div>
            </div>
          </section>

          {/* Ranks */}
          {profile.ranks && profile.ranks.length > 0 && (
            <section>
              <h3 className="font-display text-hf-display-3 text-hf-navy !font-[600] mb-4">
                Classements
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {profile.ranks.map((rank, index) => (
                  <Card key={index} className="p-6">
                    <div className="text-sm text-hf-navy-soft">
                      {getQueueName(rank.queueType)}
                    </div>
                    <div className="font-display text-hf-display-3 text-hf-navy !font-[600] mt-1">
                      {rank.tier} {rank.rank}{" "}
                      <span className="text-hf-navy-soft text-base font-normal">
                        · {rank.leaguePoints} LP
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                      <div>
                        <div className="text-hf-navy-soft">Victoires</div>
                        <div className="text-hf-navy font-medium">
                          {rank.wins}
                        </div>
                      </div>
                      <div>
                        <div className="text-hf-navy-soft">Défaites</div>
                        <div className="text-hf-navy font-medium">
                          {rank.losses}
                        </div>
                      </div>
                      <div>
                        <div className="text-hf-navy-soft">Winrate</div>
                        <div className="text-hf-navy font-medium">
                          {rank.winRate}%
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Top Champions */}
          {profile.topChampions && profile.topChampions.length > 0 && (
            <section>
              <h3 className="font-display text-hf-display-3 text-hf-navy !font-[600] mb-4">
                Meilleurs champions
              </h3>
              <Card className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {profile.topChampions.map((champ) => (
                    <div key={champ.championId} className="text-center">
                      <Image
                        src={champ.championImage}
                        alt={champ.championName}
                        width={64}
                        height={64}
                        className="rounded-full mx-auto mb-2 border border-hf-line"
                      />
                      <div className="text-sm text-hf-navy font-medium">
                        {champ.championName}
                      </div>
                      <div className="text-xs text-hf-navy-soft">
                        Niv. {champ.championLevel} ·{" "}
                        {champ.championPoints.toLocaleString("fr-FR")} pts
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          )}

          {/* Recent Matches */}
          {profile.recentMatches && profile.recentMatches.length > 0 && (
            <section>
              <h3 className="font-display text-hf-display-3 text-hf-navy !font-[600] mb-4">
                Matchs récents
              </h3>
              <Card className="overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-hf-line text-hf-navy-soft">
                      <th className="text-left p-3 font-medium">Champion</th>
                      <th className="text-left p-3 font-medium">KDA</th>
                      <th className="text-left p-3 font-medium">Durée</th>
                      <th className="text-right p-3 font-medium">Résultat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.recentMatches.map((match) => {
                      const { participant } = match;
                      return (
                        <tr
                          key={match.matchId}
                          className="border-b border-hf-line last:border-0 hover:bg-hf-surface-alt"
                        >
                          <td className="p-3 text-hf-navy">
                            {participant.championName}
                          </td>
                          <td className="p-3 text-hf-navy">
                            {participant.kills}/{participant.deaths}/
                            {participant.assists}
                          </td>
                          <td className="p-3 text-hf-navy-soft">
                            {formatDuration(match.gameDuration)}
                          </td>
                          <td
                            className={`p-3 text-right font-medium ${
                              participant.win ? "text-hf-navy" : "text-hf-navy-soft"
                            }`}
                          >
                            {participant.win ? "Victoire" : "Défaite"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            </section>
          )}
        </div>
      )}

      {!profile && !loading && !error && (
        <Card className="p-10 text-center">
          <p className="text-hf-navy-soft">
            Recherche un invocateur pour voir ses statistiques. Exemple :{" "}
            <code className="text-hf-navy">nunch#N7789</code>
          </p>
        </Card>
      )}
    </main>
  );
}
