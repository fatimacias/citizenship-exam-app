import { useState } from "react";
import type { CivicsQuestion } from "../types";
import { isAnyAnswerMatch } from "../hooks/fuzzyMatch";
import "./WriteAnswer.css";

export interface WriteAnswerProps {
  question: CivicsQuestion;
  onAnswer: (correct: boolean) => void;
}

/**
 * Level 3: free-text input, validated with lenient fuzzy matching.
 * Callers should remount this component (e.g. via `key={question.id}`)
 * when moving to a new question, so state resets naturally.
 */
export function WriteAnswer({ question, onAnswer }: WriteAnswerProps) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitted || !value.trim()) return;
    const correct = isAnyAnswerMatch(value, question.answers);
    setWasCorrect(correct);
    setSubmitted(true);
    onAnswer(correct);
  }

  return (
    <form className="write-answer" onSubmit={handleSubmit}>
      <p className="write-answer__question">{question.question}</p>
      <input
        type="text"
        className="write-answer__input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your answer..."
        disabled={submitted}
        autoComplete="off"
        autoFocus
      />
      {!submitted && (
        <button type="submit" className="write-answer__submit" disabled={!value.trim()}>
          Submit
        </button>
      )}
      {submitted && (
        <div className={`write-answer__feedback ${wasCorrect ? "is-correct" : "is-incorrect"}`}>
          <p>{wasCorrect ? "Correct!" : "Not quite."}</p>
          <p className="write-answer__accepted">
            Accepted answer{question.answers.length > 1 ? "s" : ""}: {question.answers.join(" / ")}
          </p>
        </div>
      )}
    </form>
  );
}
