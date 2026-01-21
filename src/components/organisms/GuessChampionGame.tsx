"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HexButton } from "@/components/atoms/HexButton";
import { useGameState } from "@/hooks/useGameState";
import { cn } from "@/lib/utils";

// Champion data with ability descriptions
const champions = [
  {
    name: "Ahri",
    abilities: {
      passive: "Essence Theft",
      Q: "Orb of Deception",
      W: "Fox-Fire",
      E: "Charm",
      R: "Spirit Rush",
    },
    hints: ["Nine-tailed", "Vastayan", "Mid lane mage"],
  },
  {
    name: "Yasuo",
    abilities: {
      passive: "Way of the Wanderer",
      Q: "Steel Tempest",
      W: "Wind Wall",
      E: "Sweeping Blade",
      R: "Last Breath",
    },
    hints: ["Ionian swordsman", "Wind technique", "Hasagi!"],
  },
  {
    name: "Jinx",
    abilities: {
      passive: "Get Excited!",
      Q: "Switcheroo!",
      W: "Zap!",
      E: "Flame Chompers!",
      R: "Super Mega Death Rocket!",
    },
    hints: ["Zaun criminal", "Pow-Pow and Fishbones", "Vi's sister"],
  },
  {
    name: "Lux",
    abilities: {
      passive: "Illumination",
      Q: "Light Binding",
      W: "Prismatic Barrier",
      E: "Lucent Singularity",
      R: "Final Spark",
    },
    hints: ["Demacian mage", "Light magic", "Garen's sister"],
  },
  {
    name: "Lee Sin",
    abilities: {
      passive: "Flurry",
      Q: "Sonic Wave / Resonating Strike",
      W: "Safeguard / Iron Will",
      E: "Tempest / Cripple",
      R: "Dragon's Rage",
    },
    hints: ["Blind monk", "Ionian martial artist", "Insec kick"],
  },
  {
    name: "Thresh",
    abilities: {
      passive: "Damnation",
      Q: "Death Sentence",
      W: "Dark Passage",
      E: "Flay",
      R: "The Box",
    },
    hints: ["Soul collector", "Chain warden", "Support/Hook"],
  },
  {
    name: "Zed",
    abilities: {
      passive: "Contempt for the Weak",
      Q: "Razor Shuriken",
      W: "Living Shadow",
      E: "Shadow Slash",
      R: "Death Mark",
    },
    hints: ["Shadow assassin", "Ninja", "The unseen blade"],
  },
  {
    name: "Ezreal",
    abilities: {
      passive: "Rising Spell Force",
      Q: "Mystic Shot",
      W: "Essence Flux",
      E: "Arcane Shift",
      R: "Trueshot Barrage",
    },
    hints: ["Piltover explorer", "Archaeologist", "You belong in a museum"],
  },
  {
    name: "Teemo",
    abilities: {
      passive: "Guerrilla Warfare",
      Q: "Blinding Dart",
      W: "Move Quick",
      E: "Toxic Shot",
      R: "Noxious Trap",
    },
    hints: ["Yordle scout", "Mushrooms", "Satan"],
  },
  {
    name: "Darius",
    abilities: {
      passive: "Hemorrhage",
      Q: "Decimate",
      W: "Crippling Strike",
      E: "Apprehend",
      R: "Noxian Guillotine",
    },
    hints: ["Hand of Noxus", "Axe wielder", "Dunk master"],
  },
];

interface GameData {
  currentChampion: typeof champions[0] | null;
  revealedAbilities: string[];
  hintsUsed: number;
  guess: string;
  streak: number;
  showResult: boolean;
  isCorrect: boolean;
}

export function GuessChampionGame() {
  const {
    state,
    startGame,
    endGame,
    updateScore,
    updateData,
    resetGame,
  } = useGameState<GameData>(
    {
      currentChampion: null,
      revealedAbilities: [],
      hintsUsed: 0,
      guess: "",
      streak: 0,
      showResult: false,
      isCorrect: false,
    },
    "guess-champion"
  );

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const selectNewChampion = useCallback(() => {
    const randomChamp = champions[Math.floor(Math.random() * champions.length)];
    updateData({
      currentChampion: randomChamp,
      revealedAbilities: ["R"], // Start by showing ultimate
      hintsUsed: 0,
      guess: "",
      showResult: false,
      isCorrect: false,
    });
  }, [updateData]);

  const handleStart = () => {
    startGame();
    selectNewChampion();
  };

  const revealAbility = () => {
    const abilities = ["passive", "Q", "W", "E"];
    const available = abilities.filter(
      (a) => !state.data.revealedAbilities.includes(a)
    );
    if (available.length > 0) {
      const next = available[Math.floor(Math.random() * available.length)];
      updateData({
        revealedAbilities: [...state.data.revealedAbilities, next],
      });
    }
  };

  const useHint = () => {
    if (state.data.hintsUsed < 3) {
      updateData({ hintsUsed: state.data.hintsUsed + 1 });
    }
  };

  const handleGuess = () => {
    if (!state.data.currentChampion || !state.data.guess.trim()) return;

    const isCorrect =
      state.data.guess.toLowerCase().trim() ===
      state.data.currentChampion.name.toLowerCase();

    if (isCorrect) {
      // Calculate points based on hints used and abilities revealed
      const basePoints = 100;
      const hintPenalty = state.data.hintsUsed * 15;
      const abilityBonus = (5 - state.data.revealedAbilities.length) * 10;
      const streakBonus = state.data.streak * 10;
      const points = Math.max(10, basePoints - hintPenalty + abilityBonus + streakBonus);

      updateScore(points);
      updateData({
        showResult: true,
        isCorrect: true,
        streak: state.data.streak + 1,
      });
    } else {
      updateData({
        showResult: true,
        isCorrect: false,
        streak: 0,
      });
    }
  };

  const nextRound = () => {
    selectNewChampion();
  };

  const handleInputChange = (value: string) => {
    updateData({ guess: value });

    // Generate suggestions
    if (value.length > 0) {
      const filtered = champions
        .filter((c) => c.name.toLowerCase().startsWith(value.toLowerCase()))
        .map((c) => c.name)
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (name: string) => {
    updateData({ guess: name });
    setSuggestions([]);
  };

  if (state.status === "idle") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <span className="text-6xl">🎯</span>
        </motion.div>
        <h2 className="text-3xl font-bold mb-4 gradient-text-hextech">
          Guess the Champion
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Identify the champion based on their ability names. The fewer hints
          you use, the more points you earn!
        </p>
        <div className="flex gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--hextech-gold)]">
              {state.highScore}
            </p>
            <p className="text-sm text-muted-foreground">High Score</p>
          </div>
        </div>
        <HexButton variant="blue" size="lg" onClick={handleStart}>
          Start Game
        </HexButton>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Score bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="glass px-4 py-2 rounded-lg">
            <span className="text-sm text-muted-foreground">Score: </span>
            <span className="font-bold text-[var(--hextech-gold)]">
              {state.score}
            </span>
          </div>
          <div className="glass px-4 py-2 rounded-lg">
            <span className="text-sm text-muted-foreground">Streak: </span>
            <span className="font-bold text-[var(--rune-cyan)]">
              {state.data.streak}🔥
            </span>
          </div>
        </div>
        <HexButton variant="honey" size="sm" onClick={resetGame}>
          End Game
        </HexButton>
      </div>

      {/* Game content */}
      <AnimatePresence mode="wait">
        {!state.data.showResult ? (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Ability display */}
            <div className="glass rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Identify this champion by their abilities:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {["passive", "Q", "W", "E", "R"].map((key) => (
                  <div
                    key={key}
                    className={cn(
                      "p-4 rounded-lg text-center transition-all",
                      state.data.revealedAbilities.includes(key)
                        ? "glass-hextech"
                        : "glass opacity-50"
                    )}
                  >
                    <span className="text-xs text-muted-foreground block mb-1">
                      {key === "passive" ? "Passive" : key}
                    </span>
                    <span className="text-sm font-medium">
                      {state.data.revealedAbilities.includes(key)
                        ? state.data.currentChampion?.abilities[
                            key as keyof typeof state.data.currentChampion.abilities
                          ]
                        : "???"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hints */}
            {state.data.hintsUsed > 0 && (
              <div className="glass rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Hints:</p>
                <div className="flex flex-wrap gap-2">
                  {state.data.currentChampion?.hints
                    .slice(0, state.data.hintsUsed)
                    .map((hint, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full glass-hextech text-sm"
                      >
                        {hint}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mb-6 justify-center">
              <HexButton
                variant="blue"
                size="sm"
                onClick={revealAbility}
                disabled={state.data.revealedAbilities.length >= 5}
              >
                Reveal Ability (-10 pts)
              </HexButton>
              <HexButton
                variant="gold"
                size="sm"
                onClick={useHint}
                disabled={state.data.hintsUsed >= 3}
              >
                Get Hint (-15 pts)
              </HexButton>
            </div>

            {/* Input */}
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                value={state.data.guess}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleGuess()}
                placeholder="Enter champion name..."
                className="w-full px-4 py-3 rounded-lg glass border border-[var(--hextech-blue)]/30 focus:border-[var(--hextech-blue)] focus:outline-none bg-transparent"
              />

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 glass rounded-lg overflow-hidden z-10">
                  {suggestions.map((name) => (
                    <button
                      key={name}
                      onClick={() => selectSuggestion(name)}
                      className="w-full px-4 py-2 text-left hover:bg-[var(--hextech-blue)]/20 transition-colors"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}

              <HexButton
                variant="blue"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={handleGuess}
                disabled={!state.data.guess.trim()}
              >
                Guess!
              </HexButton>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-8"
          >
            <div className="text-6xl mb-4">
              {state.data.isCorrect ? "🎉" : "😢"}
            </div>
            <h3
              className={cn(
                "text-2xl font-bold mb-2",
                state.data.isCorrect
                  ? "text-[var(--rune-cyan)]"
                  : "text-[var(--destructive)]"
              )}
            >
              {state.data.isCorrect ? "Correct!" : "Wrong!"}
            </h3>
            <p className="text-muted-foreground mb-6">
              The champion was{" "}
              <span className="text-[var(--hextech-gold)] font-bold">
                {state.data.currentChampion?.name}
              </span>
            </p>
            <HexButton variant="blue" onClick={nextRound}>
              Next Champion
            </HexButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
