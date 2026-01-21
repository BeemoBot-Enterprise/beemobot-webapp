"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Image from "next/image";

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

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState("euw1");
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPlayer = async () => {
    if (!searchQuery.trim()) {
      setError(
        "Veuillez entrer un nom d'invocateur (format: nom#TAG ou nom-TAG)",
      );
      return;
    }

    setLoading(true);
    setError(null);
    setProfile(null);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.API_URL ||
        "http://localhost:65397";

      // Normaliser le format de recherche (accepter # ou -)
      let formattedQuery = searchQuery.trim();

      // Si l'utilisateur utilise #, le remplacer par -
      if (formattedQuery.includes("#")) {
        formattedQuery = formattedQuery.replace("#", "-");
      }

      // Appel à l'endpoint /lol/summoner/:summonerName/profile
      const response = await fetch(
        `${apiUrl}/lol/summoner/${encodeURIComponent(formattedQuery)}/profile?region=${region}`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "Invocateur non trouvé. Vérifiez le format (ex: nunch#N7789 ou nunch-N7789) et la région",
          );
        }
        throw new Error("Erreur lors de la recherche");
      }

      const profileData = await response.json();
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchPlayer();
    }
  };

  const getQueueName = (queueType: string) => {
    switch (queueType) {
      case "RANKED_SOLO_5x5":
        return "Solo/Duo";
      case "RANKED_FLEX_SR":
        return "Flex 5v5";
      default:
        return queueType;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toUpperCase()) {
      case "CHALLENGER":
        return "text-[#F4C430]";
      case "GRANDMASTER":
        return "text-[#FF4444]";
      case "MASTER":
        return "text-[#9B4FFF]";
      case "DIAMOND":
        return "text-[#6FAAFF]";
      case "PLATINUM":
        return "text-[#1E8966]";
      case "GOLD":
        return "text-[#FFD700]";
      case "SILVER":
        return "text-[#C0C0C0]";
      case "BRONZE":
        return "text-[#CD7F32]";
      case "IRON":
        return "text-[#4D4D4D]";
      default:
        return "text-gray-400";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#1a1f2e] to-[#0a0e1a] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#00A0FF] via-[#FFD700] to-[#F5A623] bg-clip-text text-transparent">
            Recherche d'utilisateur
          </h1>
          <p className="text-gray-400 text-lg">
            Trouvez un joueur et consultez ses statistiques
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 bg-[#1d202b] border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Ex: nunch#N7789 ou nunch-N7789"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-3 bg-[#2a2e3b] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00A0FF] transition-all"
                />
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="px-4 py-3 bg-[#2a2e3b] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#00A0FF] transition-all"
                >
                  <option value="euw1">EUW</option>
                  <option value="na1">NA</option>
                  <option value="kr">KR</option>
                  <option value="eun1">EUNE</option>
                  <option value="br1">BR</option>
                  <option value="la1">LAN</option>
                  <option value="la2">LAS</option>
                  <option value="oc1">OCE</option>
                  <option value="tr1">TR</option>
                  <option value="ru">RU</option>
                  <option value="jp1">JP</option>
                </select>
                <Button
                  onClick={searchPlayer}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-[#00A0FF] to-[#0080CC] hover:from-[#33B3FF] hover:to-[#00A0FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? "Recherche..." : "Rechercher"}
                </Button>
              </div>
              <p className="text-gray-400 text-xs">
                💡 Format accepté:{" "}
                <code className="px-2 py-1 bg-[#2a2e3b] rounded">nom#TAG</code>{" "}
                ou{" "}
                <code className="px-2 py-1 bg-[#2a2e3b] rounded">nom-TAG</code>
              </p>
              {error && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Player Profile */}
        {profile && (
          <div className="space-y-6">
            {/* Summoner Info */}
            <Card className="bg-[#1d202b] border-gray-700 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#00A0FF]/20 to-[#FFD700]/20 border-b border-gray-700">
                <CardTitle className="text-3xl flex items-center gap-3">
                  <Image
                    src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/profileicon/${profile.summoner.profileIconId}.png`}
                    alt="Profile Icon"
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-[#FFD700]"
                  />
                  <div>
                    <div className="text-white">
                      {profile.summoner.gameName}#{profile.summoner.tagLine}
                    </div>
                    <div className="text-sm text-gray-400 font-normal">
                      Niveau {profile.summoner.summonerLevel}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Ranks */}
            {profile.ranks && profile.ranks.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {profile.ranks.map((rank, index) => (
                  <Card key={index} className="bg-[#1d202b] border-gray-700">
                    <CardHeader className="bg-[#232631] border-b border-gray-700">
                      <CardTitle className="text-xl">
                        {getQueueName(rank.queueType)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div
                          className={`text-4xl font-bold ${getTierColor(rank.tier)}`}
                        >
                          {rank.tier} {rank.rank}
                        </div>
                        <div className="text-2xl text-gray-400 mt-2">
                          {rank.leaguePoints} LP
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-green-400 font-bold">
                            {rank.wins}
                          </div>
                          <div className="text-xs text-gray-400">Victoires</div>
                        </div>
                        <div>
                          <div className="text-red-400 font-bold">
                            {rank.losses}
                          </div>
                          <div className="text-xs text-gray-400">Défaites</div>
                        </div>
                        <div>
                          <div className="text-[#FFD700] font-bold">
                            {rank.winRate}%
                          </div>
                          <div className="text-xs text-gray-400">Winrate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Top Champions */}
            {profile.topChampions && profile.topChampions.length > 0 && (
              <Card className="bg-[#1d202b] border-gray-700">
                <CardHeader className="bg-[#232631] border-b border-gray-700">
                  <CardTitle className="text-2xl text-[#FFD700]">
                    🏆 Meilleurs Champions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {profile.topChampions.map((champ, index) => (
                      <div key={index} className="text-center">
                        <Image
                          src={champ.championImage}
                          alt={champ.championName}
                          width={80}
                          height={80}
                          className="rounded-full mx-auto border-2 border-[#00A0FF] mb-2"
                        />
                        <div className="text-white font-medium text-sm">
                          {champ.championName}
                        </div>
                        <div className="text-[#FFD700] text-xs">
                          Niv. {champ.championLevel}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {champ.championPoints.toLocaleString()} pts
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Matches */}
            {profile.recentMatches && profile.recentMatches.length > 0 && (
              <Card className="bg-[#1d202b] border-gray-700">
                <CardHeader className="bg-[#232631] border-b border-gray-700">
                  <CardTitle className="text-2xl text-[#00A0FF]">
                    📜 Matchs Récents
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {profile.recentMatches.map((match, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        match.participant.win
                          ? "bg-green-900/20 border-green-700"
                          : "bg-red-900/20 border-red-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-400">
                              {match.participant.championName}
                            </div>
                            <div className="text-xl font-bold text-white">
                              {match.participant.kills}/
                              {match.participant.deaths}/
                              {match.participant.assists}
                            </div>
                            <div className="text-xs text-gray-400">
                              KDA:{" "}
                              {(
                                (match.participant.kills +
                                  match.participant.assists) /
                                Math.max(match.participant.deaths, 1)
                              ).toFixed(2)}
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">
                            <div>
                              CS: {match.participant.totalMinionsKilled}
                            </div>
                            <div>Vision: {match.participant.visionScore}</div>
                            <div>
                              Gold:{" "}
                              {match.participant.goldEarned.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${
                              match.participant.win
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {match.participant.win ? "VICTOIRE" : "DÉFAITE"}
                          </div>
                          <div className="text-xs text-gray-400">
                            {Math.floor(match.gameDuration / 60)}m{" "}
                            {match.gameDuration % 60}s
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Empty State */}
        {!profile && !loading && !error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg mb-3">
              Recherchez un invocateur pour voir ses statistiques
            </p>
            <p className="text-gray-500 text-sm">
              Essayez par exemple:{" "}
              <span className="text-[#00A0FF]">nunch#N7789</span>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
