import { useState, useEffect } from "react";

function SnakeGame() {
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState([0, 1]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp") setDirection([-1, 0]);
      if (e.key === "ArrowDown") setDirection([1, 0]);
      if (e.key === "ArrowLeft") setDirection([0, -1]);
      if (e.key === "ArrowRight") setDirection([0, 1]);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = [
          prevSnake[0][0] + direction[0],
          prevSnake[0][1] + direction[1],
        ];

        const newSnake = [newHead, ...prevSnake];

        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setFood([
            Math.floor(Math.random() * 15),
            Math.floor(Math.random() * 15),
          ]);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [direction, running, food]);

  const startGame = () => {
    setSnake([[5, 5]]);
    setDirection([0, 1]);
    setRunning(true);
  };

  return (
    <div className="snake-game">
      <div className="grid">
        {[...Array(15)].map((_, row) =>
          [...Array(15)].map((_, col) => {
            const isSnake = snake.some(
              ([x, y]) => x === row && y === col
            );
            const isFood = food[0] === row && food[1] === col;

            return (
              <div
                key={`${row}-${col}`}
                className={`cell ${isSnake ? "snake" : ""} ${
                  isFood ? "food" : ""
                }`}
              ></div>
            );
          })
        )}
      </div>

      <button onClick={startGame}>
        {running ? "Restart" : "Start"}
      </button>
    </div>
  );
}

export default SnakeGame;