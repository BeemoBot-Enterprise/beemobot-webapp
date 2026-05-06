"use client";

import React, { useState, useCallback } from "react";
import Button from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import { useGameState } from "@/hooks/useGameState";
import { cn } from "@/lib/utils";
import { BetModal } from "@/components/organisms/BetModal";
import { getMyPuuid } from "@/lib/honey";

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
  currentChampion: (typeof champions)[0] | null;
  revealedAbilities: string[];
  hintsUsed: number;
  guess: string;
  streak: number;
  showResult: boolean;
  isCorrect: boolean;
}

export function GuessChampionGame() {
  const { state, startGame, updateScore, updateData, resetGame } =
    useGameState<GameData>(
      {
        currentChampion: null,
        revealedAbilities: [],
        hintsUsed: 0,
        guess: "",
        streak: 0,
        showResult: false,
        isCorrect: false,
      },
      "guess-champion",
    );

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [bet, setBet] = useState<number | null>(null);
  const [showBetModal, setShowBetModal] = useState(false);

  const selectNewChampion = useCallback(() => {
    const randomChamp = champions[Math.floor(Math.random() * champions.length)];
    updateData({
      currentChampion: randomChamp,
      revealedAbilities: ["R"],
      hintsUsed: 0,
      guess: "",
      showResult: false,
      isCorrect: false,
    });
  }, [updateData]);

  const doStart = () => {
    startGame();
    selectNewChampion();
  };

  const handleStart = () => {
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
            gameId: "guess-champion",
            score,
          }),
        });
      }
    }
  };

  const revealAbility = () => {
    const abilities = ["passive", "Q", "W", "E"];
    const available = abilities.filter(
      (a) => !state.data.revealedAbilities.includes(a),
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
      const basePoints = 100;
      const hintPenalty = state.data.hintsUsed * 15;
      const abilityBonus = (5 - state.data.revealedAbilities.length) * 10;
      const streakBonus = state.data.streak * 10;
      const points = Math.max(
        10,
        basePoints - hintPenalty + abilityBonus + streakBonus,
      );

      updateScore(points);
      updateData({
        showResult: true,
        isCorrect: true,
        streak: state.data.streak + 1,
      });
      handleWin(points);
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
      <Card className="p-8 text-center max-w-sm mx-auto">
        {showBetModal && (
          <BetModal
            gameId="guess-champion"
            onConfirm={(b) => {
              setBet(b);
              setShowBetModal(false);
              doStart();
            }}
            onCancel={() => setShowBetModal(false)}
          />
        )}
        <h2 className="text-xl font-semibold text-text mb-2">
          Devine le Champion
        </h2>
        <p className="text-sm text-text-muted mb-6">
          Identifie le champion grâce à ses compétences. Moins tu utilises
          d&apos;indices, plus tu gagnes de points.
        </p>
        <div className="mb-6">
          <p className="text-base text-text">{state.highScore}</p>
          <p className="text-sm text-text-muted">Meilleur score</p>
        </div>
        <Button variant="primary" onClick={handleStart}>
          Commencer
        </Button>
      </Card>
    );
  }

  return (
    <div className="rounded-md border border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-6">
          <div>
            <p className="text-sm text-text-muted">Score</p>
            <p className="text-base text-text">{state.score}</p>
          </div>
          <div>
            <p className="text-sm text-text-muted">Série</p>
            <p className="text-base text-text">{state.data.streak}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={resetGame}>
          Terminer
        </Button>
      </div>

      {!state.data.showResult ? (
        <div>
          <div className="rounded-md border border-border bg-bg p-4 mb-6">
            <p className="text-sm text-text-muted text-center mb-4">
              Identifie le champion grâce à ses compétences :
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {["passive", "Q", "W", "E", "R"].map((key) => {
                const revealed = state.data.revealedAbilities.includes(key);
                return (
                  <div
                    key={key}
                    className={cn(
                      "rounded-md border border-border p-3 text-center",
                      revealed ? "bg-surface" : "bg-bg opacity-50",
                    )}
                  >
                    <p className="text-sm text-text-muted mb-1">
                      {key === "passive" ? "Passive" : key}
                    </p>
                    <p className="text-sm text-text">
                      {revealed
                        ? state.data.currentChampion?.abilities[
                            key as keyof typeof state.data.currentChampion.abilities
                          ]
                        : "???"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {state.data.hintsUsed > 0 && (
            <div className="rounded-md border border-border bg-bg p-4 mb-6">
              <p className="text-sm text-text-muted mb-2">Indices :</p>
              <div className="flex flex-wrap gap-2">
                {state.data.currentChampion?.hints
                  .slice(0, state.data.hintsUsed)
                  .map((hint, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full border border-border bg-surface text-sm text-text"
                    >
                      {hint}
                    </span>
                  ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={revealAbility}
              disabled={state.data.revealedAbilities.length >= 5}
            >
              Révéler une compétence (-10)
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={useHint}
              disabled={state.data.hintsUsed >= 3}
            >
              Indice (-15)
            </Button>
          </div>

          <div className="relative max-w-md mx-auto">
            <div className="flex gap-2">
              <Input
                type="text"
                value={state.data.guess}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGuess()}
                placeholder="Nom du champion..."
                className="flex-1"
              />
              <Button
                variant="primary"
                onClick={handleGuess}
                disabled={!state.data.guess.trim()}
              >
                Deviner
              </Button>
            </div>

            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-md border border-border bg-surface overflow-hidden z-10">
                {suggestions.map((name) => (
                  <button
                    key={name}
                    onClick={() => selectSuggestion(name)}
                    className="w-full px-4 py-2 text-left text-sm text-text hover:bg-surface-hover transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold text-text mb-2">
            {state.data.isCorrect ? "Correct" : "Raté"}
          </h3>
          <p className="text-sm text-text-muted mb-6">
            Le champion était{" "}
            <span className="text-text font-medium">
              {state.data.currentChampion?.name}
            </span>
          </p>
          <Button variant="primary" onClick={nextRound}>
            Champion suivant
          </Button>
        </div>
      )}
    </div>
  );
}
