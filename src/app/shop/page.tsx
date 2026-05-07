/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/env";
import Button from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Eyebrow from "@/components/atoms/Eyebrow";

const TOKEN_KEY = "beemobot_token";

interface CosmeticItem {
  id: string;
  name: string;
  type: string;
  assetUrl: string;
  priceHoney: number;
}

export default function ShopPage() {
  const [items, setItems] = useState<CosmeticItem[]>([]);
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [balance, setBalance] = useState<number>(0);
  const [authed, setAuthed] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem(TOKEN_KEY);
    setAuthed(Boolean(token));

    fetch(`${API_URL}/shop`)
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setItems([]));

    if (token) {
      fetch(`${API_URL}/shop/owned`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : { owned: [] }))
        .then((d) =>
          setOwned(
            new Set(
              (d.owned ?? []).map(
                (o: { cosmeticId: string }) => o.cosmeticId,
              ),
            ),
          ),
        )
        .catch(() => setOwned(new Set()));

      fetch(`${API_URL}/economy/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : { balance: 0 }))
        .then((d) => setBalance(d.balance ?? 0))
        .catch(() => setBalance(0));
    }
  }, []);

  const buy = async (cosmeticId: string) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(TOKEN_KEY)
        : null;
    if (!token) {
      setError("Connecte-toi pour acheter un item.");
      return;
    }
    setError(null);
    const r = await fetch(`${API_URL}/shop/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cosmeticId }),
    });
    if (r.ok) {
      setOwned(new Set([...owned, cosmeticId]));
      const item = items.find((i) => i.id === cosmeticId);
      if (item) setBalance((b) => b - item.priceHoney);
    } else if (r.status === 402) {
      setError("Solde insuffisant.");
    } else {
      setError("Erreur lors de l’achat.");
    }
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      <header className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div className="flex flex-col gap-3">
          <Eyebrow>Shop</Eyebrow>
          <h1 className="text-title-h4 md:text-title-h3 text-text-strong-950 !font-[600]">
            Personnalise ton profil
          </h1>
          <p className="text-paragraph-md text-text-sub-600 max-w-2xl">
            Dépense ton honey en badges, borders et effets. Le honey s'accumule
            avec ta réputation et ton activité.
          </p>
        </div>
        {authed && (
          <span className="inline-flex items-center gap-2 rounded-full border border-stroke-soft-200 bg-bg-weak-50 px-3 py-1.5">
            <span className="size-2 rounded-full bg-warning-base" />
            <span className="text-label-sm text-text-strong-950 tabular-nums">
              {balance} honey
            </span>
          </span>
        )}
      </header>

      {error && (
        <Card className="p-4 mb-6 rounded-20 border-error-base/40 bg-error-lighter">
          <p className="text-paragraph-sm text-error-base">{error}</p>
        </Card>
      )}

      {items.length === 0 ? (
        <Card className="p-12 rounded-20 border-stroke-soft-200 bg-bg-weak-50 text-center">
          <h2 className="text-label-lg text-text-strong-950 mb-1">
            Aucun item disponible
          </h2>
          <p className="text-paragraph-sm text-text-sub-600">
            Le catalogue est vide ou indisponible pour le moment.
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const isOwned = owned.has(item.id);
            const cantAfford = authed && balance < item.priceHoney;
            return (
              <Card
                key={item.id}
                className="p-6 rounded-20 border-stroke-soft-200 bg-bg-weak-50 flex flex-col gap-3 hover:bg-bg-soft-200 transition-colors"
              >
                <p className="text-subheading-2xs text-text-soft-400">
                  {item.type}
                </p>
                <h3 className="text-label-lg text-text-strong-950">
                  {item.name}
                </h3>
                <p className="text-label-sm text-warning-base tabular-nums">
                  {item.priceHoney} honey
                </p>
                <div className="mt-auto pt-2">
                  <Button
                    onClick={() => buy(item.id)}
                    disabled={isOwned || cantAfford || !authed}
                    variant={isOwned ? "secondary" : "primary"}
                    size="sm"
                    className="w-full"
                  >
                    {!authed
                      ? "Connexion requise"
                      : isOwned
                        ? "Possédé"
                        : cantAfford
                          ? "Solde insuffisant"
                          : "Acheter"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
