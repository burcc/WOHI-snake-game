import React, { useState, useEffect, useCallback } from "react";
import Board from "./components/Board";
import beepSound from "./assets/beep.mp3";
import gameOverSound from "./assets/gameover.mp3"; // Import the game-over sound

const App = () => {
  // Initial states
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [boardSize] = useState(20);
  const [speed, setSpeed] = useState(200);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [level, setLevel] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0); // New score state

  // Load the sound files
  const beep = new Audio(beepSound);
  const gameOverBeep = new Audio(gameOverSound);

  const changeDirection = useCallback(
    (e) => {
      const { key } = e;
      const newDirection = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
      }[key];

      if (!newDirection) return;

      if (
        (direction === "UP" && newDirection === "DOWN") ||
        (direction === "DOWN" && newDirection === "UP") ||
        (direction === "LEFT" && newDirection === "RIGHT") ||
        (direction === "RIGHT" && newDirection === "LEFT")
      ) {
        return;
      }

      setDirection(newDirection);
    },
    [direction]
  );

  useEffect(() => {
    document.addEventListener("keydown", changeDirection);
    return () => document.removeEventListener("keydown", changeDirection);
  }, [changeDirection]);

  const generateFood = () => {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * boardSize),
        Math.floor(Math.random() * boardSize),
      ];
    } while (snake.some((segment) => segment[0] === newFood[0] && segment[1] === newFood[1]));
    setFood(newFood);
  };

  useEffect(() => {
    if (!isGameStarted || gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = [...prevSnake[0]];

        switch (direction) {
          case "UP":
            head[1] -= 1;
            break;
          case "DOWN":
            head[1] += 1;
            break;
          case "LEFT":
            head[0] -= 1;
            break;
          case "RIGHT":
            head[0] += 1;
            break;
          default:
            break;
        }

        if (head[0] < 0 || head[1] < 0 || head[0] >= boardSize || head[1] >= boardSize) {
          setGameOver(true);
          setIsGameStarted(false);
          gameOverBeep.play();
          return prevSnake;
        }

        if (prevSnake.some((segment) => segment[0] === head[0] && segment[1] === head[1])) {
          setGameOver(true);
          setIsGameStarted(false);
          gameOverBeep.play();
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        if (head[0] === food[0] && head[1] === food[1]) {
          generateFood();
          beep.play();
          setScore((prevScore) => prevScore + 1); // Increment score
          setSpeed((prevSpeed) => Math.max(50, prevSpeed - 10));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [direction, gameOver, isGameStarted, isPaused, snake, food, boardSize, speed, beep, gameOverBeep]);

  const resetGame = () => {
    setSnake([[5, 5]]);
    setFood([10, 10]);
    setDirection("RIGHT");
    setGameOver(false);
    setIsGameStarted(false);
    setSpeed(200);
    setLevel(null);
    setIsPaused(false);
    setScore(0); // Reset score
  };

  const startGame = (selectedLevel) => {
    setLevel(selectedLevel);
    setSpeed(selectedLevel);
    setIsGameStarted(true);
    setGameOver(false);
    setScore(0); // Reset score on new game start
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <div className="app-container">
      <div className="game-wrapper">
        <h1>Snake Game</h1>
        {isGameStarted && !gameOver && <div className="score">Score: {score}</div>}
        {!isGameStarted && level === null ? (
          <div className="level-selection">
            <h2>Select Level</h2>
            <div className="level-buttons">  {/* Use level-buttons class */}
              <button onClick={() => startGame(300)}>Easy</button>
              <button onClick={() => startGame(200)}>Medium</button>
              <button onClick={() => startGame(100)}>Hard</button>
            </div>
          </div>
        ) : gameOver ? (
          <div className="game-over">
            <h2>Game Over!</h2>
            <button onClick={resetGame}>Restart Game</button>
          </div>
        ) : (
          <>
            <Board snake={snake} food={food} boardSize={boardSize} />
            <button className="pause-button" onClick={togglePause}>
              {isPaused ? "Resume" : "Pause"}
            </button>
          </>
        )}
      </div>
    </div>
  );
  
};

export default App;
