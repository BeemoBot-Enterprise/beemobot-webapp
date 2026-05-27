/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import { notFound } from "next/navigation";
import { API_URL } from "@/lib/env";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProfileErrorBoundary } from "@/components/profile/ProfileErrorBoundary";
import type { FullProfile } from "@/lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

interface DiscordFullPayload {
  discordId: string | null;
  username: string | null;
  avatarUrl: string | null;
  puuid: string | null;
  gameName: string | null;
  tagLine: string | null;
  linked: boolean;
  counts: { respects: number; shrooms: number };
  weighted: { respects: number; shrooms: number };
  given: { respects: number; shrooms: number };
  honey: number;
  recentEvents: FullProfile["recentEvents"];
}

async function fetchDiscordFull(id: string): Promise<DiscordFullPayload | null> {
  const r = await fetch(`${API_URL}/profile/discord/${encodeURIComponent(id)}/full`, {
    cache: "no-store",
  });
  if (!r.ok) return null;
  return r.json();
}

export default async function ProfileByDiscordPage({ params }: Props) {
  const { id } = await params;
  const payload = await fetchDiscordFull(id);
  if (!payload) return notFound();

  // Compose un FullProfile à partir du payload by-discord. Pas de LoL data
  // ici par design (l'utilisateur n'est pas forcément lié), mais
  // ProfileView gère bien le cas lol=null.
  const profile: FullProfile = {
    puuid: payload.puuid ?? "",
    gameName: payload.gameName,
    tagLine: payload.tagLine,
    linked: payload.linked,
    counts: payload.counts,
    weighted: payload.weighted,
    given: payload.given,
    honey: payload.honey,
    recentEvents: payload.recentEvents,
    lol: null,
  };

  return (
    <ProfileErrorBoundary>
      <ProfileView
        profile={profile}
        discordName={payload.username ?? "Joueur"}
        discordAvatarUrl={payload.avatarUrl}
      />
    </ProfileErrorBoundary>
  );
}
