"use client";

import React, { useState, useEffect, useCallback } from "react";
import Button from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { useGameState } from "@/hooks/useGameState";
import { cn } from "@/lib/utils";
import { BetModal } from "@/components/organisms/BetModal";
import { getMyPuuid } from "@/lib/honey";

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
    options: [
      "Rabadon's Deathcap",
      "Trinity Force",
      "Infinity Edge",
      "Warmog's Armor",
    ],
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
  const { state, startGame, endGame, updateScore, updateData, resetGame } =
    useGameState<GameData>(
      {
        currentQuestionIndex: 0,
        selectedAnswer: null,
        timeLeft: QUESTION_TIME,
        answeredQuestions: [],
        correctAnswers: 0,
        showResult: false,
      },
      "lol-trivia",
    );

  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [bet, setBet] = useState<number | null>(null);
  const [showBetModal, setShowBetModal] = useState(false);

  const shuffleQuestions = useCallback(() => {
    const shuffled = [...questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    setShuffledQuestions(shuffled);
  }, []);

  const currentQuestion = shuffledQuestions[state.data.currentQuestionIndex];

  const doStart = () => {
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

  const handleStart = () => {
    setShowBetModal(true);
  };

  const handleWin = async (correctAnswers: number) => {
    if (bet) {
      const puuid = await getMyPuuid();
      if (puuid) {
        await fetch("/api/minigame-win", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            puuid,
            amount: bet * 2,
            gameId: "lol-trivia",
            score: correctAnswers,
          }),
        });
      }
    }
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
      const passed = state.data.correctAnswers >= 7;
      endGame(passed);
      if (passed) {
        handleWin(state.data.correctAnswers);
      }
    }
  };

  useEffect(() => {
    if (state.status !== "playing" || state.data.selectedAnswer !== null)
      return;

    const timer = setInterval(() => {
      updateData({ timeLeft: Math.max(0, state.data.timeLeft - 1) });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    state.status,
    state.data.selectedAnswer,
    state.data.timeLeft,
    updateData,
  ]);

  useEffect(() => {
    if (state.data.timeLeft === 0 && state.data.selectedAnswer === null) {
      updateData({ selectedAnswer: -1 });
    }
  }, [state.data.timeLeft, state.data.selectedAnswer, updateData]);

  if (state.status === "idle") {
    return (
      <Card className="p-8 text-center max-w-sm mx-auto">
        {showBetModal && (
          <BetModal
            gameId="lol-trivia"
            onConfirm={(b) => {
              setBet(b);
              setShowBetModal(false);
              doStart();
            }}
            onCancel={() => setShowBetModal(false)}
          />
        )}
        <h2 className="text-xl font-semibold text-text mb-2">LoL Trivia</h2>
        <p className="text-sm text-text-muted mb-6">
          10 questions sur LoL : champions, items, lore, esports.
          15 secondes par question.
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

  if (state.data.showResult) {
    const passed = state.data.correctAnswers >= 7;

    return (
      <Card className="p-8 text-center max-w-sm mx-auto">
        {showBetModal && (
          <BetModal
            gameId="lol-trivia"
            onConfirm={(b) => {
              setBet(b);
              setShowBetModal(false);
              doStart();
            }}
            onCancel={() => setShowBetModal(false)}
          />
        )}
        <h2 className="text-xl font-semibold text-text mb-2">
          {passed ? "Bien joué" : "Continue à pratiquer"}
        </h2>
        <p className="text-sm text-text-muted mb-6">
          {state.data.correctAnswers} / 10 bonnes réponses — {state.score} points.
        </p>
        {state.score > state.highScore && (
          <p className="text-sm text-text mb-4">Nouveau meilleur score.</p>
        )}
        <div className="flex justify-center gap-2">
          <Button variant="primary" onClick={() => setShowBetModal(true)}>
            Rejouer
          </Button>
          <Button variant="secondary" onClick={resetGame}>
            Menu
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="rounded-md border border-border bg-surface p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded border border-border bg-bg text-sm text-text-muted">
            {currentQuestion.category}
          </span>
          <span className="text-sm text-text-muted">
            Question {state.data.currentQuestionIndex + 1}/10
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-text-muted">Score</p>
            <p className="text-base text-text">{state.score}</p>
          </div>
          <div>
            <p className="text-sm text-text-muted">Temps</p>
            <p className="text-base text-text">{state.data.timeLeft}s</p>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-bg p-6 mb-6">
        <h3 className="text-base text-text text-center">
          {currentQuestion.question}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = state.data.selectedAnswer === index;
          const isCorrect = index === currentQuestion.correct;
          const showResult = state.data.selectedAnswer !== null;

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={cn(
                "p-3 rounded-md border text-left text-sm text-text transition-colors",
                !showResult &&
                  "border-border bg-bg hover:bg-surface-hover cursor-pointer",
                showResult &&
                  isCorrect &&
                  "border-accent bg-accent/10 text-text",
                showResult &&
                  isSelected &&
                  !isCorrect &&
                  "border-danger bg-danger/10 text-text",
                showResult &&
                  !isCorrect &&
                  !isSelected &&
                  "border-border bg-bg opacity-60",
              )}
            >
              <span className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-xs text-text-muted">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {state.data.selectedAnswer !== null && (
        <div className="flex justify-center mt-6">
          <Button variant="primary" onClick={nextQuestion}>
            {state.data.currentQuestionIndex < 9
              ? "Question suivante"
              : "Voir les résultats"}
          </Button>
        </div>
      )}
    </div>
  );
}
