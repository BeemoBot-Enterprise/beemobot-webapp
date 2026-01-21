"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HexButton } from "@/components/atoms/HexButton";
import { useGameState } from "@/hooks/useGameState";
import { cn } from "@/lib/utils";

interface Skillshot {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  width: number;
  height: number;
  color: string;
  type: "linear" | "circular";
}

interface HoneyDrop {
  id: number;
  x: number;
  y: number;
}

interface GameData {
  beemoX: number;
  beemoY: number;
  skillshots: Skillshot[];
  honeyDrops: HoneyDrop[];
  invincible: boolean;
}

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const BEEMO_SIZE = 40;

export function DodgeSkillshotGame() {
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const [keys, setKeys] = useState<Set<string>>(new Set());

  const {
    state,
    startGame,
    endGame,
    updateScore,
    updateData,
    resetGame,
  } = useGameState<GameData>(
    {
      beemoX: GAME_WIDTH / 2,
      beemoY: GAME_HEIGHT / 2,
      skillshots: [],
      honeyDrops: [],
      invincible: false,
    },
    "dodge-skillshot"
  );

  const spawnSkillshot = useCallback(() => {
    const types: Array<"linear" | "circular"> = ["linear", "linear", "circular"];
    const type = types[Math.floor(Math.random() * types.length)];
    const colors = ["#FF4444", "#FF8800", "#AA44FF", "#44AAFF"];

    const side = Math.floor(Math.random() * 4);
    let x, y, angle;

    switch (side) {
      case 0: // top
        x = Math.random() * GAME_WIDTH;
        y = -20;
        angle = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
        break;
      case 1: // right
        x = GAME_WIDTH + 20;
        y = Math.random() * GAME_HEIGHT;
        angle = Math.PI + (Math.random() - 0.5) * 0.5;
        break;
      case 2: // bottom
        x = Math.random() * GAME_WIDTH;
        y = GAME_HEIGHT + 20;
        angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.5;
        break;
      default: // left
        x = -20;
        y = Math.random() * GAME_HEIGHT;
        angle = (Math.random() - 0.5) * 0.5;
    }

    const newSkillshot: Skillshot = {
      id: Date.now() + Math.random(),
      x,
      y,
      angle,
      speed: 3 + Math.random() * 2 + state.score / 500,
      width: type === "linear" ? 60 + Math.random() * 40 : 30,
      height: type === "linear" ? 15 : 30,
      color: colors[Math.floor(Math.random() * colors.length)],
      type,
    };

    return newSkillshot;
  }, [state.score]);

  const spawnHoneyDrop = useCallback(() => {
    const drop: HoneyDrop = {
      id: Date.now(),
      x: 50 + Math.random() * (GAME_WIDTH - 100),
      y: 50 + Math.random() * (GAME_HEIGHT - 100),
    };
    return drop;
  }, []);

  const checkCollision = useCallback(
    (beemoX: number, beemoY: number, skillshots: Skillshot[]) => {
      const beemoRadius = BEEMO_SIZE / 2 - 5; // Slightly smaller hitbox

      for (const shot of skillshots) {
        if (shot.type === "circular") {
          const dx = beemoX - shot.x;
          const dy = beemoY - shot.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < beemoRadius + shot.width / 2) {
            return true;
          }
        } else {
          // Linear skillshot - rectangle collision
          const rotatedBeemoX =
            Math.cos(-shot.angle) * (beemoX - shot.x) -
            Math.sin(-shot.angle) * (beemoY - shot.y);
          const rotatedBeemoY =
            Math.sin(-shot.angle) * (beemoX - shot.x) +
            Math.cos(-shot.angle) * (beemoY - shot.y);

          if (
            Math.abs(rotatedBeemoX) < shot.width / 2 + beemoRadius &&
            Math.abs(rotatedBeemoY) < shot.height / 2 + beemoRadius
          ) {
            return true;
          }
        }
      }
      return false;
    },
    []
  );

  const checkHoneyCollection = useCallback(
    (beemoX: number, beemoY: number, honeyDrops: HoneyDrop[]) => {
      const collected: number[] = [];
      const beemoRadius = BEEMO_SIZE / 2;

      honeyDrops.forEach((drop) => {
        const dx = beemoX - drop.x;
        const dy = beemoY - drop.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < beemoRadius + 15) {
          collected.push(drop.id);
        }
      });

      return collected;
    },
    []
  );

  const gameLoop = useCallback(
    (timestamp: number) => {
      if (state.status !== "playing") return;

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Move Beemo based on keys
      let { beemoX, beemoY } = state.data;
      const speed = 5;

      if (keys.has("ArrowUp") || keys.has("w") || keys.has("W")) {
        beemoY = Math.max(BEEMO_SIZE / 2, beemoY - speed);
      }
      if (keys.has("ArrowDown") || keys.has("s") || keys.has("S")) {
        beemoY = Math.min(GAME_HEIGHT - BEEMO_SIZE / 2, beemoY + speed);
      }
      if (keys.has("ArrowLeft") || keys.has("a") || keys.has("A")) {
        beemoX = Math.max(BEEMO_SIZE / 2, beemoX - speed);
      }
      if (keys.has("ArrowRight") || keys.has("d") || keys.has("D")) {
        beemoX = Math.min(GAME_WIDTH - BEEMO_SIZE / 2, beemoX + speed);
      }

      // Update skillshots
      let skillshots = state.data.skillshots.map((shot) => ({
        ...shot,
        x: shot.x + Math.cos(shot.angle) * shot.speed,
        y: shot.y + Math.sin(shot.angle) * shot.speed,
      }));

      // Remove off-screen skillshots
      skillshots = skillshots.filter(
        (shot) =>
          shot.x > -100 &&
          shot.x < GAME_WIDTH + 100 &&
          shot.y > -100 &&
          shot.y < GAME_HEIGHT + 100
      );

      // Check collision
      if (!state.data.invincible && checkCollision(beemoX, beemoY, skillshots)) {
        endGame(false);
        return;
      }

      // Check honey collection
      const collected = checkHoneyCollection(beemoX, beemoY, state.data.honeyDrops);
      let honeyDrops = state.data.honeyDrops;
      if (collected.length > 0) {
        honeyDrops = honeyDrops.filter((drop) => !collected.includes(drop.id));
        updateScore(collected.length * 25);
      }

      // Spawn new skillshots
      const spawnRate = Math.max(500, 1500 - state.score * 2);
      if (Math.random() < deltaTime / spawnRate) {
        skillshots.push(spawnSkillshot());
      }

      // Spawn honey drops
      if (Math.random() < deltaTime / 3000 && honeyDrops.length < 3) {
        honeyDrops.push(spawnHoneyDrop());
      }

      // Update score for survival
      updateScore(Math.floor(deltaTime / 100));

      updateData({
        beemoX,
        beemoY,
        skillshots,
        honeyDrops,
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    },
    [
      state.status,
      state.data,
      state.score,
      keys,
      checkCollision,
      checkHoneyCollection,
      spawnSkillshot,
      spawnHoneyDrop,
      updateData,
      updateScore,
      endGame,
    ]
  );

  useEffect(() => {
    if (state.status === "playing") {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state.status, gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(
          e.key
        )
      ) {
        e.preventDefault();
        setKeys((prev) => new Set(prev).add(e.key));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key);
        return newKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleStart = () => {
    startGame();
    updateData({
      beemoX: GAME_WIDTH / 2,
      beemoY: GAME_HEIGHT / 2,
      skillshots: [],
      honeyDrops: [],
      invincible: false,
    });
  };

  if (state.status === "idle") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <span className="text-6xl">⚡</span>
        </motion.div>
        <h2 className="text-3xl font-bold mb-4 gradient-text-hextech">
          Dodge the Skillshot
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Control Beemo with arrow keys or WASD. Dodge incoming skillshots and
          collect honey drops for bonus points!
        </p>
        <div className="flex gap-8 mb-6">
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

  if (state.status === "lost") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <span className="text-6xl">💀</span>
        </motion.div>
        <h2 className="text-3xl font-bold mb-4 text-[var(--destructive)]">
          Game Over!
        </h2>
        <p className="text-muted-foreground mb-4">You got hit by a skillshot!</p>
        <div className="flex gap-8 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--hextech-gold)]">
              {state.score}
            </p>
            <p className="text-sm text-muted-foreground">Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--rune-cyan)]">
              {state.highScore}
            </p>
            <p className="text-sm text-muted-foreground">High Score</p>
          </div>
        </div>
        <div className="flex gap-4">
          <HexButton variant="blue" onClick={handleStart}>
            Play Again
          </HexButton>
          <HexButton variant="gold" onClick={resetGame}>
            Main Menu
          </HexButton>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Score display */}
      <div className="flex justify-center mb-4">
        <div className="glass px-6 py-2 rounded-lg">
          <span className="text-lg font-bold text-[var(--hextech-gold)]">
            Score: {state.score}
          </span>
        </div>
      </div>

      {/* Game area */}
      <div
        ref={gameRef}
        className="relative mx-auto rounded-xl overflow-hidden glass"
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          background: "linear-gradient(180deg, var(--bg-void) 0%, var(--bg-deep) 100%)",
        }}
      >
        {/* Honeycomb background */}
        <div className="absolute inset-0 honeycomb-bg opacity-20" />

        {/* Beemo */}
        <motion.div
          className="absolute"
          style={{
            left: state.data.beemoX - BEEMO_SIZE / 2,
            top: state.data.beemoY - BEEMO_SIZE / 2,
            width: BEEMO_SIZE,
            height: BEEMO_SIZE,
          }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <span className="text-4xl">🐝</span>
        </motion.div>

        {/* Skillshots */}
        {state.data.skillshots.map((shot) => (
          <div
            key={shot.id}
            className="absolute"
            style={{
              left: shot.x - shot.width / 2,
              top: shot.y - shot.height / 2,
              width: shot.width,
              height: shot.height,
              backgroundColor: shot.color,
              borderRadius: shot.type === "circular" ? "50%" : "4px",
              transform: `rotate(${shot.angle}rad)`,
              boxShadow: `0 0 10px ${shot.color}`,
            }}
          />
        ))}

        {/* Honey drops */}
        {state.data.honeyDrops.map((drop) => (
          <motion.div
            key={drop.id}
            className="absolute"
            style={{
              left: drop.x - 15,
              top: drop.y - 15,
            }}
            animate={{ y: [0, -5, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="text-3xl">🍯</span>
          </motion.div>
        ))}
      </div>

      {/* Controls hint */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        Use Arrow Keys or WASD to move
      </p>
    </div>
  );
}
