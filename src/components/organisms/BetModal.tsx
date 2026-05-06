/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useState, useEffect } from "react";
import { getBalance, spendHoney } from "@/lib/honey";
import Button from "@/components/atoms/Button";

interface Props {
  gameId: string;
  onConfirm: (bet: number) => void;
  onCancel: () => void;
}

export function BetModal({ gameId, onConfirm, onCancel }: Props) {
  const [bet, setBet] = useState(10);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBalance().then(setBalance);
  }, []);

  const submit = async () => {
    setLoading(true);
    setError(null);
    const result = await spendHoney(bet, "minigame_bet", { game_id: gameId });
    setLoading(false);
    if (!result.ok) {
      if (result.error === "insufficient_honey") setError("Pas assez de honey 🍯");
      else if (result.error === "not_authenticated") setError("Connecte-toi d'abord");
      else setError("Erreur, réessaye.");
      return;
    }
    onConfirm(bet);
  };

  const max = Math.min(100, balance ?? 100);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1d28] p-8 rounded-xl border border-gray-700/30 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-white mb-2">🍯 Place ta mise</h2>
        {balance !== null ? (
          <p className="text-gray-400 mb-4">Solde : {balance} honey</p>
        ) : (
          <p className="text-gray-500 mb-4">Chargement du solde...</p>
        )}
        <input
          type="range"
          min="5"
          max={max}
          step="5"
          value={Math.min(bet, max)}
          onChange={(e) => setBet(Number(e.target.value))}
          className="w-full"
          disabled={balance !== null && balance < 5}
        />
        <p className="text-yellow-300 text-2xl text-center my-4">{Math.min(bet, max)} 🍯</p>
        <p className="text-gray-400 text-sm text-center mb-4">
          Gagne : {Math.min(bet, max) * 2} 🍯 — perds tout si tu rates
        </p>
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <div className="flex gap-2">
          <Button onClick={onCancel} className="flex-1 bg-gray-700">Annuler</Button>
          <Button
            onClick={submit}
            disabled={loading || balance === null || balance < 5}
            className="flex-1 bg-blue-600"
          >
            {loading ? "..." : "Parier"}
          </Button>
        </div>
      </div>
    </div>
  );
}
