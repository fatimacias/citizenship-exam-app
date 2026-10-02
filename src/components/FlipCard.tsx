import { useState } from "react";
import "./Flashcard.css";

export interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  frontLabel?: string;
  backLabel?: string;
}

/**
 * Generic flip-style card, sharing styling with the civics Flashcard but
 * accepting arbitrary front/back content (used by the English vocabulary
 * practice, which isn't tied to CivicsQuestion).
 */
export function FlipCard({ front, back, frontLabel = "Word", backLabel = "Meaning" }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      className={`flashcard ${flipped ? "flashcard--flipped" : ""}`}
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
    >
      <div className="flashcard__inner">
        <div className="flashcard__face flashcard__face--front">
          <span className="flashcard__label">{frontLabel}</span>
          {front}
          <span className="flashcard__hint">Tap to reveal</span>
        </div>
        <div className="flashcard__face flashcard__face--back">
          <span className="flashcard__label">{backLabel}</span>
          {back}
          <span className="flashcard__hint">Tap to flip back</span>
        </div>
      </div>
    </button>
  );
}
