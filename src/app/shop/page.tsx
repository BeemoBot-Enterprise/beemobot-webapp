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
      <header className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-text mb-1">Shop</h1>
          <p className="text-text-muted">
            Personnalise ton profil avec du honey gagné en jeu.
          </p>
        </div>
        {authed && (
          <Badge variant="gold" className="text-sm px-3 py-1">
            Solde : {balance}
          </Badge>
        )}
      </header>

      {error && (
        <Card className="p-4 mb-6 border-danger/40">
          <p className="text-sm text-danger">{error}</p>
        </Card>
      )}

      {items.length === 0 ? (
        <Card className="p-10 text-center">
          <h2 className="text-lg font-semibold text-text mb-1">
            Aucun item disponible
          </h2>
          <p className="text-text-muted text-sm">
            Le catalogue est vide ou indisponible pour le moment.
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const isOwned = owned.has(item.id);
            const cantAfford = authed && balance < item.priceHoney;
            return (
              <Card key={item.id} className="p-6 flex flex-col gap-3">
                <p className="text-xs uppercase tracking-wide text-text-muted">
                  {item.type}
                </p>
                <h3 className="text-lg font-semibold text-text">
                  {item.name}
                </h3>
                <p className="text-text-muted font-mono text-sm">
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
