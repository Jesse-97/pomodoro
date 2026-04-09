import { useState } from "react";

const symbols = ["🍎", "🌸", "⭐", "🍀", "🎵", "💜"];

function MemoryGame() {
  const [cards] = useState(() => {
    return [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({ id: index, value: item }));
  });
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  const handleClick = (card) => {
    if (flipped.length === 2 || flipped.includes(card.id)) return;

    const newFlipped = [...flipped, card.id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped.map(
        (id) => cards.find((c) => c.id === id)
      );

      if (first.value === second.value) {
        setMatched((m) => [...m, first.value]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  return (
    <div className="memory-game">
      <div className="memory-grid">
        {cards.map((card) => {
          const isFlipped =
            flipped.includes(card.id) || matched.includes(card.value);

          return (
            <div
              key={card.id}
              className={`card ${isFlipped ? "flipped" : ""}`}
              onClick={() => handleClick(card)}
            >
              {isFlipped ? card.value : "?"}
            </div>
          );
        })}
      </div>
      {matched.length === symbols.length && <p>You Win!</p>}
    </div>
  );
}

export default MemoryGame;