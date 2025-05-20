import { useEffect, useState } from "react";

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
}

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

  // Initialize the game board
  const initializeBoard = (): void => {
    // Create empty board
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
          }))
      );

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const row = Math.floor(Math.random() * boardSize.rows);
      const col = Math.floor(Math.random() * boardSize.cols);

      if (!newBoard[row][col].hasMine) {
        newBoard[row][col].hasMine = true;
        minesPlaced++;
      }
    }

    // Calculate adjacent mines
    for (let row = 0; row < boardSize.rows; row++) {
      for (let col = 0; col < boardSize.cols; col++) {
        if (!newBoard[row][col].hasMine) {
          let count = 0;

          // Check all 8 surrounding cells
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

    // Start timer
    if (timerInterval) clearInterval(timerInterval as NodeJS.Timeout);
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  // Handle cell click
  const handleCellClick = (row: number, col: number): void => {
    if (
      gameState !== "playing" ||
      board[row][col].isRevealed ||
      board[row][col].isFlagged
    )
      return;

    const newBoard = [...board];

    // If clicked on a mine, game over
    if (newBoard[row][col].hasMine) {
      // Reveal all mines
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

    // Recursively reveal empty cells
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

      // If the revealed cell has no adjacent mines, reveal all adjacent cells
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

    // Check if player has won
    const hasWon = newBoard.every((row) =>
      row.every((cell) => cell.isRevealed || cell.hasMine)
    );

    if (hasWon) {
      setGameState("won");
      clearInterval(timerInterval as ReturnType<typeof setInterval>);
    }
  };

  // Handle right click (flag placement)
  const handleRightClick = (
    e: React.MouseEvent,
    row: number,
    col: number
  ): void => {
    e.preventDefault();

    if (gameState !== "playing" || board[row][col].isRevealed) return;

    const newBoard = [...board];

    // Toggle flag
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

  // Set difficulty
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

  // Reset game when difficulty changes
  useEffect(() => {
    initializeBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardSize, mineCount]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  // Cell component
  const Cell: React.FC<CellProps> = ({ cell, row, col }) => {
    let content: React.ReactNode = "";
    let cellClass =
      "w-10 h-10 flex items-center justify-center font-bold transition-all duration-200 relative rounded-md overflow-hidden";

    if (cell.isRevealed) {
      if (cell.hasMine) {
        content = (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🍄</span>
          </div>
        );
        cellClass += " bg-red-600/40 border border-red-500/60 shadow-inner";
      } else {
        content = cell.adjacentMines || "";
        cellClass +=
          " bg-gray-800/70 border border-gray-700/80 shadow-inner text-lg font-semibold";

        if (cell.adjacentMines === 1) cellClass += " text-blue-400";
        else if (cell.adjacentMines === 2) cellClass += " text-green-400";
        else if (cell.adjacentMines === 3) cellClass += " text-red-400";
        else if (cell.adjacentMines === 4) cellClass += " text-purple-400";
        else if (cell.adjacentMines >= 5) cellClass += " text-yellow-400";
      }
    } else {
      // Bush appearance for unrevealed cells
      cellClass +=
        " cursor-pointer bg-green-900/50 border border-green-800/80 hover:bg-green-800/50 transform transition-transform hover:scale-105 shadow-md";
      content = (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="w-full h-full"
          >
            <path
              d="M20,80 Q30,60 50,70 Q70,80 80,60 Q90,50 80,40 Q70,30 60,40 Q40,30 30,20 Q20,30 30,50 Q20,70 20,80 Z"
              fill="#075E22"
            />
            <path
              d="M30,70 Q40,50 60,60 Q70,70 60,50 Q50,40 40,50 Q30,60 30,70 Z"
              fill="#0A8C33"
            />
          </svg>
        </div>
      );

      if (cell.isFlagged) {
        content = (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-red-500/20">
            <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">!</span>
            </div>
          </div>
        );
      }
    }

    return (
      <div
        className={cellClass}
        onClick={() => handleCellClick(row, col)}
        onContextMenu={(e) => handleRightClick(e, row, col)}
      >
        {content}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center p-6 rounded-xl max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-yellow-400">
        Le champ de champignons de Teemo
      </h1>

      <div className="mb-6 flex flex-col md:flex-row justify-between w-full items-center gap-4">
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 text-sm rounded-lg ${
              difficulty === "easy"
                ? "bg-gradient-to-r from-green-600 to-green-500 shadow-lg"
                : "bg-green-800/50"
            } transition-all duration-300 hover:scale-105`}
            onClick={() => setGameDifficulty("easy")}
          >
            Facile
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-lg ${
              difficulty === "medium"
                ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg"
                : "bg-blue-800/50"
            } transition-all duration-300 hover:scale-105`}
            onClick={() => setGameDifficulty("medium")}
          >
            Moyen
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-lg ${
              difficulty === "hard"
                ? "bg-gradient-to-r from-red-600 to-red-500 shadow-lg"
                : "bg-red-800/50"
            } transition-all duration-300 hover:scale-105`}
            onClick={() => setGameDifficulty("hard")}
          >
            Difficile
          </button>
        </div>

        <div className="flex gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg text-center shadow-lg">
            <span className="text-red-400 text-lg font-medium">
              🍄 {mineCount - flagsPlaced}
            </span>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg text-center shadow-lg">
            <span className="text-blue-400 text-lg font-medium">
              ⏱️ {timer}s
            </span>
          </div>
        </div>
      </div>

      {gameState === "lost" && (
        <div className="mb-6 bg-gradient-to-r from-red-900/70 to-red-800/70 backdrop-blur-md text-center py-4 px-6 rounded-xl w-full border border-red-500/20 shadow-lg">
          <p className="text-2xl font-bold mb-2">
            Vous avez marché sur un champignon de Teemo ! Partie terminée !
          </p>
          <p className="text-gray-300 mb-4">
            Ne vous inquiétez pas, vous détecterez mieux les champignons la
            prochaine fois.
          </p>
          <button
            className="mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            onClick={initializeBoard}
          >
            Réessayer
          </button>
        </div>
      )}

      {gameState === "won" && (
        <div className="mb-6 bg-gradient-to-r from-green-900/70 to-green-800/70 backdrop-blur-md text-center py-4 px-6 rounded-xl w-full border border-green-500/20 shadow-lg">
          <p className="text-2xl font-bold mb-2">
            Vous avez nettoyé le champ ! Victoire !
          </p>
          <p className="text-gray-300 mb-4">
            Même le Capitaine Teemo n'a pas pu vous piéger !
          </p>
          <button
            className="mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
            onClick={initializeBoard}
          >
            Rejouer
          </button>
        </div>
      )}

      <div className="bg-[#1a1c2a]/60 p-4 rounded-xl border border-blue-500/20 backdrop-blur-md shadow-2xl">
        <div
          className="grid gap-[1px] bg-gray-800/30 p-1 rounded-lg"
          style={{
            gridTemplateRows: `repeat(${boardSize.rows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${boardSize.cols}, minmax(0, 1fr))`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                row={rowIndex}
                col={colIndex}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-300 mb-2 italic">
          Clic gauche pour révéler une case. Clic droit pour placer un drapeau
          sur les champignons suspects.
        </p>
        <p className="text-xs text-gray-400">
          "La taille importe peu. Capitaine Teemo au service !" - Teemo
        </p>
      </div>
    </div>
  );
};

export default TeemoMinesweeper;
