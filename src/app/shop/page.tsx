/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/env";
import Button from "@/components/atoms/Button";

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem(TOKEN_KEY);

    fetch(`${API_URL}/shop`).then((r) => r.json()).then((d) => setItems(d.items ?? []));

    if (token) {
      fetch(`${API_URL}/shop/owned`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => (r.ok ? r.json() : { owned: [] }))
        .then((d) => setOwned(new Set((d.owned ?? []).map((o: { cosmeticId: string }) => o.cosmeticId))));
      fetch(`${API_URL}/economy/balance`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => (r.ok ? r.json() : { balance: 0 }))
        .then((d) => setBalance(d.balance ?? 0));
    }
  }, []);

  const buy = async (cosmeticId: string) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      alert("Connecte-toi d'abord");
      return;
    }
    const r = await fetch(`${API_URL}/shop/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ cosmeticId }),
    });
    if (r.ok) {
      setOwned(new Set([...owned, cosmeticId]));
      const item = items.find((i) => i.id === cosmeticId);
      if (item) setBalance((b) => b - item.priceHoney);
    } else if (r.status === 402) {
      alert("Pas assez de honey 🍯");
    } else {
      alert("Erreur lors de l'achat");
    }
  };

  return (
    <main className="min-h-screen bg-[#0f1117] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-end mb-8">
          <h1 className="text-4xl font-bold text-white">🛒 Shop</h1>
          <p className="text-yellow-300 text-2xl">{balance} 🍯</p>
        </header>
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((item) => {
            const isOwned = owned.has(item.id);
            const cantAfford = balance < item.priceHoney;
            return (
              <div key={item.id} className="bg-[#1a1d28] p-6 rounded-xl border border-gray-700/30 text-center">
                <div className="text-xs uppercase text-gray-500 mb-1">{item.type}</div>
                <h3 className="text-white font-bold mb-2">{item.name}</h3>
                <p className="text-yellow-300 text-xl mb-4">{item.priceHoney} 🍯</p>
                <Button
                  onClick={() => buy(item.id)}
                  disabled={isOwned || cantAfford}
                  className={isOwned ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700 disabled:opacity-50"}
                >
                  {isOwned ? "Possédé" : cantAfford ? "Trop cher" : "Acheter"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
