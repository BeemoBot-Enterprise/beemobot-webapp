"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import TeemoMinesweeper from "./TeemoMinesweeper";
import { GuessChampionGame } from "./GuessChampionGame";
import { DodgeSkillshotGame } from "./DodgeSkillshotGame";
import { LoLTriviaGame } from "./LoLTriviaGame";
import { MemoryMatchGame } from "./MemoryMatchGame";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "minesweeper",
    title: "Minesweeper",
    icon: "🍄",
    description: "Find all the mushrooms without stepping on them!",
    color: "honey",
  },
  {
    id: "guess",
    title: "Guess Champion",
    icon: "🎯",
    description: "Identify champions by their abilities",
    color: "blue",
  },
  {
    id: "dodge",
    title: "Dodge Skillshot",
    icon: "⚡",
    description: "Survive the incoming skillshots!",
    color: "cyan",
  },
  {
    id: "trivia",
    title: "LoL Trivia",
    icon: "🧠",
    description: "Test your League knowledge",
    color: "purple",
  },
  {
    id: "memory",
    title: "Memory Match",
    icon: "🃏",
    description: "Match champion pairs",
    color: "gold",
  },
];

const GameTabs: React.FC = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("minesweeper");

  // Handle URL parameter for tab selection
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabs.find((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const getTabColor = (color: string, isActive: boolean) => {
    const colors: Record<string, { active: string; inactive: string }> = {
      honey: {
        active: "bg-[var(--beemo-honey)] text-[var(--bg-void)]",
        inactive: "hover:bg-[var(--beemo-honey)]/20",
      },
      blue: {
        active: "bg-[var(--hextech-blue)] text-white",
        inactive: "hover:bg-[var(--hextech-blue)]/20",
      },
      cyan: {
        active: "bg-[var(--rune-cyan)] text-[var(--bg-void)]",
        inactive: "hover:bg-[var(--rune-cyan)]/20",
      },
      purple: {
        active: "bg-[var(--rune-purple)] text-white",
        inactive: "hover:bg-[var(--rune-purple)]/20",
      },
      gold: {
        active: "bg-[var(--hextech-gold)] text-[var(--bg-void)]",
        inactive: "hover:bg-[var(--hextech-gold)]/20",
      },
    };

    return isActive ? colors[color].active : colors[color].inactive;
  };

  const renderGame = () => {
    switch (activeTab) {
      case "minesweeper":
        return <TeemoMinesweeper />;
      case "guess":
        return <GuessChampionGame />;
      case "dodge":
        return <DodgeSkillshotGame />;
      case "trivia":
        return <LoLTriviaGame />;
      case "memory":
        return <MemoryMatchGame />;
      default:
        return <TeemoMinesweeper />;
    }
  };

  return (
    <div className="p-4">
      {/* Tab navigation - Desktop */}
      <div className="hidden md:flex justify-center mb-6">
        <div className="flex gap-2 glass p-2 rounded-xl">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300",
                activeTab === tab.id
                  ? getTabColor(tab.color, true) + " shadow-lg"
                  : "text-muted-foreground " + getTabColor(tab.color, false)
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-medium">{tab.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab navigation - Mobile */}
      <div className="md:hidden mb-6">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex-shrink-0 px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-300",
                activeTab === tab.id
                  ? getTabColor(tab.color, true) + " shadow-lg"
                  : "glass text-muted-foreground"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-sm font-medium whitespace-nowrap">
                {tab.title}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Game content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-xl overflow-hidden"
        >
          {renderGame()}
        </motion.div>
      </AnimatePresence>

      {/* Game description */}
      <motion.div
        key={`desc-${activeTab}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-4"
      >
        <p className="text-muted-foreground text-sm">
          {tabs.find((t) => t.id === activeTab)?.description}
        </p>
      </motion.div>
    </div>
  );
};

export default GameTabs;
