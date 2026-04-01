import "./Games.css";

function GamePanel({ mode }) {
  const isBreak = mode !== "focus";

  return (
    <div className="game-panel glass">
      {!isBreak && (
        <div className="locked">
          <p>🔒 Games available during breaks</p>
        </div>
      )}

      {isBreak && (
        <div className="games">
          <button>Focus Tap</button>
          <button>Pattern Recall</button>
        </div>
      )}
    </div>
  );
}

export default GamePanel;