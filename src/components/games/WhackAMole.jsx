import { useState, useEffect, useRef } from "react";

const GRID = 16;

export default function WhackAMole() {
  const [score, setScore] = useState(0);
  const [activeMole, setActiveMole] = useState(null);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hitCell, setHitCell] = useState(null);
  const timerRef = useRef(null);
  const moleRef = useRef(null);
  const spawnRef = useRef(null);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
  };

  useEffect(() => {
    if (gameActive) {
      const spawn = () => {
        const idx = Math.floor(Math.random() * GRID);
        setActiveMole(idx);
        moleRef.current = setTimeout(() => {
          setActiveMole(null);
          spawn();
        }, 700 + Math.random() * 600);
      };

      spawnRef.current = spawn;
      spawn();

      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setGameActive(false);
            setActiveMole(null);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      spawnRef.current = null;
      if (timerRef.current) clearInterval(timerRef.current);
      if (moleRef.current) clearTimeout(moleRef.current);
    };
  }, [gameActive]);

  const whack = (idx) => {
    if (idx !== activeMole) return;
    setScore((s) => s + 1);
    setActiveMole(null);
    setHitCell(idx);
    if (moleRef.current) clearTimeout(moleRef.current);
    setTimeout(() => {
      setHitCell(null);
      if (gameActive && spawnRef.current) {
        spawnRef.current();
      }
    }, 150);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", maxWidth: "500px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#fff", margin: 0 }}>Whack-a-Mole</h3>
        <div style={{ display: "flex", gap: "20px", fontSize: "14px" }}>
          <span style={{ color: "#00ff00", fontWeight: "600" }}>Score: {score}</span>
          <span style={{ color: "#888" }}>Time: {timeLeft}s</span>
        </div>
      </div>

      {!gameActive && timeLeft === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <p style={{ fontSize: "48px", fontWeight: "600", margin: 0, color: "#fff" }}>{score}</p>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>moles whacked</p>
          <button
            onClick={startGame}
            style={{
              padding: "10px 20px",
              border: "1px solid #333",
              borderRadius: "6px",
              fontSize: "14px",
              backgroundColor: "#1a1a1a",
              color: "#00ff00",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Play Again
          </button>
        </div>
      ) : !gameActive ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <button
            onClick={startGame}
            style={{
              padding: "12px 24px",
              border: "1px solid #333",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              backgroundColor: "#1a1a1a",
              color: "#00ff00",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            Start Game
          </button>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          width: "80vw",
          maxWidth: "600px",
          height: "80vw",
          maxHeight: "600px",
          margin: "0 auto"
        }}>
          {Array.from({ length: GRID }).map((_, i) => (
            <button
              key={i}
              onClick={() => whack(i)}
              style={{
                aspectRatio: "1",
                borderRadius: "12px",
                border: "1.5px solid #4a8c2a",
                background: "#5aac32",
                cursor: "pointer",
                transition: "transform 100ms",
                transform: activeMole === i ? "scale(1.06)" : "scale(1)",
                position: "relative",
                overflow: "hidden",
                padding: 0
              }}
            >
              {/* hole */}
              <span
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "52%",
                  height: "32%",
                  background: "#1a1a1a",
                  borderRadius: "50%",
                  boxShadow: "inset 0 4px 8px #000",
                  display: "block",
                }}
              />
              {/* mole */}
              {(activeMole === i || hitCell === i) && (
                <span
                  style={{
                    position: "absolute",
                    bottom: "25px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "48px",
                    lineHeight: 1,
                    zIndex: 2,
                  }}
                >
                  {hitCell === i ? "💥" : "🐹"}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}