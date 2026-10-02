import { useState } from "react";
import type { CivicsQuestion } from "../types";
import "./Flashcard.css";

export interface FlashcardProps {
  question: CivicsQuestion;
}

/** Level 0: flip-style flashcard, no scoring - just for memorizing. */
export function Flashcard({ question }: FlashcardProps) {
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
          <span className="flashcard__label">Question</span>
          <p>{question.question}</p>
          <span className="flashcard__hint">Tap to reveal answer</span>
        </div>
        <div className="flashcard__face flashcard__face--back">
          <span className="flashcard__label">Answer</span>
          <ul>
            {question.answers.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <span className="flashcard__hint">Tap to see question</span>
        </div>
      </div>
    </button>
  );
}
