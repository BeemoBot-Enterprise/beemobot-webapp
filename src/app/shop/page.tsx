/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/env";
import { Button } from "@/components/_design/Button";
import { Card } from "@/components/_design/Card";
import { Pill } from "@/components/_design/Pill";
import { Eyebrow } from "@/components/_design/Eyebrow";

const TOKEN_KEY = "beemobot_token";

interface CosmeticItem {
  id: string;
  name: string;
  type: string;
  assetUrl: string;
  priceHoney: number;
  availableUntil: string | null;
}

function isExpired(item: CosmeticItem): boolean {
  if (!item.availableUntil) return false;
  return new Date(item.availableUntil).getTime() < Date.now();
}

function isLimited(item: CosmeticItem): boolean {
  return item.availableUntil !== null;
}

function formatDeadline(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
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
      if (item && item.priceHoney > 0) setBalance((b) => b - item.priceHoney);
    } else if (r.status === 402) {
      setError("Solde insuffisant.");
    } else if (r.status === 410) {
      setError("Cet item n'est plus disponible.");
    } else {
      setError("Erreur lors de l'achat.");
    }
  };

  // Items limités en premier (pour les mettre en évidence), puis le reste.
  const sortedItems = [...items].sort((a, b) => {
    if (isLimited(a) && !isLimited(b)) return -1;
    if (!isLimited(a) && isLimited(b)) return 1;
    return 0;
  });

  return (
    <main className="max-w-[1100px] mx-auto px-6 py-12">
      <header className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div className="flex flex-col gap-3">
          <Eyebrow>Shop</Eyebrow>
          <h1 className="font-display text-hf-display-2 text-hf-navy">
            Personnalise ton profil
          </h1>
          <p className="text-hf-body-lg text-hf-navy-soft max-w-2xl">
            Dépense ton honey en badges, borders et effets. Certains items
            sont gratuits et limités dans le temps — bien joué d&apos;être là.
          </p>
        </div>
        {authed && (
          <span className="inline-flex items-center gap-2 rounded-hf-pill border border-hf-line bg-hf-surface px-3 py-1.5">
            <span className="size-2 rounded-full bg-hf-honey" />
            <span className="text-hf-body-sm font-semibold text-hf-navy tabular-nums">
              {balance} honey
            </span>
          </span>
        )}
      </header>

      {error && (
        <Card className="!p-4 mb-6 border-hf-loss/40 bg-hf-loss/10">
          <p className="text-hf-body-sm text-hf-loss">{error}</p>
        </Card>
      )}

      {sortedItems.length === 0 ? (
        <Card className="!p-12 text-center">
          <h2 className="font-display text-hf-display-3 text-hf-navy mb-1">
            Aucun item disponible
          </h2>
          <p className="text-hf-body-sm text-hf-navy-soft">
            Le catalogue est vide ou indisponible pour le moment.
          </p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedItems.map((item) => {
            const isOwn = owned.has(item.id);
            const expired = isExpired(item);
            const limited = isLimited(item);
            const free = item.priceHoney === 0;
            const cantAfford = !free && authed && balance < item.priceHoney;
            const disabled = isOwn || cantAfford || !authed || expired;

            return (
              <Card
                key={item.id}
                variant={limited ? "accent" : "default"}
                className="flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <Eyebrow tone={limited ? "honey" : "navy"}>{item.type}</Eyebrow>
                  {limited && !expired && (
                    <Pill variant="honey" className="text-xs">
                      ⏳ Limité
                    </Pill>
                  )}
                  {expired && (
                    <Pill variant="default" className="text-xs">
                      Expiré
                    </Pill>
                  )}
                </div>
                <h3 className="font-display text-hf-display-3 text-hf-navy">
                  {item.name}
                </h3>
                <p
                  className={`text-hf-body-sm font-bold tabular-nums ${
                    free ? "text-hf-win" : "text-hf-honey-text"
                  }`}
                >
                  {free ? "Gratuit" : `${item.priceHoney} honey`}
                </p>
                {limited && item.availableUntil && (
                  <p className="text-xs text-hf-navy-soft">
                    {expired ? "Fin : " : "Jusqu'au "}
                    {formatDeadline(item.availableUntil)}
                  </p>
                )}
                <div className="mt-auto pt-2">
                  <Button
                    onClick={() => buy(item.id)}
                    disabled={disabled}
                    variant={isOwn ? "outline" : "primary"}
                    size="sm"
                    className="w-full"
                  >
                    {!authed
                      ? "Connexion requise"
                      : isOwn
                        ? "Possédé ✓"
                        : expired
                          ? "Expiré"
                          : cantAfford
                            ? "Solde insuffisant"
                            : free
                              ? "Récupérer"
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
