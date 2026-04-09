import { useState, useEffect, useRef } from "react";

const SENTENCES = [
  "The quick brown fox jumps over the lazy dog like it’s late for class and suddenly remembered there was a test today",
  "Practice makes perfect, but honestly some days it just feels like you’re practicing being confused and that’s okay too",
  "Focus is the key to unlocking your potential, but your phone notifications really have other plans for you every five minutes",
  "Every moment of concentration builds your strength, even if half those moments are spent wondering what you were doing",
  "Small steps every day lead to big achievements, unless you trip over your own plans and then start again tomorrow",
  "Discipline is choosing between what you want now and what you want most, like snacks vs success… a daily struggle",
  "The only way to do great work is to love what you do, or at least pretend you do until it starts growing on you"
];

const pickSentence = () => SENTENCES[Math.floor(Math.random() * SENTENCES.length)];

export default function TypingGame() {
  const [target, setTarget] = useState(() => pickSentence());
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [clockNow, setClockNow] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setClockNow(Date.now());
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const finishTime = endTime ?? clockNow;
  const elapsedSeconds = startTime ? Math.max(1, Math.floor((finishTime - startTime) / 1000)) : 0;
  const compareLength = Math.min(input.length, target.length);

  let correctChars = 0;
  for (let i = 0; i < compareLength; i += 1) {
    if (input[i] === target[i]) correctChars += 1;
  }

  const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100;
  const wpm = startTime ? Math.max(0, Math.round((correctChars / 5) / (elapsedSeconds / 60))) : 0;
  const isFinished = endTime !== null;

  const newRound = () => {
    setTarget(pickSentence());
    setInput("");
    setStartTime(null);
    setEndTime(null);
    setClockNow(Date.now());
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleInput = (val) => {
    if (isFinished) return;

    if (!startTime) setStartTime(Date.now());
    const limited = val.slice(0, target.length);
    setInput(limited);

    if (limited.length === target.length) {
      setEndTime(Date.now());
    }
  };

  const renderCharacter = (char, idx) => {
    const typedChar = input[idx];
    let className = "typing-char pending";

    if (typedChar !== undefined) {
      className = typedChar === char ? "typing-char correct" : "typing-char incorrect";
    } else if (idx === input.length) {
      className = "typing-char current";
    }

    return (
      <span key={`${char}-${idx}`} className={className}>
        {char}
      </span>
    );
  };

  return (
    <div className="typing-game monkeytype" onClick={() => inputRef.current?.focus()}>
      <div className="typing-meta">
        <p>Time {elapsedSeconds}s</p>
        <p>WPM {wpm}</p>
        <p>Accuracy {accuracy}%</p>
      </div>

      <p className="typing-prompt">Type the line below as fast and accurately as you can.</p>

      <div className="typing-text" aria-live="polite">
        {target.split("").map(renderCharacter)}
      </div>

      <input
        ref={inputRef}
        className="typing-input"
        value={input}
        onChange={(e) => handleInput(e.target.value)}
        disabled={isFinished}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        placeholder={isFinished ? "Round complete" : "Start typing..."}
      />

      <div className="typing-actions">
        <button onClick={newRound}>{isFinished ? "Restart" : "Reset"}</button>
      </div>
    </div>
  );
}
