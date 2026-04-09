import Timer from "./components/timer/timer";
import GameView from "./components/games/GameView";
import Calendar from "./components/calendar/Calendar";
import Navigation from "./components/navigation/Navigation";
import { useEffect, useRef, useState } from "react";
import useBackgroundAudio from "./hooks/useBackgroundAudio";

function App() {
  const [activeTab, setActiveTab] = useState("focus");
  const [mode, setMode] = useState("focus");
  const [audioOption, setAudioOption] = useState(() => {
    const storedOption = localStorage.getItem("pomodoro-audio-option");
    return storedOption || "silence";
  });

  const hasMountedRef = useRef(false);
  const { setBackgroundAudioOption, triggerSessionTransition } = useBackgroundAudio();
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("pomodoro-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pomodoro-theme", theme);
  }, [theme]);

  useEffect(() => {
    const shouldLockScroll = activeTab === "games";
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = shouldLockScroll ? "hidden" : "";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("pomodoro-audio-option", audioOption);
    setBackgroundAudioOption(audioOption);
  }, [audioOption, setBackgroundAudioOption]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    triggerSessionTransition();
  }, [mode, triggerSessionTransition]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="app-container">
      {activeTab === "focus" && (
        <Timer
          mode={mode}
          setMode={setMode}
          audioOption={audioOption}
          setAudioOption={setAudioOption}
        />
      )}
      {activeTab === "games" && (
        <GameView
          mode={mode}
          setMode={setMode}
          audioOption={audioOption}
          setAudioOption={setAudioOption}
        />
      )}
      {activeTab === "calendar" && <Calendar />}

      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    </div>
  );
}

export default App;