"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HexButton } from "@/components/atoms/HexButton";
import { ProgressRing } from "@/components/atoms/ProgressRing";
import { useGameState } from "@/hooks/useGameState";
import { cn } from "@/lib/utils";

interface Question {
  question: string;
  options: string[];
  correct: number;
  category: "Champions" | "Items" | "Lore" | "Esports";
}

const questions: Question[] = [
  {
    question: "Which champion has the ability 'Blinding Dart'?",
    options: ["Teemo", "Quinn", "Twitch", "Kennen"],
    correct: 0,
    category: "Champions",
  },
  {
    question: "What is the maximum number of items a champion can hold?",
    options: ["4", "5", "6", "7"],
    correct: 2,
    category: "Items",
  },
  {
    question: "Which region is Jinx originally from?",
    options: ["Piltover", "Zaun", "Noxus", "Demacia"],
    correct: 1,
    category: "Lore",
  },
  {
    question: "Which team won the 2023 World Championship?",
    options: ["T1", "Weibo Gaming", "JD Gaming", "Bilibili Gaming"],
    correct: 0,
    category: "Esports",
  },
  {
    question: "What resource does Yasuo use for his abilities?",
    options: ["Mana", "Energy", "Fury", "Flow"],
    correct: 3,
    category: "Champions",
  },
  {
    question: "Which item provides the 'Spellblade' passive?",
    options: ["Rabadon's Deathcap", "Trinity Force", "Infinity Edge", "Warmog's Armor"],
    correct: 1,
    category: "Items",
  },
  {
    question: "Who is the leader of the Demacian army?",
    options: ["Lux", "Garen", "Jarvan IV", "Xin Zhao"],
    correct: 2,
    category: "Lore",
  },
  {
    question: "Which champion was the first to be released in League of Legends?",
    options: ["Ryze", "Annie", "Ashe", "All launched together"],
    correct: 3,
    category: "Champions",
  },
  {
    question: "What does the Dragon Soul from Infernal Drake provide?",
    options: ["Movement Speed", "Attack Damage & AP", "Health Regen", "CDR"],
    correct: 1,
    category: "Items",
  },
  {
    question: "Who is Yasuo's brother?",
    options: ["Shen", "Zed", "Yone", "Akali"],
    correct: 2,
    category: "Lore",
  },
  {
    question: "What is the name of the shopkeeper in Summoner's Rift?",
    options: ["Ornn", "Bard", "No name", "Doran"],
    correct: 2,
    category: "Lore",
  },
  {
    question: "Which champion says 'The unseen blade is the deadliest'?",
    options: ["Talon", "Zed", "Katarina", "Kayn"],
    correct: 1,
    category: "Champions",
  },
  {
    question: "How many dragons spawn before the Elder Dragon?",
    options: ["3", "4", "5", "6"],
    correct: 1,
    category: "Items",
  },
  {
    question: "Which region hosts the World Championship most frequently?",
    options: ["Korea", "China", "Europe", "North America"],
    correct: 1,
    category: "Esports",
  },
  {
    question: "What is Teemo's ultimate ability?",
    options: ["Blinding Dart", "Move Quick", "Guerrilla Warfare", "Noxious Trap"],
    correct: 3,
    category: "Champions",
  },
];

interface GameData {
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  timeLeft: number;
  answeredQuestions: number[];
  correctAnswers: number;
  showResult: boolean;
}

const QUESTION_TIME = 15;

export function LoLTriviaGame() {
  const {
    state,
    startGame,
    endGame,
    updateScore,
    updateData,
    resetGame,
  } = useGameState<GameData>(
    {
      currentQuestionIndex: 0,
      selectedAnswer: null,
      timeLeft: QUESTION_TIME,
      answeredQuestions: [],
      correctAnswers: 0,
      showResult: false,
    },
    "lol-trivia"
  );

  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  const shuffleQuestions = useCallback(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);
    setShuffledQuestions(shuffled);
  }, []);

  const currentQuestion = shuffledQuestions[state.data.currentQuestionIndex];

  const handleStart = () => {
    shuffleQuestions();
    startGame();
    updateData({
      currentQuestionIndex: 0,
      selectedAnswer: null,
      timeLeft: QUESTION_TIME,
      answeredQuestions: [],
      correctAnswers: 0,
      showResult: false,
    });
  };

  const handleAnswer = (answerIndex: number) => {
    if (state.data.selectedAnswer !== null) return;

    const isCorrect = answerIndex === currentQuestion.correct;
    const timeBonus = Math.floor(state.data.timeLeft * 2);
    const points = isCorrect ? 100 + timeBonus : 0;

    updateData({
      selectedAnswer: answerIndex,
      correctAnswers: isCorrect
        ? state.data.correctAnswers + 1
        : state.data.correctAnswers,
    });
    updateScore(points);
  };

  const nextQuestion = () => {
    if (state.data.currentQuestionIndex < shuffledQuestions.length - 1) {
      updateData({
        currentQuestionIndex: state.data.currentQuestionIndex + 1,
        selectedAnswer: null,
        timeLeft: QUESTION_TIME,
      });
    } else {
      updateData({ showResult: true });
      endGame(state.data.correctAnswers >= 7);
    }
  };

  // Timer effect
  useEffect(() => {
    if (state.status !== "playing" || state.data.selectedAnswer !== null) return;

    const timer = setInterval(() => {
      updateData({ timeLeft: Math.max(0, state.data.timeLeft - 1) });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.status, state.data.selectedAnswer, state.data.timeLeft, updateData]);

  // Auto-advance when time runs out
  useEffect(() => {
    if (state.data.timeLeft === 0 && state.data.selectedAnswer === null) {
      updateData({ selectedAnswer: -1 }); // Mark as timeout
    }
  }, [state.data.timeLeft, state.data.selectedAnswer, updateData]);

  if (state.status === "idle") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <span className="text-6xl">🧠</span>
        </motion.div>
        <h2 className="text-3xl font-bold mb-4 gradient-text-hextech">
          LoL Trivia
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Test your League of Legends knowledge! Answer 10 questions about
          champions, items, lore, and esports. You have 15 seconds per question!
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
          Start Quiz
        </HexButton>
      </div>
    );
  }

  if (state.data.showResult) {
    const percentage = (state.data.correctAnswers / 10) * 100;
    const passed = percentage >= 70;

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6"
        >
          <ProgressRing
            progress={percentage}
            size={120}
            variant={passed ? "gold" : "blue"}
          >
            <span className="text-2xl font-bold">
              {state.data.correctAnswers}/10
            </span>
          </ProgressRing>
        </motion.div>

        <h2
          className={cn(
            "text-3xl font-bold mb-2",
            passed ? "text-[var(--hextech-gold)]" : "text-[var(--hextech-blue)]"
          )}
        >
          {passed ? "Challenger Level!" : "Keep Practicing!"}
        </h2>
        <p className="text-muted-foreground mb-4">
          You scored {state.score} points with {state.data.correctAnswers}{" "}
          correct answers!
        </p>

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
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              currentQuestion.category === "Champions" && "bg-blue-500/20 text-blue-400",
              currentQuestion.category === "Items" && "bg-yellow-500/20 text-yellow-400",
              currentQuestion.category === "Lore" && "bg-purple-500/20 text-purple-400",
              currentQuestion.category === "Esports" && "bg-green-500/20 text-green-400"
            )}
          >
            {currentQuestion.category}
          </span>
          <span className="text-muted-foreground">
            Question {state.data.currentQuestionIndex + 1}/10
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="glass px-4 py-2 rounded-lg">
            <span className="text-[var(--hextech-gold)] font-bold">
              {state.score} pts
            </span>
          </div>
          <ProgressRing
            progress={(state.data.timeLeft / QUESTION_TIME) * 100}
            size={50}
            strokeWidth={4}
            variant={state.data.timeLeft <= 5 ? "honey" : "blue"}
          >
            <span className="text-sm font-bold">{state.data.timeLeft}</span>
          </ProgressRing>
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.data.currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="glass rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-center">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = state.data.selectedAnswer === index;
              const isCorrect = index === currentQuestion.correct;
              const showResult = state.data.selectedAnswer !== null;

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  className={cn(
                    "p-4 rounded-xl glass text-left transition-all",
                    "border-2",
                    !showResult && "hover:border-[var(--hextech-blue)] cursor-pointer",
                    showResult && isCorrect && "border-green-500 bg-green-500/20",
                    showResult && isSelected && !isCorrect && "border-red-500 bg-red-500/20",
                    !showResult && "border-transparent"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                        showResult && isCorrect && "bg-green-500",
                        showResult && isSelected && !isCorrect && "bg-red-500",
                        !showResult && "bg-[var(--bg-surface)]"
                      )}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Next button */}
          {state.data.selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mt-6"
            >
              <HexButton variant="blue" onClick={nextQuestion}>
                {state.data.currentQuestionIndex < 9 ? "Next Question" : "See Results"}
              </HexButton>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
