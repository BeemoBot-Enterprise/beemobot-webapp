/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { puuid, amount, gameId, score } = body as {
    puuid?: string;
    amount?: number;
    gameId?: string;
    score?: number;
  };

  if (!puuid || !amount || !gameId) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
  const internalKey = process.env.INTERNAL_API_KEY;
  if (!internalKey) {
    return NextResponse.json({ error: "no_internal_key" }, { status: 500 });
  }

  const res = await fetch(`${apiUrl}/economy/credit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-key": internalKey,
    },
    body: JSON.stringify({
      userPuuid: puuid,
      amount,
      reason: "minigame_win",
      metadata: { gameId, score },
    }),
  });
  if (!res.ok) {
    return NextResponse.json({ error: "credit_failed" }, { status: 502 });
  }
  return NextResponse.json(await res.json());
}
