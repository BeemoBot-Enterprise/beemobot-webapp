"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HexButton } from "@/components/atoms/HexButton";
import { useGameState } from "@/hooks/useGameState";
import { cn } from "@/lib/utils";

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

interface Card {
  id: number;
  championIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameData {
  cards: Card[];
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
  const {
    state,
    startGame,
    endGame,
    updateScore,
    updateData,
    resetGame,
  } = useGameState<GameData>(
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
    "memory-match"
  );

  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("easy");

  const initializeCards = useCallback((difficulty: "easy" | "medium" | "hard") => {
    const { pairs } = difficultySettings[difficulty];
    const selectedChampions = championEmojis
      .sort(() => Math.random() - 0.5)
      .slice(0, pairs);

    const cards: Card[] = [];
    selectedChampions.forEach((champ, champIndex) => {
      // Create two cards for each champion (a pair)
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

    // Shuffle cards
    const shuffledCards = cards.sort(() => Math.random() - 0.5);

    return { shuffledCards, selectedChampions };
  }, []);

  const [champions, setChampions] = useState(championEmojis.slice(0, 4));

  const handleStart = (difficulty: "easy" | "medium" | "hard") => {
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

  const handleCardClick = (cardId: number) => {
    if (!state.data.canFlip) return;

    const card = state.data.cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    if (state.data.flippedCards.length >= 2) return;

    // Flip the card
    const newCards = state.data.cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    const newFlipped = [...state.data.flippedCards, cardId];

    updateData({
      cards: newCards,
      flippedCards: newFlipped,
    });

    // Check for match if two cards are flipped
    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      const firstCard = newCards.find((c) => c.id === firstId)!;
      const secondCard = newCards.find((c) => c.id === secondId)!;

      updateData({ canFlip: false, moves: state.data.moves + 1 });

      if (firstCard.championIndex === secondCard.championIndex) {
        // Match found!
        setTimeout(() => {
          const matchedCards = newCards.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c
          );
          const newMatches = state.data.matches + 1;
          const { pairs } = difficultySettings[state.data.difficulty];

          updateData({
            cards: matchedCards,
            flippedCards: [],
            canFlip: true,
            matches: newMatches,
          });

          // Calculate score based on moves and time
          const basePoints = 50;
          const movePenalty = state.data.moves * 2;
          updateScore(Math.max(10, basePoints - movePenalty));

          // Check for win
          if (newMatches === pairs) {
            const timeTaken = Math.floor((Date.now() - state.data.startTime) / 1000);
            const timeBonus = Math.max(0, 300 - timeTaken);
            updateScore(timeBonus);
            updateData({ elapsedTime: timeTaken });
            endGame(true);
          }
        }, 500);
      } else {
        // No match - flip cards back
        setTimeout(() => {
          const resetCards = newCards.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c
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

  // Timer effect
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
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <span className="text-6xl">🃏</span>
        </motion.div>
        <h2 className="text-3xl font-bold mb-4 gradient-text-hextech">
          Memory Match
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Match champion pairs as quickly as possible! The fewer moves you make,
          the higher your score!
        </p>

        <div className="flex gap-8 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--hextech-gold)]">
              {state.highScore}
            </p>
            <p className="text-sm text-muted-foreground">High Score</p>
          </div>
        </div>

        {/* Difficulty selection */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">Select Difficulty</p>
          <div className="flex gap-3">
            {(["easy", "medium", "hard"] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={cn(
                  "px-4 py-2 rounded-lg capitalize transition-all",
                  selectedDifficulty === diff
                    ? "glass-hextech border border-[var(--hextech-blue)]"
                    : "glass hover:bg-[var(--bg-surface)]"
                )}
              >
                {diff}
                <span className="block text-xs text-muted-foreground">
                  {difficultySettings[diff].pairs} pairs
                </span>
              </button>
            ))}
          </div>
        </div>

        <HexButton
          variant="blue"
          size="lg"
          onClick={() => handleStart(selectedDifficulty)}
        >
          Start Game
        </HexButton>
      </div>
    );
  }

  if (state.status === "won") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6"
        >
          <span className="text-6xl">🎉</span>
        </motion.div>
        <h2 className="text-3xl font-bold mb-2 text-[var(--hextech-gold)]">
          Victory!
        </h2>
        <p className="text-muted-foreground mb-4">
          You matched all pairs!
        </p>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--hextech-gold)]">
              {state.score}
            </p>
            <p className="text-sm text-muted-foreground">Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--hextech-blue)]">
              {state.data.moves}
            </p>
            <p className="text-sm text-muted-foreground">Moves</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--rune-cyan)]">
              {formatTime(state.data.elapsedTime)}
            </p>
            <p className="text-sm text-muted-foreground">Time</p>
          </div>
        </div>

        {state.score > state.highScore && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[var(--rune-cyan)] font-bold mb-4"
          >
            🎉 New High Score!
          </motion.p>
        )}

        <div className="flex gap-4">
          <HexButton
            variant="blue"
            onClick={() => handleStart(state.data.difficulty)}
          >
            Play Again
          </HexButton>
          <HexButton variant="gold" onClick={resetGame}>
            Main Menu
          </HexButton>
        </div>
      </div>
    );
  }

  const { cols } = difficultySettings[state.data.difficulty];

  return (
    <div className="p-4">
      {/* Stats bar */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="glass px-4 py-2 rounded-lg">
          <span className="text-sm text-muted-foreground">Moves: </span>
          <span className="font-bold text-[var(--hextech-blue)]">
            {state.data.moves}
          </span>
        </div>
        <div className="glass px-4 py-2 rounded-lg">
          <span className="text-sm text-muted-foreground">Matches: </span>
          <span className="font-bold text-[var(--hextech-gold)]">
            {state.data.matches}/{difficultySettings[state.data.difficulty].pairs}
          </span>
        </div>
        <div className="glass px-4 py-2 rounded-lg">
          <span className="text-sm text-muted-foreground">Time: </span>
          <span className="font-bold text-[var(--rune-cyan)]">
            {formatTime(state.data.elapsedTime)}
          </span>
        </div>
      </div>

      {/* Game board */}
      <div
        className="grid gap-3 mx-auto"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          maxWidth: cols * 80 + (cols - 1) * 12,
        }}
      >
        <AnimatePresence>
          {state.data.cards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched || !state.data.canFlip}
              initial={{ scale: 0, rotateY: 180 }}
              animate={{
                scale: 1,
                rotateY: card.isFlipped || card.isMatched ? 0 : 180,
              }}
              transition={{ duration: 0.3 }}
              className={cn(
                "aspect-square rounded-xl transition-all duration-300",
                "flex items-center justify-center text-3xl",
                card.isMatched && "opacity-50",
                !card.isFlipped && !card.isMatched && "glass hover:bg-[var(--hextech-blue)]/20 cursor-pointer",
                (card.isFlipped || card.isMatched) && "glass-hextech"
              )}
              style={{ perspective: 1000 }}
            >
              {(card.isFlipped || card.isMatched) && (
                <span className="text-4xl">
                  {champions[card.championIndex]?.emoji}
                </span>
              )}
              {!card.isFlipped && !card.isMatched && (
                <span className="text-2xl opacity-30">?</span>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Quit button */}
      <div className="flex justify-center mt-6">
        <HexButton variant="honey" size="sm" onClick={resetGame}>
          Quit Game
        </HexButton>
      </div>
    </div>
  );
}
