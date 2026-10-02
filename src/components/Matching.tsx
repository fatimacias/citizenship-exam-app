import { useEffect, useMemo, useState } from "react";
import type { CivicsQuestion } from "../types";
import { shuffle } from "../hooks/useQuiz";
import "./Matching.css";

export interface MatchingProps {
  /** A small batch of questions to match in this round (e.g. 5). */
  questions: CivicsQuestion[];
  /** Called once per question as the user matches it, correct is always true for matching (no wrong answer concept beyond mismatches). */
  onMatch: (questionId: string, correct: boolean) => void;
  /** Called when every question in the batch has been matched. */
  onComplete: () => void;
}

/** Level 2: match questions to their answers 1-to-1 via click selection. */
export function Matching({ questions, onMatch, onComplete }: MatchingProps) {
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [wrongFlashId, setWrongFlashId] = useState<string | null>(null);

  const shuffledAnswers = useMemo(
    () => shuffle(questions.map((q) => ({ id: q.id, text: q.answers[0] }))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions]
  );

  useEffect(() => {
    if (questions.length > 0 && matchedIds.size === questions.length) {
      onComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedIds, questions.length]);

  function handleAnswerClick(answerQuestionId: string) {
    if (!selectedQuestionId || matchedIds.has(answerQuestionId)) return;

    if (answerQuestionId === selectedQuestionId) {
      setMatchedIds((prev) => new Set(prev).add(selectedQuestionId));
      onMatch(selectedQuestionId, true);
      setSelectedQuestionId(null);
    } else {
      setWrongFlashId(answerQuestionId);
      onMatch(selectedQuestionId, false);
      setTimeout(() => setWrongFlashId(null), 400);
    }
  }

  return (
    <div className="matching">
      <div className="matching__column">
        <h3>Questions</h3>
        {questions.map((q) => {
          const matched = matchedIds.has(q.id);
          const selected = selectedQuestionId === q.id;
          return (
            <button
              key={q.id}
              type="button"
              disabled={matched}
              className={`matching__item ${matched ? "matching__item--matched" : ""} ${
                selected ? "matching__item--selected" : ""
              }`}
              onClick={() => setSelectedQuestionId(q.id)}
            >
              {q.question}
            </button>
          );
        })}
      </div>
      <div className="matching__column">
        <h3>Answers</h3>
        {shuffledAnswers.map((a) => {
          const matched = matchedIds.has(a.id);
          const wrong = wrongFlashId === a.id;
          return (
            <button
              key={a.id}
              type="button"
              disabled={matched}
              className={`matching__item ${matched ? "matching__item--matched" : ""} ${
                wrong ? "matching__item--wrong" : ""
              }`}
              onClick={() => handleAnswerClick(a.id)}
            >
              {a.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
