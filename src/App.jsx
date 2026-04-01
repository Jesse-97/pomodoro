import Timer from "./components/timer/timer";
import GamePanel from "./components/games/GamePanel";
import { useState } from "react";

function App() {
  const [mode, setMode] = useState("focus");

  return (
    <div className="app-container">
      <Timer mode={mode} setMode={setMode} />

      <GamePanel mode={mode} />
    </div>
  );
}

export default App;