import { useState } from "react";
import Timer from "../timer/timer";
import MiniTimer from "../timer/MiniTimer";
import GameNavbar from "./GameNavbar";
import TypingGame from "./TypingGame";
import WhackAMole from "./WhackAMole";
import MemoryGame from "./MemoryGame";
import SnakeGame from "./SnakeGame";
import TimingGame from "./TimingGame";
import FlappyBird from "./FlappyBird";
import "./GameView.css";

export default function GameView({ mode, setMode, audioOption, setAudioOption }) {
  const [activeGame, setActiveGame] = useState(null);

  const renderGame = () => {
    switch (activeGame) {
      case "typing":
        return <TypingGame />;
      case "whackamole":
        return <WhackAMole />;
      case "memory":
        return <MemoryGame />;
      case "snake":
        return <SnakeGame />;
      case "timing":
        return <TimingGame />;
      case "flappybird":
        return <FlappyBird />;
      default:
        return null;
    }
  };

  const handleSetActiveGame = (gameId) => {
    setActiveGame(gameId);
  };

  const handleCloseGame = () => {
    setActiveGame(null);
  };

  return (
    <div className="game-view">
      <GameNavbar 
        activeGame={activeGame} 
        setActiveGame={handleSetActiveGame}
        onClose={handleCloseGame}
        mode={mode}
      />

      {!activeGame ? (
        <div className="timer-centered">
          <Timer
            mode={mode}
            setMode={setMode}
            audioOption={audioOption}
            setAudioOption={setAudioOption}
          />
        </div>
      ) : (
        <div className="game-layout">
          <div className="timer-small">
            <MiniTimer mode={mode} />
          </div>
          <div className="game-container">
            {renderGame()}
          </div>
        </div>
      )}
    </div>
  );
}
