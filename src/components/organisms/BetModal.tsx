/**
 * Copyright (c) 2024-2026 BeemoBot Enterprise
 * All rights reserved.
 */

"use client";

import { useEffect, useState } from "react";
import { getBalance, spendHoney } from "@/lib/honey";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";

export interface BetModalProps {
  gameId: string;
  onConfirm: (bet: number) => void;
  onCancel: () => void;
}

export function BetModal({ gameId, onConfirm, onCancel }: BetModalProps) {
  const [bet, setBet] = useState(10);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBalance().then(setBalance);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const max = Math.min(100, balance ?? 100);
  const clampedBet = Math.min(bet, max);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await spendHoney(clampedBet, "minigame_bet", {
      game_id: gameId,
    });
    setLoading(false);
    if (!result.ok) {
      if (result.error === "insufficient_honey") setError("Pas assez de honey.");
      else if (result.error === "not_authenticated")
        setError("Connecte-toi d'abord.");
      else setError("Erreur, réessaye.");
      return;
    }
    onConfirm(clampedBet);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-sm rounded-md border border-border bg-surface">
        <div className="p-5 border-b border-border">
          <h3 className="text-lg font-semibold text-text">Placer une mise</h3>
          <p className="text-sm text-text-muted mt-1">
            {balance !== null
              ? `Solde : ${balance} honey`
              : "Chargement du solde..."}
          </p>
        </div>
        <form onSubmit={submit} className="p-5 flex flex-col gap-3">
          <Label htmlFor="amount">Montant (honey)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min={5}
            max={max}
            step={5}
            value={clampedBet}
            onChange={(e) => setBet(Number(e.target.value))}
            disabled={balance !== null && balance < 5}
            required
          />
          <p className="text-sm text-text-muted">
            Gain : {clampedBet * 2} honey si tu gagnes.
          </p>
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || balance === null || balance < 5}
            >
              {loading ? "..." : "Confirmer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
