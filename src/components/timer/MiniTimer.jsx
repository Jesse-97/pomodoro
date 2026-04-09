import ProgressRing from "../timer/ProgressRing";
import useTimer from "../../hooks/useTimer";
import { useEffect } from "react";
import "./MiniTimer.css";

export default function MiniTimer({ mode }) {
  const sessionDuration = mode === "focus" ? 1500 : mode === "short" ? 300 : 900;
  const sessionColor = mode === "focus" ? "#a78bfa" : mode === "short" ? "#6ee7b7" : "#fdba74";

  const { time, setTime, isRunning, setIsRunning } = useTimer(sessionDuration);

  useEffect(() => {
    setTime(sessionDuration);
    setIsRunning(false);
  }, [sessionDuration, setTime, setIsRunning]);

  // Auto-stop when break time ends
  useEffect(() => {
    if (time === 0 && isRunning && (mode === "short" || mode === "long")) {
      setIsRunning(false);
    }
  }, [time, isRunning, mode, setIsRunning]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const isBreakActive = (mode === "short" || mode === "long");
  const isFocusMode = mode === "focus";

  return (
    <div className="mini-timer">
      <div className="mini-timer-circle">
        <ProgressRing time={time} total={sessionDuration} color={sessionColor} />
        <div className="mini-time-text">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </div>
      </div>
      
      {isFocusMode && (
        <div className="focus-notice">Focus Time</div>
      )}
      
      {isBreakActive && (
        <div className="break-notice">Break Time 🎮</div>
      )}

      <button
        className="mini-timer-btn"
        onClick={() => setIsRunning(!isRunning)}
        title={isRunning ? "Pause" : "Start"}
      >
        {isRunning ? "⏸" : "▶"}
      </button>
    </div>
  );
}
