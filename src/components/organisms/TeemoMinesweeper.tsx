"use client";

import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { cn } from "@/lib/utils";
import { BetModal } from "@/components/organisms/BetModal";
import { getMyPuuid } from "@/lib/honey";

interface Cell {
  hasMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

interface BoardSize {
  rows: number;
  cols: number;
}

type GameState = "waiting" | "playing" | "won" | "lost";
type Difficulty = "easy" | "medium" | "hard";

interface CellProps {
  cell: Cell;
  row: number;
  col: number;
  onClick: (row: number, col: number) => void;
  onRightClick: (e: React.MouseEvent, row: number, col: number) => void;
}

const adjacentColor = (n: number): string => {
  if (n === 1) return "text-accent";
  if (n === 2) return "text-text";
  if (n === 3) return "text-danger";
  if (n === 4) return "text-text";
  if (n >= 5) return "text-accent-gold";
  return "text-text";
};

const CellView = ({ cell, row, col, onClick, onRightClick }: CellProps) => {
  let content: React.ReactNode = "";
  let cellClass =
    "w-10 h-10 flex items-center justify-center text-base font-medium rounded-sm border transition-colors";

  if (cell.isRevealed) {
    if (cell.hasMine) {
      content = <span>🍄</span>;
      cellClass += " border-danger bg-danger/10";
    } else {
      content = cell.adjacentMines || "";
      cellClass += " border-border bg-bg " + adjacentColor(cell.adjacentMines);
    }
  } else {
    cellClass +=
      " cursor-pointer border-border bg-surface hover:bg-surface-hover";
    if (cell.isFlagged) {
      content = <span className="text-text">!</span>;
    }
  }

  return (
    <div
      className={cellClass}
      onClick={() => onClick(row, col)}
      onContextMenu={(e) => onRightClick(e, row, col)}
    >
      {content}
    </div>
  );
};

const TeemoMinesweeper = () => {
  const [boardSize, setBoardSize] = useState<BoardSize>({ rows: 10, cols: 10 });
  const [mineCount, setMineCount] = useState<number>(15);
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [flagsPlaced, setFlagsPlaced] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [bet, setBet] = useState<number | null>(null);
  const [showBetModal, setShowBetModal] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const initializeBoard = (): void => {
    const newBoard: Cell[][] = Array(boardSize.rows)
      .fill(null)
      .map(() =>
        Array(boardSize.cols)
          .fill(null)
          .map(() => ({
            hasMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0,
          })),
      );

    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const row = Math.floor(Math.random() * boardSize.rows);
      const col = Math.floor(Math.random() * boardSize.cols);

      if (!newBoard[row][col].hasMine) {
        newBoard[row][col].hasMine = true;
        minesPlaced++;
      }
    }

    for (let row = 0; row < boardSize.rows; row++) {
      for (let col = 0; col < boardSize.cols; col++) {
        if (!newBoard[row][col].hasMine) {
          let count = 0;

          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (i === 0 && j === 0) continue;

              const newRow = row + i;
              const newCol = col + j;

              if (
                newRow >= 0 &&
                newRow < boardSize.rows &&
                newCol >= 0 &&
                newCol < boardSize.cols &&
                newBoard[newRow][newCol].hasMine
              ) {
                count++;
              }
            }
          }

          newBoard[row][col].adjacentMines = count;
        }
      }
    }

    setBoard(newBoard);
    setGameState("playing");
    setFlagsPlaced(0);
    setTimer(0);

    if (timerInterval) clearInterval(timerInterval as NodeJS.Timeout);
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const handleCellClick = (row: number, col: number): void => {
    if (
      gameState !== "playing" ||
      board[row][col].isRevealed ||
      board[row][col].isFlagged
    )
      return;

    const newBoard = [...board];

    if (newBoard[row][col].hasMine) {
      for (let i = 0; i < boardSize.rows; i++) {
        for (let j = 0; j < boardSize.cols; j++) {
          if (newBoard[i][j].hasMine) {
            newBoard[i][j].isRevealed = true;
          }
        }
      }
      setBoard(newBoard);
      setGameState("lost");
      if (timerInterval) clearInterval(timerInterval as NodeJS.Timeout);
      return;
    }

    const revealCell = (r: number, c: number): void => {
      if (
        r < 0 ||
        r >= boardSize.rows ||
        c < 0 ||
        c >= boardSize.cols ||
        newBoard[r][c].isRevealed ||
        newBoard[r][c].isFlagged
      )
        return;

      newBoard[r][c].isRevealed = true;

      if (newBoard[r][c].adjacentMines === 0) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            revealCell(r + i, c + j);
          }
        }
      }
    };

    revealCell(row, col);
    setBoard(newBoard);

    const hasWon = newBoard.every((r) =>
      r.every((cell) => cell.isRevealed || cell.hasMine),
    );

    if (hasWon) {
      setGameState("won");
      clearInterval(timerInterval as ReturnType<typeof setInterval>);
      handleWin();
    }
  };

  const handleRightClick = (
    e: React.MouseEvent,
    row: number,
    col: number,
  ): void => {
    e.preventDefault();

    if (gameState !== "playing" || board[row][col].isRevealed) return;

    const newBoard = [...board];

    if (newBoard[row][col].isFlagged) {
      newBoard[row][col].isFlagged = false;
      setFlagsPlaced(flagsPlaced - 1);
    } else {
      if (flagsPlaced < mineCount) {
        newBoard[row][col].isFlagged = true;
        setFlagsPlaced(flagsPlaced + 1);
      }
    }

    setBoard(newBoard);
  };

  const setGameDifficulty = (level: Difficulty): void => {
    let size: BoardSize, mines: number;

    switch (level) {
      case "easy":
        size = { rows: 8, cols: 8 };
        mines = 10;
        break;
      case "medium":
        size = { rows: 10, cols: 10 };
        mines = 15;
        break;
      case "hard":
        size = { rows: 12, cols: 12 };
        mines = 30;
        break;
      default:
        size = { rows: 10, cols: 10 };
        mines = 15;
    }

    setBoardSize(size);
    setMineCount(mines);
    setDifficulty(level);
  };

  const handleWin = async () => {
    if (bet) {
      const puuid = await getMyPuuid();
      if (puuid) {
        await fetch("/api/minigame-win", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            puuid,
            amount: bet * 2,
            gameId: "teemo-minesweeper",
            score: timer,
          }),
        });
      }
    }
  };

  useEffect(() => {
    if (gameStarted) {
      initializeBoard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardSize, mineCount]);

  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  if (!gameStarted) {
    return (
      <Card className="p-8 text-center max-w-sm mx-auto">
        {showBetModal && (
          <BetModal
            gameId="teemo-minesweeper"
            onConfirm={(b) => {
              setBet(b);
              setShowBetModal(false);
              setGameStarted(true);
              initializeBoard();
            }}
            onCancel={() => setShowBetModal(false)}
          />
        )}
        <h2 className="text-xl font-semibold text-text mb-2">
          Teemo Minesweeper
        </h2>
        <p className="text-sm text-text-muted mb-6">
          Évite les shrooms de Teemo. Clic droit pour poser un drapeau.
        </p>
        <div className="mb-6">
          <p className="text-sm text-text-muted mb-3">Difficulté</p>
          <div className="flex gap-2 justify-center">
            {(["easy", "medium", "hard"] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setGameDifficulty(diff)}
                className={cn(
                  "px-3 py-2 rounded-md border text-sm capitalize transition-colors",
                  difficulty === diff
                    ? "border-accent bg-accent/10 text-text"
                    : "border-border bg-bg text-text-muted hover:bg-surface-hover",
                )}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
        <Button variant="primary" onClick={() => setShowBetModal(true)}>
          Commencer
        </Button>
      </Card>
    );
  }

  return (
    <div className="rounded-md border border-border bg-surface p-6 max-w-3xl mx-auto">
      {showBetModal && (
        <BetModal
          gameId="teemo-minesweeper"
          onConfirm={(b) => {
            setBet(b);
            setShowBetModal(false);
            initializeBoard();
          }}
          onCancel={() => setShowBetModal(false)}
        />
      )}

      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2">
          {(["easy", "medium", "hard"] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setGameDifficulty(diff)}
              className={cn(
                "px-3 py-2 rounded-md border text-sm capitalize transition-colors",
                difficulty === diff
                  ? "border-accent bg-accent/10 text-text"
                  : "border-border bg-bg text-text-muted hover:bg-surface-hover",
              )}
            >
              {diff}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          <div>
            <p className="text-sm text-text-muted">Shrooms</p>
            <p className="text-base text-text">{mineCount - flagsPlaced}</p>
          </div>
          <div>
            <p className="text-sm text-text-muted">Temps</p>
            <p className="text-base text-text">{timer}s</p>
          </div>
        </div>
      </div>

      {gameState === "lost" && (
        <div className="mb-6 rounded-md border border-danger bg-danger/10 p-4 text-center">
          <p className="text-base text-text mb-3">
            Tu as marché sur un shroom. Game Over.
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="primary" onClick={() => setShowBetModal(true)}>
              Rejouer
            </Button>
            <Button variant="secondary" onClick={() => setGameStarted(false)}>
              Menu
            </Button>
          </div>
        </div>
      )}

      {gameState === "won" && (
        <div className="mb-6 rounded-md border border-accent bg-accent/10 p-4 text-center">
          <p className="text-base text-text mb-3">
            Tu as nettoyé le terrain. Bien joué.
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="primary" onClick={() => setShowBetModal(true)}>
              Rejouer
            </Button>
            <Button variant="secondary" onClick={() => setGameStarted(false)}>
              Menu
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border border-border bg-bg p-3">
        <div
          className="grid gap-1"
          style={{
            gridTemplateRows: `repeat(${boardSize.rows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${boardSize.cols}, minmax(0, 1fr))`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <CellView
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                row={rowIndex}
                col={colIndex}
                onClick={handleCellClick}
                onRightClick={handleRightClick}
              />
            )),
          )}
        </div>
      </div>

      <p className="text-center text-sm text-text-muted mt-4">
        Clic gauche pour révéler. Clic droit pour drapeau.
      </p>
    </div>
  );
};

export default TeemoMinesweeper;
