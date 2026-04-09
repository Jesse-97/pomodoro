import { useCallback, useEffect, useRef, useState } from "react";

const GAME_HEIGHT = 500;
const GAME_WIDTH = 520;
const GRAVITY = 0.35;
const JUMP = -7;
const PIPE_WIDTH = 60;
const GAP = 170;

export default function FlappyBird() {
  const [birdY, setBirdY] = useState(200);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);

  const gameRef = useRef();

  // START GAME
  const startGame = useCallback(() => {
    setBirdY(200);
    setVelocity(0);
    setPipes([
      { x: 300, height: 120 },
      { x: 500, height: 180 }
    ]);
    setScore(0);
    setRunning(true);
  }, []);

  // JUMP
  const jump = useCallback(() => {
    if (!running) return;
    setVelocity(JUMP);
  }, [running]);

  // GAME LOOP
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setBirdY((y) => y + velocity);
      setVelocity((v) => v + GRAVITY);

      setPipes((prev) =>
        prev
          .map((p) => ({ ...p, x: p.x - 3 }))
          .filter((p) => p.x > -PIPE_WIDTH)
      );

      // ADD NEW PIPE
      setPipes((prev) => {
        const lastPipe = prev[prev.length - 1];
        if (!lastPipe || lastPipe.x < GAME_WIDTH - 240) {
          const minHeight = 90;
          const maxHeight = GAME_HEIGHT - GAP - 120;
          const newPipe = {
            x: GAME_WIDTH,
            height: Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight
          };
          return [...prev, newPipe];
        }
        return prev;
      });

      // SCORE
      setScore((s) => s + 1);

      // COLLISION
      pipes.forEach((pipe) => {
        if (
          pipe.x < 100 &&
          pipe.x + PIPE_WIDTH > 50 &&
          (birdY < pipe.height ||
            birdY > pipe.height + GAP)
        ) {
          setRunning(false);
        }
      });

      if (birdY > GAME_HEIGHT - 30 || birdY < 0) {
        setRunning(false);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [running, velocity, pipes, birdY]);

  // KEY CONTROLS
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!running) {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [running, startGame, jump]);

  return (
    <div
      ref={gameRef}
      style={{
        width: "80vw",
        maxWidth: GAME_WIDTH,
        height: "60vh",
        maxHeight: GAME_HEIGHT,
        background: "linear-gradient(#4fc3f7, #81d4fa)",
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        margin: "auto",
        boxShadow: "0 8px 30px rgba(0,0,0,0.18)"
      }}
      onClick={jump}
    >
      {/* BIRD */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: birdY,
          fontSize: "24px",
          transform: `rotate(${velocity * 2}deg)`
        }}
      >
        🐦
      </div>

      {/* PIPES */}
      {pipes.map((pipe, i) => (
        <div key={i}>
          {/* TOP */}
          <div
            style={{
              position: "absolute",
              left: pipe.x,
              width: PIPE_WIDTH,
              height: pipe.height,
              background: "green"
            }}
          />

          {/* BOTTOM */}
          <div
            style={{
              position: "absolute",
              left: pipe.x,
              top: pipe.height + GAP,
              width: PIPE_WIDTH,
              height: GAME_HEIGHT,
              background: "green"
            }}
          />
        </div>
      ))}

      {/* SCORE */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "20px",
          color: "#fff",
          fontWeight: "bold"
        }}
      >
        {score}
      </div>

      {/* START / GAME OVER */}
      {!running && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff"
          }}
        >
          <h2>{score === 0 ? "Flappy Bird" : "Game Over"}</h2>
          <button
            onClick={startGame}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              background: "#2e7d32",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Start
          </button>
        </div>
      )}
    </div>
  );
}