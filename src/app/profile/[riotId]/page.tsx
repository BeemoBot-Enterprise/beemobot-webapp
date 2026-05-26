/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import { fetchProfileByRiotId } from "@/lib/api";
import { notFound } from "next/navigation";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProfileErrorBoundary } from "@/components/profile/ProfileErrorBoundary";

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

  return (
    <ProfileErrorBoundary>
      <ProfileView
        profile={profile}
        fallbackGameName={gameName}
        fallbackTagLine={tagLine}
      />
    </ProfileErrorBoundary>
  );
}
