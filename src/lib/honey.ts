/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

import { API_URL } from "@/lib/env";

const TOKEN_KEY = "beemobot_token";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export async function spendHoney(
  amount: number,
  reason: "minigame_bet" | "cosmetic_purchase",
  metadata: Record<string, unknown> = {}
): Promise<{ ok: boolean; balance?: number; error?: string }> {
  const token = getToken();
  if (!token) return { ok: false, error: "not_authenticated" };
  const res = await fetch(`${API_URL}/economy/spend`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ amount, reason, metadata }),
  });
  if (res.status === 402) return { ok: false, error: "insufficient_honey" };
  if (!res.ok) return { ok: false, error: "api_error" };
  const data = await res.json();
  return { ok: true, balance: data.balance };
}

export async function getBalance(): Promise<number> {
  const token = getToken();
  if (!token) return 0;
  const res = await fetch(`${API_URL}/economy/balance`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data.balance ?? 0;
}

export async function getMyPuuid(): Promise<string | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_URL}/profile/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.puuid ?? null;
}
