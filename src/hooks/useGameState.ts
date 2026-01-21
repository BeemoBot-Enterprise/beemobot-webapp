"use client";

import { useState, useCallback } from "react";

export type GameStatus = "idle" | "playing" | "won" | "lost" | "paused";

interface GameState<T = Record<string, unknown>> {
  status: GameStatus;
  score: number;
  highScore: number;
  level: number;
  data: T;
}

interface UseGameStateReturn<T> {
  state: GameState<T>;
  startGame: () => void;
  endGame: (won: boolean) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  updateScore: (points: number) => void;
  setScore: (score: number) => void;
  nextLevel: () => void;
  updateData: (data: Partial<T>) => void;
}

export function useGameState<T = Record<string, unknown>>(
  initialData: T,
  storageKey?: string,
): UseGameStateReturn<T> {
  const getInitialState = (): GameState<T> => {
    let highScore = 0;

    if (storageKey && typeof window !== "undefined") {
      const saved = window.localStorage.getItem(`${storageKey}_highscore`);
      if (saved) {
        highScore = parseInt(saved, 10) || 0;
      }
    }

    return {
      status: "idle",
      score: 0,
      highScore,
      level: 1,
      data: initialData,
    };
  };

  const [state, setState] = useState<GameState<T>>(getInitialState);

  const saveHighScore = useCallback(
    (score: number) => {
      if (
        storageKey &&
        typeof window !== "undefined" &&
        score > state.highScore
      ) {
        window.localStorage.setItem(
          `${storageKey}_highscore`,
          score.toString(),
        );
      }
    },
    [storageKey, state.highScore],
  );

  const startGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: "playing",
      score: 0,
      level: 1,
      data: initialData,
    }));
  }, [initialData]);

  const endGame = useCallback(
    (won: boolean) => {
      setState((prev) => {
        const newHighScore = Math.max(prev.score, prev.highScore);
        saveHighScore(prev.score);
        return {
          ...prev,
          status: won ? "won" : "lost",
          highScore: newHighScore,
        };
      });
    },
    [saveHighScore],
  );

  const pauseGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: prev.status === "playing" ? "paused" : prev.status,
    }));
  }, []);

  const resumeGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: prev.status === "paused" ? "playing" : prev.status,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      status: "idle",
      score: 0,
      level: 1,
      data: initialData,
    }));
  }, [initialData]);

  const updateScore = useCallback((points: number) => {
    setState((prev) => ({
      ...prev,
      score: prev.score + points,
    }));
  }, []);

  const setScore = useCallback((score: number) => {
    setState((prev) => ({
      ...prev,
      score,
    }));
  }, []);

  const nextLevel = useCallback(() => {
    setState((prev) => ({
      ...prev,
      level: prev.level + 1,
    }));
  }, []);

  const updateData = useCallback((data: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, ...data },
    }));
  }, []);

  return {
    state,
    startGame,
    endGame,
    pauseGame,
    resumeGame,
    resetGame,
    updateScore,
    setScore,
    nextLevel,
    updateData,
  };
}
