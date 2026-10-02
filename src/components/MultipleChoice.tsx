import { useMemo, useState } from "react";
import type { CivicsQuestion } from "../types";
import { shuffle } from "../hooks/useQuiz";
import "./MultipleChoice.css";

export interface MultipleChoiceProps {
  question: CivicsQuestion;
  /** All questions in the current pool, used to source plausible distractors. */
  pool: CivicsQuestion[];
  onAnswer: (correct: boolean) => void;
}

/**
 * Level 1: pick the correct answer among several options. Callers should
 * remount this component (e.g. via `key={question.id}`) when moving to a
 * new question, so selection state resets naturally.
 */
export function MultipleChoice({ question, pool, onAnswer }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const correctAnswer = question.answers[0];

  const options = useMemo(() => {
    const distractorPool = pool.filter((q) => q.id !== question.id);
    const distractors = shuffle(distractorPool)
      .slice(0, 3)
      .map((q) => q.answers[0]);
    return shuffle([correctAnswer, ...distractors]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  function handleSelect(option: string) {
    if (selected) return; // lock after first choice
    setSelected(option);
    onAnswer(option === correctAnswer);
  }

  return (
    <div className="mc">
      <p className="mc__question">{question.question}</p>
      <div className="mc__options">
        {options.map((option) => {
          const isCorrect = option === correctAnswer;
          const isSelected = option === selected;
          let stateClass = "";
          if (selected) {
            if (isCorrect) stateClass = "mc__option--correct";
            else if (isSelected) stateClass = "mc__option--incorrect";
          }
          return (
            <button
              key={option}
              type="button"
              className={`mc__option ${stateClass}`}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
            >
              {option}
            </button>
          );
        })}
      </div>
      {selected && (
        <p className="mc__feedback">
          {selected === correctAnswer ? "Correct!" : `Correct answer: ${correctAnswer}`}
        </p>
      )}
    </div>
  );
}
