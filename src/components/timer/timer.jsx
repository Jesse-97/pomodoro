import "./timer.css";
import ProgressRing from "./ProgressRing";
import useTimer from "../../hooks/useTimer";

function Timer() {
  const { time, isRunning, setIsRunning } = useTimer(1500);
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="timer-container glass"> 
      <p className="session-label">FOCUS SESSION</p>
      <p className="subtitle">Select a task below to get started</p>
      <div className="timer-circle">
        <ProgressRing time={time} total={1500} />
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