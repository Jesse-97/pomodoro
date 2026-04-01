import "./timer.css";
import ProgressRing from "./ProgressRing";
import useTimer from "../../hooks/useTimer";
import { useState, useEffect } from "react";
import ModeSelector from "../modes/ModeSelector";
import GamePanel from "../games/GamePanel";

function Timer({ mode, setMode }) {

  const getTime = () => {
    if (mode === "focus") return 1500;
    if (mode === "short") return 300;
    if (mode === "long") return 900;
  };

  const getColor = () => {
  if (mode === "focus") return "#a78bfa";
  if (mode === "short") return "#6ee7b7";
  if (mode === "long") return "#fdba74";
};

  const { time, setTime, isRunning, setIsRunning } = useTimer(getTime());

  useEffect(() => {
    setTime(getTime());
    setIsRunning(false);
  }, [mode]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="timer-container glass">
      <p className="session-label">
        {mode === "focus"
          ? "FOCUS SESSION"
          : mode === "short"
          ? "SHORT BREAK"
          : "LONG BREAK"}
      </p>

      <p className="subtitle">Select a task below to get started</p>

      <ModeSelector setMode={setMode} />

      <div className="timer-circle">
        <ProgressRing time={time} total={getTime()} color={getColor()} />

        <h1 className="time-text">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </h1>
      </div>

      <div className="controls">
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Pause" : "Start"}
        </button>
      </div>
    </div>
    
  );
}

export default Timer;