import "./timer.css";
import ProgressRing from "./ProgressRing";
import useTimer from "../../hooks/useTimer";
import { useEffect, useState } from "react";
import ModeSelector from "../modes/ModeSelector";
import { AUDIO_OPTIONS } from "../../hooks/useBackgroundAudio";

function Timer({ mode, setMode, audioOption, setAudioOption }) {
  const sessionDuration = mode === "focus" ? 1500 : mode === "short" ? 300 : 900;
  const sessionColor = mode === "focus" ? "#a78bfa" : mode === "short" ? "#6ee7b7" : "#fdba74";

  const { time, setTime, isRunning, setIsRunning } = useTimer(sessionDuration);
  const [isImmersive, setIsImmersive] = useState(false);
  const showImmersive = isImmersive && isRunning && time > 0;

  useEffect(() => {
    setTime(sessionDuration);
    setIsRunning(false);
  }, [sessionDuration, setTime, setIsRunning]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const handleStart = () => {
    if (time === 0) {
      setTime(sessionDuration);
    }
    setIsRunning(true);
    setIsImmersive(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsImmersive(false);
  };

  if (showImmersive) {
    return (
      <div className="timer-immersive" role="dialog" aria-label="Immersive Timer Mode">
        <div className="timer-immersive-circle">
          <ProgressRing time={time} total={sessionDuration} color={sessionColor} />
          <h1 className="time-text">{minutes}:{seconds.toString().padStart(2, "0")}</h1>
        </div>

        <button className="timer-stop" onClick={handleStop}>
          Stop
        </button>
      </div>
    );
  }

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

      <div className="audio-controls">
        <label htmlFor="ambient-audio">Background Audio</label>
        <select
          id="ambient-audio"
          value={audioOption}
          onChange={(e) => setAudioOption(e.target.value)}
        >
          {AUDIO_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <ModeSelector setMode={setMode} />

      <div className="timer-circle">
        <ProgressRing time={time} total={sessionDuration} color={sessionColor} />

        <h1 className="time-text">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </h1>
      </div>

      <div className="controls">
        <button onClick={handleStart}>Start</button>
      </div>
    </div>

  );
}

export default Timer;