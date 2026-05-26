/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 *
 * Legacy /u/[riotId] → redirige sur /profile/[riotId] (la nouvelle URL
 * canonique). On garde la route pour ne pas casser les anciens liens
 * partagés et les caches sociaux.
 */

import { redirect, permanentRedirect } from "next/navigation";

interface Props {
  params: Promise<{ riotId: string }>;
}

export default async function LegacyPublicProfile({ params }: Props) {
  const { riotId } = await params;
  permanentRedirect(`/profile/${riotId}`);
  // Inatteignable, mais TypeScript veut un return JSX
  redirect(`/profile/${riotId}`);
}
