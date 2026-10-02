import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import type { ExamVersion } from "../types";
import { getQuestionsForVersion } from "../data";
import { shuffle } from "../hooks/useQuiz";
import { Flashcard } from "../components/Flashcard";
import "../App.css";

/** Level 0: flashcard study mode. No scoring, just memorization. */
export function StudyLevel0() {
  const { version = "2025" } = useParams<{ version: string }>();
  const examVersion = version as ExamVersion;
  const questions = useMemo(
    () => shuffle(getQuestionsForVersion(examVersion)),
    [examVersion]
  );
  const [index, setIndex] = useState(0);

  const current = questions[index];
  if (!current) {
    return <p>No questions available.</p>;
  }

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to={`/study/${examVersion}`}>← Back to levels</Link>
      </p>
      <h1 className="page__title">Flashcards</h1>
      <p className="page__subtitle">
        Card {index + 1} of {questions.length}
      </p>
      <Flashcard key={current.id} question={current} />
      <div className="quiz-nav">
        <button
          className="btn"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          Previous
        </button>
        <button
          className="btn btn--primary"
          onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
          disabled={index === questions.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
