"use client";

import React, { useState, useEffect, useCallback } from "react";
import Button from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { useGameState } from "@/hooks/useGameState";
import { cn } from "@/lib/utils";
import { BetModal } from "@/components/organisms/BetModal";
import { getMyPuuid } from "@/lib/honey";

const championEmojis = [
  { name: "Ahri", emoji: "🦊" },
  { name: "Yasuo", emoji: "⚔️" },
  { name: "Jinx", emoji: "💥" },
  { name: "Lux", emoji: "✨" },
  { name: "Thresh", emoji: "⛓️" },
  { name: "Teemo", emoji: "🍄" },
  { name: "Zed", emoji: "🥷" },
  { name: "Darius", emoji: "🪓" },
  { name: "Lee Sin", emoji: "👊" },
  { name: "Ezreal", emoji: "💫" },
  { name: "Lulu", emoji: "🧚" },
  { name: "Braum", emoji: "🛡️" },
];

interface CardData {
  id: number;
  championIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameData {
  cards: CardData[];
  flippedCards: number[];
  moves: number;
  matches: number;
  canFlip: boolean;
  difficulty: "easy" | "medium" | "hard";
  startTime: number;
  elapsedTime: number;
}

const difficultySettings = {
  easy: { pairs: 4, cols: 4 },
  medium: { pairs: 6, cols: 4 },
  hard: { pairs: 8, cols: 4 },
};

export function MemoryMatchGame() {
  const { state, startGame, endGame, updateScore, updateData, resetGame } =
    useGameState<GameData>(
      {
        cards: [],
        flippedCards: [],
        moves: 0,
        matches: 0,
        canFlip: true,
        difficulty: "easy",
        startTime: 0,
        elapsedTime: 0,
      },
      "memory-match",
    );

  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("easy");
  const [bet, setBet] = useState<number | null>(null);
  const [showBetModal, setShowBetModal] = useState(false);
  const [pendingDifficulty, setPendingDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("easy");

  const initializeCards = useCallback(
    (difficulty: "easy" | "medium" | "hard") => {
      const { pairs } = difficultySettings[difficulty];
      const selectedChampions = championEmojis
        .sort(() => Math.random() - 0.5)
        .slice(0, pairs);

      const cards: CardData[] = [];
      selectedChampions.forEach((_, champIndex) => {
        cards.push({
          id: cards.length,
          championIndex: champIndex,
          isFlipped: false,
          isMatched: false,
        });
        cards.push({
          id: cards.length,
          championIndex: champIndex,
          isFlipped: false,
          isMatched: false,
        });
      });

      const shuffledCards = cards.sort(() => Math.random() - 0.5);

      return { shuffledCards, selectedChampions };
    },
    [],
  );

  const [champions, setChampions] = useState(championEmojis.slice(0, 4));

  const doStart = (difficulty: "easy" | "medium" | "hard") => {
    const { shuffledCards, selectedChampions } = initializeCards(difficulty);
    setChampions(selectedChampions);

    startGame();
    updateData({
      cards: shuffledCards,
      flippedCards: [],
      moves: 0,
      matches: 0,
      canFlip: true,
      difficulty,
      startTime: Date.now(),
      elapsedTime: 0,
    });
  };

  const handleStart = (difficulty: "easy" | "medium" | "hard") => {
    setPendingDifficulty(difficulty);
    setShowBetModal(true);
  };

  const handleWin = async (score: number) => {
    if (bet) {
      const puuid = await getMyPuuid();
      if (puuid) {
        await fetch("/api/minigame-win", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            puuid,
            amount: bet * 2,
            gameId: "memory-match",
            score,
          }),
        });
      }
    }
  };

  const handleCardClick = (cardId: number) => {
    if (!state.data.canFlip) return;

    const card = state.data.cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    if (state.data.flippedCards.length >= 2) return;

    const newCards = state.data.cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c,
    );
    const newFlipped = [...state.data.flippedCards, cardId];

    updateData({
      cards: newCards,
      flippedCards: newFlipped,
    });

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      const firstCard = newCards.find((c) => c.id === firstId)!;
      const secondCard = newCards.find((c) => c.id === secondId)!;

      updateData({ canFlip: false, moves: state.data.moves + 1 });

      if (firstCard.championIndex === secondCard.championIndex) {
        setTimeout(() => {
          const matchedCards = newCards.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c,
          );
          const newMatches = state.data.matches + 1;
          const { pairs } = difficultySettings[state.data.difficulty];

          updateData({
            cards: matchedCards,
            flippedCards: [],
            canFlip: true,
            matches: newMatches,
          });

          const basePoints = 50;
          const movePenalty = state.data.moves * 2;
          updateScore(Math.max(10, basePoints - movePenalty));

          if (newMatches === pairs) {
            const timeTaken = Math.floor(
              (Date.now() - state.data.startTime) / 1000,
            );
            const timeBonus = Math.max(0, 300 - timeTaken);
            updateScore(timeBonus);
            updateData({ elapsedTime: timeTaken });
            endGame(true);
            handleWin(state.score + timeBonus);
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = newCards.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c,
          );
          updateData({
            cards: resetCards,
            flippedCards: [],
            canFlip: true,
          });
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (state.status !== "playing") return;

    const timer = setInterval(() => {
      updateData({
        elapsedTime: Math.floor((Date.now() - state.data.startTime) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.status, state.data.startTime, updateData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (state.status === "idle") {
    return (
      <Card className="p-8 text-center max-w-sm mx-auto">
        {showBetModal && (
          <BetModal
            gameId="memory-match"
            onConfirm={(b) => {
              setBet(b);
              setShowBetModal(false);
              doStart(pendingDifficulty);
            }}
            onCancel={() => setShowBetModal(false)}
          />
        )}
        <h2 className="text-xl font-semibold text-text mb-2">Jeu de Mémoire</h2>
        <p className="text-sm text-text-muted mb-6">
          Associe les paires de champions le plus vite possible.
        </p>

        <div className="mb-6">
          <p className="text-base text-text">{state.highScore}</p>
          <p className="text-sm text-text-muted">Meilleur score</p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-text-muted mb-3">Difficulté</p>
          <div className="flex gap-2 justify-center">
            {(["easy", "medium", "hard"] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={cn(
                  "px-3 py-2 rounded-md border text-sm capitalize transition-colors",
                  selectedDifficulty === diff
                    ? "border-accent bg-accent/10 text-text"
                    : "border-border bg-bg text-text-muted hover:bg-surface-hover",
                )}
              >
                {diff}
                <span className="block text-xs text-text-muted">
                  {difficultySettings[diff].pairs} paires
                </span>
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="primary"
          onClick={() => handleStart(selectedDifficulty)}
        >
          Commencer
        </Button>
      </Card>
    );
  }

  if (state.status === "won") {
    return (
      <Card className="p-8 text-center max-w-sm mx-auto">
        {showBetModal && (
          <BetModal
            gameId="memory-match"
            onConfirm={(b) => {
              setBet(b);
              setShowBetModal(false);
              doStart(pendingDifficulty);
            }}
            onCancel={() => setShowBetModal(false)}
          />
        )}
        <h2 className="text-xl font-semibold text-text mb-2">Victoire</h2>
        <p className="text-sm text-text-muted mb-6">
          Tu as trouvé toutes les paires.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-base text-text">{state.score}</p>
            <p className="text-sm text-text-muted">Score</p>
          </div>
          <div>
            <p className="text-base text-text">{state.data.moves}</p>
            <p className="text-sm text-text-muted">Coups</p>
          </div>
          <div>
            <p className="text-base text-text">
              {formatTime(state.data.elapsedTime)}
            </p>
            <p className="text-sm text-text-muted">Temps</p>
          </div>
        </div>

        {state.score > state.highScore && (
          <p className="text-sm text-text mb-4">Nouveau meilleur score.</p>
        )}

        <div className="flex justify-center gap-2">
          <Button
            variant="primary"
            onClick={() => {
              setPendingDifficulty(state.data.difficulty);
              setShowBetModal(true);
            }}
          >
            Rejouer
          </Button>
          <Button variant="secondary" onClick={resetGame}>
            Menu
          </Button>
        </div>
      </Card>
    );
  }

  const { cols } = difficultySettings[state.data.difficulty];

  return (
    <div className="rounded-md border border-border bg-surface p-6">
      <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
        <div>
          <p className="text-sm text-text-muted">Coups</p>
          <p className="text-base text-text">{state.data.moves}</p>
        </div>
        <div>
          <p className="text-sm text-text-muted">Paires</p>
          <p className="text-base text-text">
            {state.data.matches}/
            {difficultySettings[state.data.difficulty].pairs}
          </p>
        </div>
        <div>
          <p className="text-sm text-text-muted">Temps</p>
          <p className="text-base text-text">
            {formatTime(state.data.elapsedTime)}
          </p>
        </div>
      </div>

      <div
        className="grid gap-3 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          maxWidth: cols * 80 + (cols - 1) * 12,
        }}
      >
        {state.data.cards.map((card) => {
          const revealed = card.isFlipped || card.isMatched;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched || !state.data.canFlip}
              className={cn(
                "aspect-square rounded-md border flex items-center justify-center text-3xl transition-transform duration-300",
                card.isMatched && "opacity-50 border-border bg-bg",
                !card.isFlipped &&
                  !card.isMatched &&
                  "border-border bg-bg hover:bg-surface-hover cursor-pointer",
                card.isFlipped &&
                  !card.isMatched &&
                  "border-accent bg-accent/10",
              )}
              style={{
                perspective: 1000,
                transform: revealed ? "rotateY(0deg)" : "rotateY(180deg)",
              }}
            >
              {revealed && (
                <span className="text-3xl">
                  {champions[card.championIndex]?.emoji}
                </span>
              )}
              {!revealed && (
                <span className="text-base text-text-muted">?</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-center mt-6">
        <Button variant="ghost" size="sm" onClick={resetGame}>
          Quitter
        </Button>
      </div>
    </div>
  );
}
