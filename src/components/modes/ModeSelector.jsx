import { useState } from "react";
import "./ModeSelector.css";

function ModeSelector({ setMode }) {
  const [active, setActive] = useState("focus");

  const handleClick = (mode) => {
    setActive(mode);
    setMode(mode);
  };

  return (
    <div className="mode-selector">
      <button
        className={active === "focus" ? "active" : ""}
        onClick={() => handleClick("focus")}
      >
        Focus
      </button>

      <button
        className={active === "short" ? "active" : ""}
        onClick={() => handleClick("short")}
      >
        Short Break
      </button>

      <button
        className={active === "long" ? "active" : ""}
        onClick={() => handleClick("long")}
      >
        Long Break
      </button>
    </div>
  );
}

export default ModeSelector;